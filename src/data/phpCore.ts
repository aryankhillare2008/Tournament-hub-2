import { FileItem } from '../types';

export const corePhpFiles: FileItem[] = [
  {
    name: 'config.php',
    path: 'common/config.php',
    category: 'common',
    description: 'Centralized MySQL Database Connection & Session Initializer',
    content: `<?php
// common/config.php
session_start();

$db_host = '127.0.0.1';
$db_user = 'root';
$db_pass = 'root';
$db_name = 'adept_play';

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die("Database Connection failed: " . $conn->connect_error);
}

// Helper: Check user login
function check_user_login() {
    if (!isset($_SESSION['user_id'])) {
        header("Location: login.php");
        exit();
    }
}

// Helper: Check admin login
function check_admin_login() {
    if (!isset($_SESSION['admin_id'])) {
        header("Location: login.php");
        exit();
    }
}

// Helper: Fetch App & UPI Settings
function get_app_settings($conn) {
    $res = $conn->query("SELECT * FROM settings WHERE id = 1 LIMIT 1");
    if ($res && $res->num_rows > 0) {
        return $res->fetch_assoc();
    }
    return [
        'upi_id' => 'adeptplay@upi',
        'qr_image_url' => 'assets/qr.png',
        'app_name' => 'Adept Play'
    ];
}
?>`
  },
  {
    name: 'install.php',
    path: 'install.php',
    category: 'sql',
    description: 'Database Installer & Default Admin Credentials Seeder',
    content: `<?php
// install.php - Run once to set up tables and initial admin
$db_host = '127.0.0.1';
$db_user = 'root';
$db_pass = 'root';

// Connect without selecting DB to create database
$conn = new mysqli($db_host, $db_user, $db_pass);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->query("CREATE DATABASE IF NOT EXISTS \`adept_play\`");
$conn->select_db('adept_play');

// 1. Users Table
$conn->query("CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(100) NOT NULL UNIQUE,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`wallet_balance\` DECIMAL(10,2) DEFAULT 0.00,
  \`upi_id\` VARCHAR(255) DEFAULT NULL,
  \`is_blocked\` TINYINT(1) DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// 2. Admin Table
$conn->query("CREATE TABLE IF NOT EXISTS \`admin\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(100) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL
)");

// 3. Tournaments Table
$conn->query("CREATE TABLE IF NOT EXISTS \`tournaments\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`game_name\` VARCHAR(100) NOT NULL,
  \`entry_fee\` DECIMAL(10,2) NOT NULL,
  \`prize_pool\` DECIMAL(10,2) NOT NULL,
  \`match_time\` DATETIME NOT NULL,
  \`room_id\` VARCHAR(100) DEFAULT '',
  \`room_password\` VARCHAR(100) DEFAULT '',
  \`status\` ENUM('Upcoming', 'Live', 'Completed') DEFAULT 'Upcoming',
  \`commission_percent\` INT DEFAULT 20,
  \`winner_user_id\` INT DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// 4. Participants Table
$conn->query("CREATE TABLE IF NOT EXISTS \`participants\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`tournament_id\` INT NOT NULL,
  \`joined_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// 5. Transactions Table
$conn->query("CREATE TABLE IF NOT EXISTS \`transactions\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`type\` ENUM('credit', 'debit') NOT NULL,
  \`description\` VARCHAR(255) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// 6. Deposits Table
$conn->query("CREATE TABLE IF NOT EXISTS \`deposits\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`transaction_id\` VARCHAR(100) NOT NULL,
  \`status\` ENUM('Pending', 'Completed', 'Rejected') DEFAULT 'Pending',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// 7. Withdrawals Table
$conn->query("CREATE TABLE IF NOT EXISTS \`withdrawals\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`upi_id\` VARCHAR(255) NOT NULL,
  \`status\` ENUM('Pending', 'Completed', 'Rejected') DEFAULT 'Pending',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// 8. Settings Table
$conn->query("CREATE TABLE IF NOT EXISTS \`settings\` (
  \`id\` INT PRIMARY KEY,
  \`upi_id\` VARCHAR(255) NOT NULL,
  \`qr_image_url\` VARCHAR(255) NOT NULL,
  \`app_name\` VARCHAR(100) DEFAULT 'Adept Play',
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)");

// Seed default Admin (admin / admin123)
$admin_pass = password_hash('admin123', PASSWORD_BCRYPT);
$conn->query("INSERT IGNORE INTO \`admin\` (\`id\`, \`username\`, \`password\`) VALUES (1, 'admin', '$admin_pass')");

// Seed default UPI Settings
$conn->query("INSERT IGNORE INTO \`settings\` (\`id\`, \`upi_id\`, \`qr_image_url\`, \`app_name\`) VALUES (1, 'adeptplay@upi', 'uploads/qr.png', 'Adept Play')");

header("Location: login.php?installed=1");
exit();
?>`
  },
  {
    name: 'update_database.php',
    path: 'update_database.php',
    category: 'sql',
    description: 'Safe Migration Script for Deposits, Withdrawals & User UPI ID',
    content: `<?php
// update_database.php - Safe database migration script without wiping data
require_once 'common/config.php';

// 1. Create deposits table if missing
$sql1 = "CREATE TABLE IF NOT EXISTS \`deposits\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`transaction_id\` VARCHAR(100) NOT NULL,
  \`status\` ENUM('Pending', 'Completed', 'Rejected') DEFAULT 'Pending',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conn->query($sql1);

// 2. Create withdrawals table if missing
$sql2 = "CREATE TABLE IF NOT EXISTS \`withdrawals\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`upi_id\` VARCHAR(255) NOT NULL,
  \`status\` ENUM('Pending', 'Completed', 'Rejected') DEFAULT 'Pending',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conn->query($sql2);

// 3. Create settings table if missing
$sql3 = "CREATE TABLE IF NOT EXISTS \`settings\` (
  \`id\` INT PRIMARY KEY,
  \`upi_id\` VARCHAR(255) NOT NULL,
  \`qr_image_url\` VARCHAR(255) NOT NULL,
  \`app_name\` VARCHAR(100) DEFAULT 'Adept Play',
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";
$conn->query($sql3);
$conn->query("INSERT IGNORE INTO \`settings\` (\`id\`, \`upi_id\`, \`qr_image_url\`) VALUES (1, 'adeptplay@upi', 'uploads/qr.png')");

// 4. Safely add upi_id to users if it doesn't already exist
$col_check = $conn->query("SHOW COLUMNS FROM \`users\` LIKE 'upi_id'");
if ($col_check && $col_check->num_rows == 0) {
    $conn->query("ALTER TABLE \`users\` ADD COLUMN \`upi_id\` VARCHAR(255) NULL");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Database Update</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 text-center shadow-2xl">
    <div class="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
      ✓
    </div>
    <h1 class="text-xl font-bold text-emerald-400 mb-2">Database Updated!</h1>
    <p class="text-sm text-slate-300 mb-6 leading-relaxed">
      ✅ Database schema updated successfully!<br>
      <span class="text-xs text-slate-400">Created deposits & withdrawals tables and added UPI ID column. You can now safely delete this file.</span>
    </p>
    <a href="index.php" class="block w-full py-3 bg-emerald-500 hover:bg-emerald-600 font-semibold rounded-xl text-slate-950">
      Go to Homepage
    </a>
  </div>
</body>
</html>`
  },
  {
    name: 'header.php',
    path: 'common/header.php',
    category: 'common',
    description: 'User Top Navigation Bar with Wallet Balance & Security JS',
    content: `<?php
// common/header.php
$user_id = $_SESSION['user_id'] ?? null;
$balance = 0.00;
if ($user_id) {
    $stmt = $conn->prepare("SELECT wallet_balance, username FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $u_res = $stmt->get_result()->fetch_assoc();
    if ($u_res) {
        $balance = $u_res['wallet_balance'];
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Adept Play - Esports Tournaments</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    body { -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 font-sans antialiased pb-20 select-none overflow-x-hidden">
  <!-- Top App Header -->
  <header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
    <div class="max-w-md mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
          <i class="fa-solid fa-gamepad text-sm"></i>
        </div>
        <div>
          <h1 class="font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Adept Play
          </h1>
          <p class="text-[10px] text-slate-400 -mt-1 font-medium">Esports Arena</p>
        </div>
      </div>
      <a href="wallet.php" class="flex items-center space-x-2 bg-slate-800/90 hover:bg-slate-700/80 border border-amber-500/30 px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-inner">
        <i class="fa-solid fa-wallet text-amber-400 text-xs"></i>
        <span class="text-xs font-bold text-amber-300">₹<?= number_format($balance, 2) ?></span>
      </a>
    </div>
  </header>

  <script>
    // Security & App Feel: Disable Right Click, Text Selection & Pinch Zoom
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
      if (e.key === 'F12' || (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'i'))) {
        e.preventDefault();
      }
    });
    document.addEventListener('gesturestart', e => e.preventDefault());
  </script>`
  },
  {
    name: 'bottom.php',
    path: 'common/bottom.php',
    category: 'common',
    description: 'Fixed Mobile Bottom Navigation Bar (Home, Tournaments, Wallet, Profile)',
    content: `<?php
// common/bottom.php
$current_page = basename($_SERVER['PHP_SELF']);
?>
  <!-- Fixed Bottom Navigation Bar -->
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 py-2">
    <div class="max-w-md mx-auto grid grid-cols-4 px-2">
      <a href="index.php" class="flex flex-col items-center justify-center py-1 transition-colors <?= $current_page == 'index.php' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200' ?>">
        <i class="fa-solid fa-house text-lg mb-1"></i>
        <span class="text-[11px]">Home</span>
      </a>
      <a href="my_tournaments.php" class="flex flex-col items-center justify-center py-1 transition-colors <?= $current_page == 'my_tournaments.php' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200' ?>">
        <i class="fa-solid fa-trophy text-lg mb-1"></i>
        <span class="text-[11px]">Matches</span>
      </a>
      <a href="wallet.php" class="flex flex-col items-center justify-center py-1 transition-colors <?= $current_page == 'wallet.php' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200' ?>">
        <i class="fa-solid fa-wallet text-lg mb-1"></i>
        <span class="text-[11px]">Wallet</span>
      </a>
      <a href="profile.php" class="flex flex-col items-center justify-center py-1 transition-colors <?= $current_page == 'profile.php' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200' ?>">
        <i class="fa-solid fa-user text-lg mb-1"></i>
        <span class="text-[11px]">Profile</span>
      </a>
    </div>
  </nav>
</body>
</html>`
  }
];
