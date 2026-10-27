import { FileItem } from '../types';

export const adminPhpFiles: FileItem[] = [
  {
    name: 'admin/login.php',
    path: 'admin/login.php',
    category: 'admin',
    description: 'Admin Authentication Panel',
    content: `<?php
// admin/login.php
require_once '../common/config.php';

$error = '';
if (isset($_SESSION['admin_id'])) {
    header("Location: index.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    $stmt = $conn->prepare("SELECT id, username, password FROM admin WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $admin = $stmt->get_result()->fetch_assoc();

    if ($admin && password_verify($password, $admin['password'])) {
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_user'] = $admin['username'];
        header("Location: index.php");
        exit();
    } else {
        $error = 'Invalid admin credentials.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Login - Adept Play</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body class="bg-slate-950 text-white min-h-screen flex items-center justify-center p-4">
  <div class="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
    <div class="text-center mb-6">
      <div class="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-950 font-black">
        <i class="fa-solid fa-lock text-xl"></i>
      </div>
      <h1 class="text-xl font-black uppercase">Admin Control</h1>
      <p class="text-xs text-slate-400">Adept Play Esports Master Portal</p>
    </div>

    <?php if (!empty($error)): ?>
      <div class="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-4">
        <?= htmlspecialchars($error) ?>
      </div>
    <?php endif; ?>

    <form method="POST" action="login.php" class="space-y-4">
      <div>
        <label class="block text-xs font-bold text-slate-400 mb-1">Admin Username</label>
        <input type="text" name="username" required placeholder="admin" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500">
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-400 mb-1">Password</label>
        <input type="password" name="password" required placeholder="admin123" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500">
      </div>
      <button type="submit" class="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all">
        Enter Admin Panel
      </button>
    </form>
  </div>
</body>
</html>`
  },
  {
    name: 'admin/index.php',
    path: 'admin/index.php',
    category: 'admin',
    description: 'Admin Dashboard with Key Esports & Financial Metrics',
    content: `<?php
// admin/index.php
require_once '../common/config.php';
check_admin_login();

// 1. Stats Queries
$users_cnt = $conn->query("SELECT COUNT(*) as c FROM users")->fetch_assoc()['c'];
$tourneys_cnt = $conn->query("SELECT COUNT(*) as c FROM tournaments")->fetch_assoc()['c'];
$prizes_sum = $conn->query("SELECT SUM(amount) as s FROM transactions WHERE description LIKE 'Prize Money%'")->fetch_assoc()['s'] ?? 0;
$pending_deposits = $conn->query("SELECT COUNT(*) as c FROM deposits WHERE status = 'Pending'")->fetch_assoc()['c'];
$pending_withdrawals = $conn->query("SELECT COUNT(*) as c FROM withdrawals WHERE status = 'Pending'")->fetch_assoc()['c'];

// Estimate Commission Revenue: sum of (entry_fee * participants * commission%)
$rev_query = $conn->query("SELECT SUM(t.entry_fee * (t.commission_percent/100)) as rev 
                           FROM participants p 
                           JOIN tournaments t ON p.tournament_id = t.id");
$revenue = $rev_query->fetch_assoc()['rev'] ?? 0;

// Recent Tournaments
$recent_t = $conn->query("SELECT * FROM tournaments ORDER BY id DESC LIMIT 5");

require_once 'common/header.php';
?>

<main class="max-w-4xl mx-auto px-4 py-6 space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-xl font-black text-white">Admin Dashboard</h2>
      <p class="text-xs text-slate-400">Real-time statistics & tournament administration</p>
    </div>
    <a href="tournament.php" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-amber-500/20">
      <i class="fa-solid fa-plus"></i> <span>Create Tournament</span>
    </a>
  </div>

  <!-- KPI Grid -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <p class="text-[11px] font-bold text-slate-400 uppercase">Total Users</p>
      <h3 class="text-2xl font-black text-white mt-1"><?= number_format($users_cnt) ?></h3>
    </div>
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <p class="text-[11px] font-bold text-slate-400 uppercase">Tournaments</p>
      <h3 class="text-2xl font-black text-amber-400 mt-1"><?= number_format($tourneys_cnt) ?></h3>
    </div>
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <p class="text-[11px] font-bold text-slate-400 uppercase">Prize Distributed</p>
      <h3 class="text-2xl font-black text-emerald-400 mt-1">₹<?= number_format($prizes_sum, 2) ?></h3>
    </div>
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <p class="text-[11px] font-bold text-slate-400 uppercase">Est. Revenue</p>
      <h3 class="text-2xl font-black text-cyan-400 mt-1">₹<?= number_format($revenue, 2) ?></h3>
    </div>
  </div>

  <!-- Action Alerts (Pending UPI Deposits / Withdrawals) -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <a href="deposits.php" class="bg-slate-900 border <?= $pending_deposits > 0 ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-800' ?> rounded-2xl p-4 flex items-center justify-between hover:border-amber-400 transition-all">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-base">
          <i class="fa-solid fa-qrcode"></i>
        </div>
        <div>
          <h4 class="font-bold text-sm text-white">Deposit Requests (UPI)</h4>
          <p class="text-xs text-slate-400">Manual UTR verification</p>
        </div>
      </div>
      <span class="px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full">
        <?= $pending_deposits ?> Pending
      </span>
    </a>

    <a href="withdrawals.php" class="bg-slate-900 border <?= $pending_withdrawals > 0 ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-slate-800' ?> rounded-2xl p-4 flex items-center justify-between hover:border-emerald-400 transition-all">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-base">
          <i class="fa-solid fa-money-bill-transfer"></i>
        </div>
        <div>
          <h4 class="font-bold text-sm text-white">Withdrawal Requests</h4>
          <p class="text-xs text-slate-400">Send payment to user UPI</p>
        </div>
      </div>
      <span class="px-3 py-1 bg-emerald-500 text-slate-950 font-black text-xs rounded-full">
        <?= $pending_withdrawals ?> Pending
      </span>
    </a>
  </div>

  <!-- Recent Tournaments Table -->
  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-bold text-white uppercase tracking-wider">Recent Tournaments</h3>
      <a href="tournament.php" class="text-xs text-amber-400 hover:underline">View All</a>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs text-slate-300">
        <thead class="border-b border-slate-800 text-slate-400 uppercase">
          <tr>
            <th class="py-2.5">Tournament</th>
            <th class="py-2.5">Game</th>
            <th class="py-2.5">Entry/Prize</th>
            <th class="py-2.5">Status</th>
            <th class="py-2.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60">
          <?php while ($t = $recent_t->fetch_assoc()): ?>
            <tr>
              <td class="py-3 font-semibold text-white"><?= htmlspecialchars($t['title']) ?></td>
              <td class="py-3 text-amber-400"><?= htmlspecialchars($t['game_name']) ?></td>
              <td class="py-3">₹<?= number_format($t['entry_fee']) ?> / ₹<?= number_format($t['prize_pool']) ?></td>
              <td class="py-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold <?= $t['status'] === 'Live' ? 'bg-red-500/20 text-red-400' : ($t['status'] === 'Completed' ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/20 text-emerald-400') ?>">
                  <?= $t['status'] ?>
                </span>
              </td>
              <td class="py-3 text-right">
                <a href="manage_tournament.php?id=<?= $t['id'] ?>" class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg font-bold text-[11px]">
                  Manage
                </a>
              </td>
            </tr>
          <?php endwhile; ?>
        </tbody>
      </table>
    </div>
  </div>
</main>

<?php require_once 'common/bottom.php'; ?>`
  },
  {
    name: 'admin/tournament.php',
    path: 'admin/tournament.php',
    category: 'admin',
    description: 'Create New Tournaments & List All Existing Tournaments',
    content: `<?php
// admin/tournament.php
require_once '../common/config.php';
check_admin_login();

$msg = '';
$msg_type = 'info';

// Handle Tournament Creation
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create') {
    $title = trim($_POST['title'] ?? '');
    $game_name = trim($_POST['game_name'] ?? 'BGMI');
    $entry_fee = floatval($_POST['entry_fee'] ?? 0);
    $prize_pool = floatval($_POST['prize_pool'] ?? 0);
    $match_time = $_POST['match_time'] ?? '';
    $commission = intval($_POST['commission_percent'] ?? 20);

    if (empty($title) || empty($match_time)) {
        $msg = 'Title and Match Time are required.';
        $msg_type = 'error';
    } else {
        $stmt = $conn->prepare("INSERT INTO tournaments (title, game_name, entry_fee, prize_pool, match_time, commission_percent, status) VALUES (?, ?, ?, ?, ?, ?, 'Upcoming')");
        $stmt->bind_param("ssddsi", $title, $game_name, $entry_fee, $prize_pool, $match_time, $commission);
        if ($stmt->execute()) {
            $msg = 'Tournament created successfully!';
            $msg_type = 'success';
        } else {
            $msg = 'Failed to create tournament.';
            $msg_type = 'error';
        }
    }
}

// Handle Delete Tournament
if (isset($_GET['delete'])) {
    $del_id = intval($_GET['delete']);
    $conn->query("DELETE FROM participants WHERE tournament_id = $del_id");
    $conn->query("DELETE FROM tournaments WHERE id = $del_id");
    header("Location: tournament.php?msg=deleted");
    exit();
}

$tournaments = $conn->query("SELECT t.*, (SELECT COUNT(*) FROM participants WHERE tournament_id = t.id) as joined_count FROM tournaments t ORDER BY t.id DESC");

require_once 'common/header.php';
?>

<main class="max-w-4xl mx-auto px-4 py-6 space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-black text-white">Manage Tournaments</h2>
  </div>

  <?php if (!empty($msg)): ?>
    <div class="p-3.5 rounded-xl text-xs font-semibold <?= $msg_type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30' ?>">
      <?= htmlspecialchars($msg) ?>
    </div>
  <?php endif; ?>

  <!-- Create Tournament Form -->
  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
    <h3 class="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
      <i class="fa-solid fa-plus-circle"></i>
      <span>Create New Tournament</span>
    </h3>

    <form method="POST" action="tournament.php" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input type="hidden" name="action" value="create">
      <div class="md:col-span-2">
        <label class="block text-xs font-bold text-slate-300 mb-1">Tournament Title</label>
        <input type="text" name="title" required placeholder="e.g. BGMI Erangel Mega Clash #50" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-300 mb-1">Game</label>
        <select name="game_name" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
          <option value="BGMI">BGMI (Battlegrounds Mobile India)</option>
          <option value="Free Fire MAX">Free Fire MAX</option>
          <option value="COD Mobile">Call of Duty Mobile</option>
          <option value="Valorant">Valorant</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-300 mb-1">Match Date & Time</label>
        <input type="datetime-local" name="match_time" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-300 mb-1">Entry Fee (₹)</label>
        <input type="number" name="entry_fee" min="0" step="1" required placeholder="50" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-300 mb-1">Prize Pool (₹)</label>
        <input type="number" name="prize_pool" min="0" step="1" required placeholder="2000" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-300 mb-1">Admin Commission (%)</label>
        <input type="number" name="commission_percent" min="0" max="100" value="20" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
      </div>

      <div class="flex items-end">
        <button type="submit" class="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20">
          Publish Tournament
        </button>
      </div>
    </form>
  </div>

  <!-- Tournaments List -->
  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
    <h3 class="text-sm font-bold text-white uppercase tracking-wider">All Tournaments (<?= $tournaments->num_rows ?>)</h3>
    <div class="space-y-3">
      <?php while ($t = $tournaments->fetch_assoc()): ?>
        <div class="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center space-x-2 mb-1">
              <span class="px-2 py-0.5 bg-slate-800 text-amber-400 text-[10px] font-bold rounded"><?= htmlspecialchars($t['game_name']) ?></span>
              <span class="px-2 py-0.5 text-[10px] font-bold rounded <?= $t['status'] === 'Live' ? 'bg-red-500/20 text-red-400' : ($t['status'] === 'Completed' ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/20 text-emerald-400') ?>"><?= $t['status'] ?></span>
              <span class="text-[11px] text-slate-400"><i class="fa-solid fa-users mr-1"></i><?= $t['joined_count'] ?> Players</span>
            </div>
            <h4 class="text-sm font-bold text-white"><?= htmlspecialchars($t['title']) ?></h4>
            <p class="text-xs text-slate-400 mt-1">
              Match Time: <?= date('d M, h:i A', strtotime($t['match_time'])) ?> | Fee: ₹<?= $t['entry_fee'] ?> | Prize: ₹<?= $t['prize_pool'] ?>
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <a href="manage_tournament.php?id=<?= $t['id'] ?>" class="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs">
              Manage & Declare Winner
            </a>
            <a href="tournament.php?delete=<?= $t['id'] ?>" onclick="return confirm('Delete this tournament?')" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs">
              <i class="fa-solid fa-trash"></i>
            </a>
          </div>
        </div>
      <?php endwhile; ?>
    </div>
  </div>
</main>

<?php require_once 'common/bottom.php'; ?>`
  },
  {
    name: 'admin/manage_tournament.php',
    path: 'admin/manage_tournament.php',
    category: 'admin',
    description: 'Set Room Credentials, View Participants & Declare Winner with Wallet Credit',
    content: `<?php
// admin/manage_tournament.php
require_once '../common/config.php';
check_admin_login();

$id = intval($_GET['id'] ?? 0);
$msg = '';
$msg_type = 'info';

// Handle Room Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_room') {
    $room_id = trim($_POST['room_id'] ?? '');
    $room_pass = trim($_POST['room_password'] ?? '');
    $status = $_POST['status'] ?? 'Upcoming';

    $upd = $conn->prepare("UPDATE tournaments SET room_id = ?, room_password = ?, status = ? WHERE id = ?");
    $upd->bind_param("sssi", $room_id, $room_pass, $status, $id);
    if ($upd->execute()) {
        $msg = 'Room details and match status updated!';
        $msg_type = 'success';
    }
}

// Handle Winner Declaration & Prize Distribution
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'declare_winner') {
    $winner_user_id = intval($_POST['winner_user_id'] ?? 0);

    // Fetch tournament
    $t_res = $conn->query("SELECT * FROM tournaments WHERE id = $id")->fetch_assoc();

    if ($winner_user_id > 0 && $t_res && $t_res['status'] !== 'Completed') {
        $prize = floatval($t_res['prize_pool']);

        $conn->begin_transaction();
        try {
            // 1. Credit prize to winner wallet
            $cred = $conn->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?");
            $cred->bind_param("di", $prize, $winner_user_id);
            $cred->execute();

            // 2. Mark tournament completed with winner ID
            $upd_t = $conn->prepare("UPDATE tournaments SET status = 'Completed', winner_user_id = ? WHERE id = ?");
            $upd_t->bind_param("ii", $winner_user_id, $id);
            $upd_t->execute();

            // 3. Create credit transaction log
            $desc = "Prize Money - Winner of " . $t_res['title'];
            $txn = $conn->prepare("INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, 'credit', ?)");
            $txn->bind_param("ids", $winner_user_id, $prize, $desc);
            $txn->execute();

            $conn->commit();
            $msg = 'Winner declared and ₹' . number_format($prize, 2) . ' credited to winner wallet!';
            $msg_type = 'success';
        } catch (Exception $e) {
            $conn->rollback();
            $msg = 'Error declaring winner: ' . $e->getMessage();
            $msg_type = 'error';
        }
    }
}

// Fetch tournament details
$t = $conn->query("SELECT * FROM tournaments WHERE id = $id")->fetch_assoc();
if (!$t) {
    die("Tournament not found.");
}

// Fetch participants
$participants = $conn->query("SELECT p.*, u.username, u.email, u.wallet_balance 
                             FROM participants p 
                             JOIN users u ON p.user_id = u.id 
                             WHERE p.tournament_id = $id 
                             ORDER BY p.joined_at ASC");

require_once 'common/header.php';
?>

<main class="max-w-4xl mx-auto px-4 py-6 space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <a href="tournament.php" class="text-xs text-amber-400 hover:underline"><i class="fa-solid fa-arrow-left mr-1"></i> Back to Tournaments</a>
      <h2 class="text-xl font-black text-white mt-1"><?= htmlspecialchars($t['title']) ?></h2>
    </div>
    <span class="px-3 py-1 rounded-full text-xs font-bold <?= $t['status'] === 'Completed' ? 'bg-slate-800 text-slate-400' : ($t['status'] === 'Live' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400') ?>">
      <?= $t['status'] ?>
    </span>
  </div>

  <?php if (!empty($msg)): ?>
    <div class="p-3.5 rounded-xl text-xs font-semibold <?= $msg_type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30' ?>">
      <?= htmlspecialchars($msg) ?>
    </div>
  <?php endif; ?>

  <!-- Grid: Room Settings & Declare Winner -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- 1. Room Credentials -->
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
      <h3 class="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
        <i class="fa-solid fa-key"></i>
        <span>Room Credentials</span>
      </h3>
      <form method="POST" action="manage_tournament.php?id=<?= $id ?>" class="space-y-3">
        <input type="hidden" name="action" value="update_room">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Room ID</label>
          <input type="text" name="room_id" value="<?= htmlspecialchars($t['room_id']) ?>" placeholder="e.g. ROOM-94821" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Room Password</label>
          <input type="text" name="room_password" value="<?= htmlspecialchars($t['room_password']) ?>" placeholder="e.g. adept99" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Status</label>
          <select name="status" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
            <option value="Upcoming" <?= $t['status'] === 'Upcoming' ? 'selected' : '' ?>>Upcoming</option>
            <option value="Live" <?= $t['status'] === 'Live' ? 'selected' : '' ?>>Live (Room Visible)</option>
            <option value="Completed" <?= $t['status'] === 'Completed' ? 'selected' : '' ?>>Completed</option>
          </select>
        </div>
        <button type="submit" class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold rounded-xl text-xs uppercase tracking-wider">
          Save Room Details
        </button>
      </form>
    </div>

    <!-- 2. Declare Winner -->
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
      <h3 class="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
        <i class="fa-solid fa-trophy"></i>
        <span>Declare Match Winner</span>
      </h3>

      <?php if ($t['status'] === 'Completed'): ?>
        <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center">
          <i class="fa-solid fa-crown text-3xl text-amber-400 mb-2"></i>
          <p class="text-xs font-bold text-emerald-400">Match Completed & Prize Distributed</p>
          <p class="text-[11px] text-slate-400 mt-1">Prize of ₹<?= number_format($t['prize_pool'], 2) ?> credited.</p>
        </div>
      <?php else: ?>
        <form method="POST" action="manage_tournament.php?id=<?= $id ?>" class="space-y-3">
          <input type="hidden" name="action" value="declare_winner">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Select Winner from Participants</label>
            <select name="winner_user_id" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
              <option value="">-- Choose Winning User --</option>
              <?php 
              // reset pointer
              $participants->data_seek(0);
              while ($p = $participants->fetch_assoc()): ?>
                <option value="<?= $p['user_id'] ?>"><?= htmlspecialchars($p['username']) ?> (ID #<?= $p['user_id'] ?>)</option>
              <?php endwhile; ?>
            </select>
          </div>
          <p class="text-[11px] text-slate-400">
            Will instantly credit <strong>₹<?= number_format($t['prize_pool'], 2) ?></strong> to winner's wallet and set tournament to Completed.
          </p>
          <button type="submit" onclick="return confirm('Declare winner and distribute ₹<?= $t['prize_pool'] ?> prize?')" class="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20">
            Declare Winner & Distribute Prize
          </button>
        </form>
      <?php endif; ?>
    </div>
  </div>

  <!-- Joined Participants List -->
  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
    <h3 class="text-sm font-bold text-white uppercase tracking-wider">Joined Participants (<?= $participants->num_rows ?>)</h3>
    <?php if ($participants->num_rows === 0): ?>
      <p class="text-xs text-slate-500">No participants have joined this tournament yet.</p>
    <?php else: ?>
      <div class="divide-y divide-slate-800/60">
        <?php 
        $participants->data_seek(0);
        $idx = 1;
        while ($p = $participants->fetch_assoc()): ?>
          <div class="py-2.5 flex items-center justify-between text-xs">
            <div class="flex items-center space-x-3">
              <span class="w-6 text-slate-500 font-mono">#<?= $idx++ ?></span>
              <div>
                <p class="font-bold text-white"><?= htmlspecialchars($p['username']) ?></p>
                <p class="text-[10px] text-slate-500"><?= htmlspecialchars($p['email']) ?></p>
              </div>
            </div>
            <span class="text-slate-400 text-[11px]">Joined: <?= date('d M, h:i A', strtotime($p['joined_at'])) ?></span>
          </div>
        <?php endwhile; ?>
      </div>
    <?php endif; ?>
  </div>
</main>

<?php require_once 'common/bottom.php'; ?>`
  },
  {
    name: 'admin/deposits.php',
    path: 'admin/deposits.php',
    category: 'admin',
    description: 'Manage Manual UPI Deposit Requests (Approve to Credit Wallet / Reject)',
    content: `<?php
// admin/deposits.php
require_once '../common/config.php';
check_admin_login();

$msg = '';
$msg_type = 'info';

// Handle Approve / Reject
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $deposit_id = intval($_POST['deposit_id'] ?? 0);
    $action = $_POST['action'] ?? '';

    $d_stmt = $conn->prepare("SELECT d.*, u.username FROM deposits d JOIN users u ON d.user_id = u.id WHERE d.id = ?");
    $d_stmt->bind_param("i", $deposit_id);
    $d_stmt->execute();
    $deposit = $d_stmt->get_result()->fetch_assoc();

    if ($deposit && $deposit['status'] === 'Pending') {
        if ($action === 'approve') {
            $conn->begin_transaction();
            try {
                // 1. Credit user balance
                $upd_u = $conn->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?");
                $upd_u->bind_param("di", $deposit['amount'], $deposit['user_id']);
                $upd_u->execute();

                // 2. Mark deposit completed
                $upd_d = $conn->prepare("UPDATE deposits SET status = 'Completed' WHERE id = ?");
                $upd_d->bind_param("i", $deposit_id);
                $upd_d->execute();

                // 3. Log credit transaction
                $desc = "UPI Deposit Approved (UTR: " . $deposit['transaction_id'] . ")";
                $txn = $conn->prepare("INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, 'credit', ?)");
                $txn->bind_param("ids", $deposit['user_id'], $deposit['amount'], $desc);
                $txn->execute();

                $conn->commit();
                $msg = 'Deposit of ₹' . number_format($deposit['amount'], 2) . ' approved and credited to ' . htmlspecialchars($deposit['username']) . '!';
                $msg_type = 'success';
            } catch (Exception $e) {
                $conn->rollback();
                $msg = 'Failed to approve deposit: ' . $e->getMessage();
                $msg_type = 'error';
            }
        } elseif ($action === 'reject') {
            $rej = $conn->prepare("UPDATE deposits SET status = 'Rejected' WHERE id = ?");
            $rej->bind_param("i", $deposit_id);
            $rej->execute();
            $msg = 'Deposit request rejected.';
            $msg_type = 'warning';
        }
    }
}

// Fetch all deposit requests
$deposits = $conn->query("SELECT d.*, u.username, u.email, u.wallet_balance 
                          FROM deposits d 
                          JOIN users u ON d.user_id = u.id 
                          ORDER BY FIELD(d.status, 'Pending', 'Completed', 'Rejected'), d.id DESC");

require_once 'common/header.php';
?>

<main class="max-w-4xl mx-auto px-4 py-6 space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-xl font-black text-white">UPI Deposit Requests</h2>
      <p class="text-xs text-slate-400">Verify UTR / Transaction ID with your bank/UPI app</p>
    </div>
  </div>

  <?php if (!empty($msg)): ?>
    <div class="p-3.5 rounded-xl text-xs font-semibold <?= $msg_type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30' ?>">
      <?= htmlspecialchars($msg) ?>
    </div>
  <?php endif; ?>

  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs text-slate-300">
        <thead class="border-b border-slate-800 text-slate-400 uppercase">
          <tr>
            <th class="py-2.5">User</th>
            <th class="py-2.5">Amount</th>
            <th class="py-2.5">Transaction ID / UTR</th>
            <th class="py-2.5">Date</th>
            <th class="py-2.5">Status</th>
            <th class="py-2.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60">
          <?php if ($deposits->num_rows === 0): ?>
            <tr><td colspan="6" class="py-6 text-center text-slate-500">No deposit requests found.</td></tr>
          <?php endif; ?>
          <?php while ($d = $deposits->fetch_assoc()): ?>
            <tr>
              <td class="py-3">
                <span class="font-bold text-white"><?= htmlspecialchars($d['username']) ?></span>
                <span class="block text-[10px] text-slate-500">Bal: ₹<?= number_format($d['wallet_balance'], 2) ?></span>
              </td>
              <td class="py-3 font-black text-emerald-400">₹<?= number_format($d['amount'], 2) ?></td>
              <td class="py-3 font-mono text-amber-300"><?= htmlspecialchars($d['transaction_id']) ?></td>
              <td class="py-3 text-[11px] text-slate-400"><?= date('d M, h:i A', strtotime($d['created_at'])) ?></td>
              <td class="py-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold <?= $d['status'] === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : ($d['status'] === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400') ?>">
                  <?= $d['status'] ?>
                </span>
              </td>
              <td class="py-3 text-right">
                <?php if ($d['status'] === 'Pending'): ?>
                  <div class="inline-flex space-x-2">
                    <form method="POST" action="deposits.php">
                      <input type="hidden" name="deposit_id" value="<?= $d['id'] ?>">
                      <input type="hidden" name="action" value="approve">
                      <button type="submit" onclick="return confirm('Approve ₹<?= $d['amount'] ?> deposit for <?= htmlspecialchars($d['username']) ?>?')" class="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs">
                        Approve
                      </button>
                    </form>
                    <form method="POST" action="deposits.php">
                      <input type="hidden" name="deposit_id" value="<?= $d['id'] ?>">
                      <input type="hidden" name="action" value="reject">
                      <button type="submit" onclick="return confirm('Reject this deposit request?')" class="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-bold rounded-lg text-xs">
                        Reject
                      </button>
                    </form>
                  </div>
                <?php else: ?>
                  <span class="text-[11px] text-slate-500 font-semibold">Processed</span>
                <?php endif; ?>
              </td>
            </tr>
          <?php endwhile; ?>
        </tbody>
      </table>
    </div>
  </div>
</main>

<?php require_once 'common/bottom.php'; ?>`
  },
  {
    name: 'admin/withdrawals.php',
    path: 'admin/withdrawals.php',
    category: 'admin',
    description: 'Manage User Withdrawal Requests (Send Payment via UPI & Mark Completed)',
    content: `<?php
// admin/withdrawals.php
require_once '../common/config.php';
check_admin_login();

$msg = '';
$msg_type = 'info';

// Handle Processing
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $withdraw_id = intval($_POST['withdrawal_id'] ?? 0);
    $action = $_POST['action'] ?? '';

    $w_stmt = $conn->prepare("SELECT w.*, u.wallet_balance, u.username FROM withdrawals w JOIN users u ON w.user_id = u.id WHERE w.id = ?");
    $w_stmt->bind_param("i", $withdraw_id);
    $w_stmt->execute();
    $req = $w_stmt->get_result()->fetch_assoc();

    if ($req && $req['status'] === 'Pending') {
        if ($action === 'complete') {
            if ($req['wallet_balance'] < $req['amount']) {
                $msg = 'User has insufficient balance to complete withdrawal.';
                $msg_type = 'error';
            } else {
                $conn->begin_transaction();
                try {
                    // 1. Deduct user balance
                    $ded = $conn->prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?");
                    $ded->bind_param("di", $req['amount'], $req['user_id']);
                    $ded->execute();

                    // 2. Mark withdrawal completed
                    $upd_w = $conn->prepare("UPDATE withdrawals SET status = 'Completed' WHERE id = ?");
                    $upd_w->bind_param("i", $withdraw_id);
                    $upd_w->execute();

                    // 3. Log debit transaction
                    $desc = "UPI Withdrawal to " . $req['upi_id'];
                    $txn = $conn->prepare("INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, 'debit', ?)");
                    $txn->bind_param("ids", $req['user_id'], $req['amount'], $desc);
                    $txn->execute();

                    $conn->commit();
                    $msg = 'Withdrawal of ₹' . number_format($req['amount'], 2) . ' marked completed!';
                    $msg_type = 'success';
                } catch (Exception $e) {
                    $conn->rollback();
                    $msg = 'Failed to process withdrawal: ' . $e->getMessage();
                    $msg_type = 'error';
                }
            }
        } elseif ($action === 'reject') {
            $rej = $conn->prepare("UPDATE withdrawals SET status = 'Rejected' WHERE id = ?");
            $rej->bind_param("i", $withdraw_id);
            $rej->execute();
            $msg = 'Withdrawal request marked Rejected.';
            $msg_type = 'warning';
        }
    }
}

$withdrawals = $conn->query("SELECT w.*, u.username, u.email, u.wallet_balance 
                            FROM withdrawals w 
                            JOIN users u ON w.user_id = u.id 
                            ORDER BY FIELD(w.status, 'Pending', 'Completed', 'Rejected'), w.id DESC");

require_once 'common/header.php';
?>

<main class="max-w-4xl mx-auto px-4 py-6 space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-xl font-black text-white">User Withdrawal Requests</h2>
      <p class="text-xs text-slate-400">Send money to user's UPI ID, then mark Completed</p>
    </div>
  </div>

  <?php if (!empty($msg)): ?>
    <div class="p-3.5 rounded-xl text-xs font-semibold <?= $msg_type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30' ?>">
      <?= htmlspecialchars($msg) ?>
    </div>
  <?php endif; ?>

  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs text-slate-300">
        <thead class="border-b border-slate-800 text-slate-400 uppercase">
          <tr>
            <th class="py-2.5">User</th>
            <th class="py-2.5">Amount (₹)</th>
            <th class="py-2.5">Destination UPI ID</th>
            <th class="py-2.5">Date</th>
            <th class="py-2.5">Status</th>
            <th class="py-2.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60">
          <?php if ($withdrawals->num_rows === 0): ?>
            <tr><td colspan="6" class="py-6 text-center text-slate-500">No withdrawal requests found.</td></tr>
          <?php endif; ?>
          <?php while ($w = $withdrawals->fetch_assoc()): ?>
            <tr>
              <td class="py-3 font-bold text-white">
                <?= htmlspecialchars($w['username']) ?>
                <span class="block text-[10px] text-slate-500 font-normal">Wallet: ₹<?= number_format($w['wallet_balance'], 2) ?></span>
              </td>
              <td class="py-3 font-black text-amber-400">₹<?= number_format($w['amount'], 2) ?></td>
              <td class="py-3">
                <span class="font-mono text-cyan-300 font-bold"><?= htmlspecialchars($w['upi_id']) ?></span>
                <button type="button" onclick="navigator.clipboard.writeText('<?= htmlspecialchars($w['upi_id']) ?>'); alert('Copied <?= htmlspecialchars($w['upi_id']) ?>');" class="ml-1 text-[10px] text-slate-400 hover:text-white">
                  <i class="fa-regular fa-copy"></i>
                </button>
              </td>
              <td class="py-3 text-[11px] text-slate-400"><?= date('d M, h:i A', strtotime($w['created_at'])) ?></td>
              <td class="py-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold <?= $w['status'] === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : ($w['status'] === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400') ?>">
                  <?= $w['status'] ?>
                </span>
              </td>
              <td class="py-3 text-right">
                <?php if ($w['status'] === 'Pending'): ?>
                  <div class="inline-flex space-x-2">
                    <form method="POST" action="withdrawals.php">
                      <input type="hidden" name="withdrawal_id" value="<?= $w['id'] ?>">
                      <input type="hidden" name="action" value="complete">
                      <button type="submit" onclick="return confirm('Confirm you sent ₹<?= $w['amount'] ?> to <?= htmlspecialchars($w['upi_id']) ?>?')" class="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs">
                        Sent & Complete
                      </button>
                    </form>
                    <form method="POST" action="withdrawals.php">
                      <input type="hidden" name="withdrawal_id" value="<?= $w['id'] ?>">
                      <input type="hidden" name="action" value="reject">
                      <button type="submit" onclick="return confirm('Reject this withdrawal request?')" class="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-bold rounded-lg text-xs">
                        Reject
                      </button>
                    </form>
                  </div>
                <?php else: ?>
                  <span class="text-[11px] text-slate-500 font-semibold">Done</span>
                <?php endif; ?>
              </td>
            </tr>
          <?php endwhile; ?>
        </tbody>
      </table>
    </div>
  </div>
</main>

<?php require_once 'common/bottom.php'; ?>`
  },
  {
    name: 'admin/settings.php',
    path: 'admin/settings.php',
    category: 'admin',
    description: 'Admin UPI ID & QR Code Settings Page for Deposits',
    content: `<?php
// admin/settings.php
require_once '../common/config.php';
check_admin_login();

$msg = '';
$msg_type = 'info';

// Handle Settings Update & QR Code Upload / Link
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $upi_id = trim($_POST['upi_id'] ?? '');
    $app_name = trim($_POST['app_name'] ?? 'Adept Play');
    $qr_image_url = trim($_POST['qr_image_url'] ?? '');

    // Handle File Upload if provided
    if (isset($_FILES['qr_file']) && $_FILES['qr_file']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = '../uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        $filename = 'qr_' . time() . '_' . basename($_FILES['qr_file']['name']);
        $target_file = $upload_dir . $filename;
        if (move_uploaded_file($_FILES['qr_file']['tmp_name'], $target_file)) {
            $qr_image_url = 'uploads/' . $filename;
        }
    }

    // Auto-generate dynamic QR if URL left empty or reset
    if (empty($qr_image_url) && !empty($upi_id)) {
        $qr_image_url = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" . urlencode("upi://pay?pa=" . $upi_id . "&pn=" . urlencode($app_name) . "&cu=INR");
    }

    if (empty($upi_id)) {
        $msg = 'UPI ID cannot be empty.';
        $msg_type = 'error';
    } else {
        // Update or Insert into settings table
        $chk = $conn->query("SELECT id FROM settings WHERE id = 1");
        if ($chk && $chk->num_rows > 0) {
            $stmt = $conn->prepare("UPDATE settings SET upi_id = ?, qr_image_url = ?, app_name = ? WHERE id = 1");
            $stmt->bind_param("sss", $upi_id, $qr_image_url, $app_name);
        } else {
            $stmt = $conn->prepare("INSERT INTO settings (id, upi_id, qr_image_url, app_name) VALUES (1, ?, ?, ?)");
            $stmt->bind_param("sss", $upi_id, $qr_image_url, $app_name);
        }

        if ($stmt->execute()) {
            $msg = 'Admin UPI settings & QR Code saved successfully! Users will now see this on their deposit modal.';
            $msg_type = 'success';
        } else {
            $msg = 'Failed to update settings: ' . $conn->error;
            $msg_type = 'error';
        }
    }
}

$settings = get_app_settings($conn);

require_once 'common/header.php';
?>

<main class="max-w-3xl mx-auto px-4 py-6 space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-xl font-black text-white">Payment & UPI Settings</h2>
      <p class="text-xs text-slate-400">Configure your receiving UPI ID and QR code for user deposits</p>
    </div>
  </div>

  <?php if (!empty($msg)): ?>
    <div class="p-3.5 rounded-xl text-xs font-semibold <?= $msg_type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30' ?>">
      <?= htmlspecialchars($msg) ?>
    </div>
  <?php endif; ?>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Preview Box -->
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-center space-y-3">
      <h3 class="text-xs font-bold uppercase tracking-wider text-amber-400">Live Deposit QR Preview</h3>
      <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <img src="<?= htmlspecialchars($settings['qr_image_url']) ?>" alt="UPI QR" class="w-44 h-44 mx-auto rounded-xl border border-slate-700 shadow-md">
        <p class="text-xs font-mono font-bold text-amber-300 mt-3"><?= htmlspecialchars($settings['upi_id']) ?></p>
        <p class="text-[10px] text-slate-500 mt-1"><?= htmlspecialchars($settings['app_name'] ?? 'Adept Play') ?></p>
      </div>
      <p class="text-[11px] text-slate-400">This is how users view your payment modal on the wallet page.</p>
    </div>

    <!-- Edit Form -->
    <div class="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
      <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
        <i class="fa-solid fa-gear text-amber-400"></i>
        <span>Update UPI Configuration</span>
      </h3>

      <form method="POST" action="settings.php" enctype="multipart/form-data" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Admin UPI ID (VPA)</label>
          <input type="text" name="upi_id" required value="<?= htmlspecialchars($settings['upi_id']) ?>" placeholder="e.g. yourbusiness@okicici" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
          <p class="text-[10px] text-slate-500 mt-1">Users will transfer funds to this address.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Upload QR Code Image (Optional)</label>
          <input type="file" name="qr_file" accept="image/*" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400">
          <p class="text-[10px] text-slate-500 mt-1">Upload screenshot of your official PhonePe/GPay/Paytm Merchant QR.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Direct QR Image URL / Auto-Generator</label>
          <input type="text" name="qr_image_url" value="<?= htmlspecialchars($settings['qr_image_url']) ?>" placeholder="https://api.qrserver.com/..." class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
          <p class="text-[10px] text-slate-500 mt-1">Leave empty to auto-generate a valid UPI QR code from your UPI ID.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">App / Brand Name</label>
          <input type="text" name="app_name" value="<?= htmlspecialchars($settings['app_name'] ?? 'Adept Play') ?>" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
        </div>

        <button type="submit" class="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all">
          Save Settings & Update QR
        </button>
      </form>
    </div>
  </div>
</main>

<?php require_once 'common/bottom.php'; ?>`
  },
  {
    name: 'admin/user.php',
    path: 'admin/user.php',
    category: 'admin',
    description: 'Registered Users Management, Block/Unblock & Balance View',
    content: `<?php
// admin/user.php
require_once '../common/config.php';
check_admin_login();

// Handle Block / Unblock
if (isset($_GET['toggle_block'])) {
    $uid = intval($_GET['toggle_block']);
    $conn->query("UPDATE users SET is_blocked = NOT is_blocked WHERE id = $uid");
    header("Location: user.php");
    exit();
}

$users = $conn->query("SELECT u.*, 
    (SELECT COUNT(*) FROM participants WHERE user_id = u.id) as matches_count,
    (SELECT SUM(amount) FROM transactions WHERE user_id = u.id AND type = 'credit') as total_credited
    FROM users u ORDER BY u.id DESC");

require_once 'common/header.php';
?>

<main class="max-w-4xl mx-auto px-4 py-6 space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-xl font-black text-white">Registered Users</h2>
      <p class="text-xs text-slate-400">Manage user accounts and view wallet balances</p>
    </div>
  </div>

  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs text-slate-300">
        <thead class="border-b border-slate-800 text-slate-400 uppercase">
          <tr>
            <th class="py-2.5">User</th>
            <th class="py-2.5">Email</th>
            <th class="py-2.5">Saved UPI ID</th>
            <th class="py-2.5">Wallet Balance</th>
            <th class="py-2.5">Matches</th>
            <th class="py-2.5">Status</th>
            <th class="py-2.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/60">
          <?php while ($u = $users->fetch_assoc()): ?>
            <tr>
              <td class="py-3 font-bold text-white"><?= htmlspecialchars($u['username']) ?></td>
              <td class="py-3 text-slate-400"><?= htmlspecialchars($u['email']) ?></td>
              <td class="py-3 font-mono text-cyan-300"><?= htmlspecialchars($u['upi_id'] ?? 'Not set') ?></td>
              <td class="py-3 font-black text-amber-400">₹<?= number_format($u['wallet_balance'], 2) ?></td>
              <td class="py-3"><?= $u['matches_count'] ?></td>
              <td class="py-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold <?= $u['is_blocked'] == 1 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400' ?>">
                  <?= $u['is_blocked'] == 1 ? 'Blocked' : 'Active' ?>
                </span>
              </td>
              <td class="py-3 text-right">
                <a href="user.php?toggle_block=<?= $u['id'] ?>" class="px-3 py-1 rounded-lg text-xs font-bold <?= $u['is_blocked'] == 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400' ?>">
                  <?= $u['is_blocked'] == 1 ? 'Unblock' : 'Block' ?>
                </a>
              </td>
            </tr>
          <?php endwhile; ?>
        </tbody>
      </table>
    </div>
  </div>
</main>

<?php require_once 'common/bottom.php'; ?>`
  },
  {
    name: 'admin/common/header.php',
    path: 'admin/common/header.php',
    category: 'admin_common',
    description: 'Admin Top Navigation Bar & Responsive Links',
    content: `<?php
// admin/common/header.php
$admin_user = $_SESSION['admin_user'] ?? 'Admin';
$cur = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin - Adept Play</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen antialiased">
  <header class="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3">
    <div class="max-w-4xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <a href="index.php" class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
            <i class="fa-solid fa-crown text-sm"></i>
          </div>
          <div>
            <h1 class="font-black text-sm tracking-wider uppercase text-white">Adept Admin</h1>
            <p class="text-[10px] text-amber-400 font-bold -mt-0.5">Control Suite</p>
          </div>
        </a>
      </div>

      <nav class="hidden md:flex items-center space-x-1 text-xs font-bold">
        <a href="index.php" class="px-3 py-1.5 rounded-lg <?= $cur === 'index.php' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white' ?>">Dashboard</a>
        <a href="tournament.php" class="px-3 py-1.5 rounded-lg <?= $cur === 'tournament.php' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white' ?>">Tournaments</a>
        <a href="deposits.php" class="px-3 py-1.5 rounded-lg <?= $cur === 'deposits.php' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white' ?>">Deposits</a>
        <a href="withdrawals.php" class="px-3 py-1.5 rounded-lg <?= $cur === 'withdrawals.php' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white' ?>">Withdrawals</a>
        <a href="user.php" class="px-3 py-1.5 rounded-lg <?= $cur === 'user.php' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white' ?>">Users</a>
        <a href="settings.php" class="px-3 py-1.5 rounded-lg <?= $cur === 'settings.php' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white' ?>">UPI Settings</a>
      </nav>

      <div class="flex items-center space-x-2">
        <a href="../index.php" target="_blank" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold">
          <i class="fa-solid fa-external-link mr-1"></i> User App
        </a>
        <a href="login.php?logout=1" class="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold">
          Logout
        </a>
      </div>
    </div>
  </header>`
  },
  {
    name: 'admin/common/bottom.php',
    path: 'admin/common/bottom.php',
    category: 'admin_common',
    description: 'Admin Mobile Bottom Nav Bar',
    content: `<?php
// admin/common/bottom.php
$cur = basename($_SERVER['PHP_SELF']);
?>
  <!-- Admin Mobile Bottom Bar -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 py-2">
    <div class="grid grid-cols-5 text-center text-[10px]">
      <a href="index.php" class="py-1 <?= $cur == 'index.php' ? 'text-amber-400 font-bold' : 'text-slate-400' ?>">
        <i class="fa-solid fa-chart-pie text-base block mb-0.5"></i> Stats
      </a>
      <a href="tournament.php" class="py-1 <?= $cur == 'tournament.php' ? 'text-amber-400 font-bold' : 'text-slate-400' ?>">
        <i class="fa-solid fa-trophy text-base block mb-0.5"></i> Matches
      </a>
      <a href="deposits.php" class="py-1 <?= $cur == 'deposits.php' ? 'text-amber-400 font-bold' : 'text-slate-400' ?>">
        <i class="fa-solid fa-qrcode text-base block mb-0.5"></i> Deposits
      </a>
      <a href="withdrawals.php" class="py-1 <?= $cur == 'withdrawals.php' ? 'text-amber-400 font-bold' : 'text-slate-400' ?>">
        <i class="fa-solid fa-money-bill-transfer text-base block mb-0.5"></i> Payouts
      </a>
      <a href="settings.php" class="py-1 <?= $cur == 'settings.php' ? 'text-amber-400 font-bold' : 'text-slate-400' ?>">
        <i class="fa-solid fa-gear text-base block mb-0.5"></i> Settings
      </a>
    </div>
  </nav>
</body>
</html>`
  }
];
