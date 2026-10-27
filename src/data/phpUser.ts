import { FileItem } from '../types';

export const userPhpFiles: FileItem[] = [
  {
    name: 'login.php',
    path: 'login.php',
    category: 'root',
    description: 'User Authentication (Tabs for Login & Sign Up with Validation)',
    content: `<?php
// login.php
require_once 'common/config.php';

$error = '';
$success = '';

if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? 'login';

    if ($action === 'login') {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($username) || empty($password)) {
            $error = 'Please enter both username and password.';
        } else {
            $stmt = $conn->prepare("SELECT id, username, password, is_blocked FROM users WHERE username = ? OR email = ?");
            $stmt->bind_param("ss", $username, $username);
            $stmt->execute();
            $user = $stmt->get_result()->fetch_assoc();

            if ($user && password_verify($password, $user['password'])) {
                if ($user['is_blocked'] == 1) {
                    $error = 'Your account has been temporarily restricted. Contact support.';
                } else {
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['username'];
                    header("Location: index.php");
                    exit();
                }
            } else {
                $error = 'Invalid username or password.';
            }
        }
    } elseif ($action === 'signup') {
        $username = trim($_POST['username'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($username) || empty($email) || empty($password)) {
            $error = 'All signup fields are required.';
        } elseif (strlen($password) < 6) {
            $error = 'Password must be at least 6 characters.';
        } else {
            // Check username / email uniqueness
            $chk = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
            $chk->bind_param("ss", $username, $email);
            $chk->execute();
            if ($chk->get_result()->num_rows > 0) {
                $error = 'Username or Email is already registered.';
            } else {
                $hash = password_hash($password, PASSWORD_BCRYPT);
                $ins = $conn->prepare("INSERT INTO users (username, email, password, wallet_balance) VALUES (?, ?, ?, 50.00)");
                $ins->bind_param("sss", $username, $email, $hash);
                if ($ins->execute()) {
                    $new_id = $ins->insert_id;
                    // Sign-up bonus transaction
                    $t = $conn->prepare("INSERT INTO transactions (user_id, amount, type, description) VALUES (?, 50.00, 'credit', 'Welcome Bonus')");
                    $t->bind_param("i", $new_id);
                    $t->execute();

                    $_SESSION['user_id'] = $new_id;
                    $_SESSION['username'] = $username;
                    header("Location: index.php?welcome=1");
                    exit();
                } else {
                    $error = 'Registration failed. Try again.';
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Login - Adept Play</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
    <!-- Brand -->
    <div class="text-center mb-6">
      <div class="w-14 h-14 bg-gradient-to-tr from-amber-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
        <i class="fa-solid fa-gamepad text-2xl text-slate-950 font-black"></i>
      </div>
      <h1 class="text-2xl font-black text-white tracking-wider uppercase">Adept Play</h1>
      <p class="text-xs text-slate-400 mt-1">Play Daily Esports Tournaments & Win Real Cash</p>
    </div>

    <!-- Feedback -->
    <?php if (!empty($error)): ?>
      <div class="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl p-3 mb-4 flex items-center space-x-2">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span><?= htmlspecialchars($error) ?></span>
      </div>
    <?php endif; ?>

    <!-- Tabs Toggle -->
    <div class="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800" id="tabContainer">
      <button type="button" onclick="switchTab('login')" id="btnLoginTab" class="flex-1 py-2 text-xs font-bold rounded-lg transition-all bg-amber-500 text-slate-950">
        Login
      </button>
      <button type="button" onclick="switchTab('signup')" id="btnSignupTab" class="flex-1 py-2 text-xs font-bold rounded-lg transition-all text-slate-400 hover:text-white">
        Create Account
      </button>
    </div>

    <!-- Login Form -->
    <form id="formLogin" method="POST" action="login.php" class="space-y-4">
      <input type="hidden" name="action" value="login">
      <div>
        <label class="block text-xs font-semibold text-slate-400 mb-1.5">Username or Email</label>
        <div class="relative">
          <i class="fa-solid fa-user absolute left-3.5 top-3.5 text-slate-500 text-xs"></i>
          <input type="text" name="username" required placeholder="Enter username" class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500">
        </div>
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
        <div class="relative">
          <i class="fa-solid fa-lock absolute left-3.5 top-3.5 text-slate-500 text-xs"></i>
          <input type="password" name="password" required placeholder="••••••••" class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500">
        </div>
      </div>
      <button type="submit" class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95">
        Login to Play <i class="fa-solid fa-arrow-right ml-1"></i>
      </button>
    </form>

    <!-- Sign Up Form -->
    <form id="formSignup" method="POST" action="login.php" class="space-y-4 hidden">
      <input type="hidden" name="action" value="signup">
      <div>
        <label class="block text-xs font-semibold text-slate-400 mb-1.5">Username</label>
        <input type="text" name="username" required placeholder="e.g. ProGamer99" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500">
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
        <input type="email" name="email" required placeholder="gamer@example.com" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500">
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
        <input type="password" name="password" required placeholder="Min 6 characters" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500">
      </div>
      <p class="text-[11px] text-emerald-400 flex items-center space-x-1">
        <i class="fa-solid fa-gift"></i>
        <span>Get ₹50 Sign-up Bonus instantly in your wallet!</span>
      </p>
      <button type="submit" class="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
        Sign Up & Claim ₹50 <i class="fa-solid fa-bolt ml-1"></i>
      </button>
    </form>
  </div>

  <script>
    function switchTab(tab) {
      const loginForm = document.getElementById('formLogin');
      const signupForm = document.getElementById('formSignup');
      const btnLogin = document.getElementById('btnLoginTab');
      const btnSignup = document.getElementById('btnSignupTab');

      if (tab === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        btnLogin.className = "flex-1 py-2 text-xs font-bold rounded-lg transition-all bg-amber-500 text-slate-950";
        btnSignup.className = "flex-1 py-2 text-xs font-bold rounded-lg transition-all text-slate-400 hover:text-white";
      } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        btnSignup.className = "flex-1 py-2 text-xs font-bold rounded-lg transition-all bg-emerald-500 text-slate-950";
        btnLogin.className = "flex-1 py-2 text-xs font-bold rounded-lg transition-all text-slate-400 hover:text-white";
      }
    }
  </script>
</body>
</html>`
  },
  {
    name: 'index.php',
    path: 'index.php',
    category: 'root',
    description: 'User Homepage with Upcoming Tournaments Grid & Join Action',
    content: `<?php
// index.php
require_once 'common/config.php';
check_user_login();

$user_id = $_SESSION['user_id'];
$msg = '';
$msg_type = 'info';

// Handle Tournament Join Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'join_tournament') {
    $tournament_id = intval($_POST['tournament_id'] ?? 0);

    // Fetch tournament details
    $t_stmt = $conn->prepare("SELECT * FROM tournaments WHERE id = ?");
    $t_stmt->bind_param("i", $tournament_id);
    $t_stmt->execute();
    $tourney = $t_stmt->get_result()->fetch_assoc();

    if (!$tourney) {
        $msg = 'Tournament not found.';
        $msg_type = 'error';
    } elseif ($tourney['status'] === 'Completed') {
        $msg = 'This tournament has already ended.';
        $msg_type = 'error';
    } else {
        // Check if already joined
        $chk_p = $conn->prepare("SELECT id FROM participants WHERE user_id = ? AND tournament_id = ?");
        $chk_p->bind_param("ii", $user_id, $tournament_id);
        $chk_p->execute();
        if ($chk_p->get_result()->num_rows > 0) {
            $msg = 'You have already joined this tournament!';
            $msg_type = 'warning';
        } else {
            // Check user balance
            $u_stmt = $conn->prepare("SELECT wallet_balance FROM users WHERE id = ?");
            $u_stmt->bind_param("i", $user_id);
            $u_stmt->execute();
            $user_data = $u_stmt->get_result()->fetch_assoc();
            $fee = floatval($tourney['entry_fee']);

            if ($user_data['wallet_balance'] < $fee) {
                $msg = 'Insufficient wallet balance. Please add money via UPI.';
                $msg_type = 'error';
            } else {
                // Deduct balance
                $conn->begin_transaction();
                try {
                    $deduct = $conn->prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?");
                    $deduct->bind_param("di", $fee, $user_id);
                    $deduct->execute();

                    $part = $conn->prepare("INSERT INTO participants (user_id, tournament_id) VALUES (?, ?)");
                    $part->bind_param("ii", $user_id, $tournament_id);
                    $part->execute();

                    $desc = "Joined Tournament #" . $tournament_id . ": " . $tourney['title'];
                    $txn = $conn->prepare("INSERT INTO transactions (user_id, amount, type, description) VALUES (?, ?, 'debit', ?)");
                    $txn->bind_param("ids", $user_id, $fee, $desc);
                    $txn->execute();

                    $conn->commit();
                    $msg = 'Successfully joined ' . htmlspecialchars($tourney['title']) . '! Check "My Tournaments" for room details.';
                    $msg_type = 'success';
                } catch (Exception $e) {
                    $conn->rollback();
                    $msg = 'Failed to join tournament. Please try again.';
                    $msg_type = 'error';
                }
            }
        }
    }
}

// Fetch all Upcoming / Live tournaments
$tournaments = $conn->query("SELECT t.*, 
    (SELECT COUNT(*) FROM participants WHERE tournament_id = t.id) as joined_count,
    (SELECT COUNT(*) FROM participants WHERE tournament_id = t.id AND user_id = $user_id) as is_joined
    FROM tournaments t 
    WHERE t.status != 'Completed' 
    ORDER BY t.match_time ASC");

require_once 'common/header.php';
?>

<main class="max-w-md mx-auto px-4 pt-4 pb-8 space-y-4">
  <!-- Hero Banner -->
  <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-4 shadow-xl text-white">
    <div class="relative z-10">
      <span class="inline-block px-2 py-0.5 bg-black/40 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-wider mb-1">
        ⚡ Live Arena
      </span>
      <h2 class="text-xl font-black">Daily Esports Battles</h2>
      <p class="text-xs text-amber-100 mt-0.5">Win ₹5,000+ daily in BGMI, Free Fire & COD</p>
    </div>
    <i class="fa-solid fa-trophy absolute right-3 bottom-2 text-7xl text-white/10 transform rotate-12"></i>
  </div>

  <!-- Notification Banner -->
  <?php if (!empty($msg)): ?>
    <div class="p-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2 border <?= $msg_type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : ($msg_type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-300') ?>">
      <i class="fa-solid <?= $msg_type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation' ?>"></i>
      <span><?= htmlspecialchars($msg) ?></span>
    </div>
  <?php endif; ?>

  <!-- Section Title -->
  <div class="flex items-center justify-between pt-2">
    <h3 class="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
      <i class="fa-solid fa-fire text-amber-400"></i>
      <span>Featured Tournaments</span>
    </h3>
    <span class="text-[11px] text-slate-400 font-medium"><?= $tournaments->num_rows ?> Available</span>
  </div>

  <!-- Tournaments List -->
  <div class="space-y-4">
    <?php if ($tournaments->num_rows == 0): ?>
      <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center">
        <i class="fa-solid fa-calendar-xmark text-3xl text-slate-600 mb-2"></i>
        <p class="text-sm text-slate-400 font-medium">No upcoming matches at the moment.</p>
        <p class="text-xs text-slate-500 mt-1">Check back in a few minutes!</p>
      </div>
    <?php else: ?>
      <?php while ($t = $tournaments->fetch_assoc()): ?>
        <div class="bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all">
          <div class="p-4">
            <!-- Header Tags -->
            <div class="flex items-center justify-between mb-2">
              <span class="px-2.5 py-1 bg-slate-800 text-amber-400 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/20">
                <?= htmlspecialchars($t['game_name']) ?>
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold <?= $t['status'] === 'Live' ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400' ?>">
                ● <?= $t['status'] ?>
              </span>
            </div>

            <!-- Title & Time -->
            <h4 class="font-extrabold text-sm text-white leading-tight mb-1">
              <?= htmlspecialchars($t['title']) ?>
            </h4>
            <div class="flex items-center space-x-3 text-[11px] text-slate-400 mb-3">
              <span><i class="fa-regular fa-clock text-amber-400 mr-1"></i><?= date('d M, h:i A', strtotime($t['match_time'])) ?></span>
              <span><i class="fa-solid fa-users text-slate-500 mr-1"></i><?= $t['joined_count'] ?> Players</span>
            </div>

            <!-- Prize & Entry Grid -->
            <div class="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 mb-3 text-center">
              <div>
                <p class="text-[10px] text-slate-400 font-semibold uppercase">Prize Pool</p>
                <p class="text-base font-black text-emerald-400">₹<?= number_format($t['prize_pool']) ?></p>
              </div>
              <div class="border-l border-slate-800">
                <p class="text-[10px] text-slate-400 font-semibold uppercase">Entry Fee</p>
                <p class="text-base font-black text-amber-400">₹<?= number_format($t['entry_fee']) ?></p>
              </div>
            </div>

            <!-- Action -->
            <?php if ($t['is_joined'] > 0): ?>
              <a href="my_tournaments.php" class="block w-full text-center py-2.5 bg-slate-800 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl text-xs hover:bg-slate-700 transition-all">
                <i class="fa-solid fa-circle-check mr-1"></i> Already Joined (View Room)
              </a>
            <?php else: ?>
              <form method="POST" action="index.php">
                <input type="hidden" name="action" value="join_tournament">
                <input type="hidden" name="tournament_id" value="<?= $t['id'] ?>">
                <button type="submit" onclick="return confirm('Join this tournament for ₹<?= $t['entry_fee'] ?>?')" class="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/10 active:scale-95">
                  Join Now (₹<?= number_format($t['entry_fee']) ?>)
                </button>
              </form>
            <?php endif; ?>
          </div>
        </div>
      <?php endwhile; ?>
    <?php endif; ?>
  </div>
</main>

<?php require_once 'common/bottom.php'; ?>`
  },
  {
    name: 'my_tournaments.php',
    path: 'my_tournaments.php',
    category: 'root',
    description: 'My Tournaments with Live Room ID / Password and Match History',
    content: `<?php
// my_tournaments.php
require_once 'common/config.php';
check_user_login();

$user_id = $_SESSION['user_id'];
$tab = $_GET['tab'] ?? 'upcoming';

// Fetch user joined tournaments
$query = "SELECT t.*, p.joined_at, u.username as winner_name 
          FROM participants p 
          JOIN tournaments t ON p.tournament_id = t.id 
          LEFT JOIN users u ON t.winner_user_id = u.id 
          WHERE p.user_id = $user_id 
          ORDER BY t.match_time DESC";
$result = $conn->query($query);

$upcoming = [];
$completed = [];

while ($row = $result->fetch_assoc()) {
    if ($row['status'] === 'Completed') {
        $completed[] = $row;
    } else {
        $upcoming[] = $row;
    }
}

require_once 'common/header.php';
?>

<main class="max-w-md mx-auto px-4 pt-4 pb-8 space-y-4">
  <!-- Tabs Navigation -->
  <div class="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
    <a href="my_tournaments.php?tab=upcoming" class="flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all <?= $tab === 'upcoming' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white' ?>">
      Upcoming / Live (<?= count($upcoming) ?>)
    </a>
    <a href="my_tournaments.php?tab=completed" class="flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all <?= $tab === 'completed' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white' ?>">
      Completed (<?= count($completed) ?>)
    </a>
  </div>

  <?php if ($tab === 'upcoming'): ?>
    <!-- Upcoming / Live Matches List -->
    <div class="space-y-4">
      <?php if (empty($upcoming)): ?>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center">
          <i class="fa-solid fa-gamepad text-3xl text-slate-600 mb-2"></i>
          <p class="text-sm text-slate-300 font-semibold">No active match entries</p>
          <p class="text-xs text-slate-500 mt-1 mb-4">You have not joined any upcoming matches.</p>
          <a href="index.php" class="inline-block px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
            Browse Matches
          </a>
        </div>
      <?php else: ?>
        <?php foreach ($upcoming as $t): ?>
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 bg-slate-800 text-amber-400 text-[10px] font-bold rounded">
                <?= htmlspecialchars($t['game_name']) ?>
              </span>
              <span class="px-2 py-0.5 text-[10px] font-bold rounded <?= $t['status'] === 'Live' ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-400' ?>">
                <?= $t['status'] ?>
              </span>
            </div>

            <div>
              <h4 class="font-extrabold text-sm text-white"><?= htmlspecialchars($t['title']) ?></h4>
              <p class="text-[11px] text-slate-400 mt-0.5"><i class="fa-regular fa-clock mr-1 text-amber-400"></i><?= date('d M Y, h:i A', strtotime($t['match_time'])) ?></p>
            </div>

            <!-- Room Credentials Box -->
            <div class="bg-slate-950 border border-amber-500/30 rounded-xl p-3 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-400 font-semibold">Room ID:</span>
                <span class="font-mono font-bold text-amber-300">
                  <?= !empty($t['room_id']) ? htmlspecialchars($t['room_id']) : '<span class="text-slate-500 font-normal italic">Revealed 15m before match</span>' ?>
                </span>
              </div>
              <div class="flex items-center justify-between text-xs border-t border-slate-800/80 pt-2">
                <span class="text-slate-400 font-semibold">Password:</span>
                <span class="font-mono font-bold text-amber-300">
                  <?= !empty($t['room_password']) ? htmlspecialchars($t['room_password']) : '<span class="text-slate-500 font-normal italic">Revealed 15m before match</span>' ?>
                </span>
              </div>
            </div>

            <div class="flex justify-between items-center text-xs text-slate-400 pt-1">
              <span>Prize: <strong class="text-emerald-400">₹<?= number_format($t['prize_pool']) ?></strong></span>
              <span>Entry: <strong class="text-amber-400">₹<?= number_format($t['entry_fee']) ?></strong></span>
            </div>
          </div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>

  <?php else: ?>
    <!-- Completed Matches List -->
    <div class="space-y-4">
      <?php if (empty($completed)): ?>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center">
          <i class="fa-solid fa-trophy text-3xl text-slate-600 mb-2"></i>
          <p class="text-sm text-slate-300 font-semibold">No match history</p>
          <p class="text-xs text-slate-500 mt-1">Completed tournament results will appear here.</p>
        </div>
      <?php else: ?>
        <?php foreach ($completed as $t): ?>
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-slate-400 uppercase"><?= htmlspecialchars($t['game_name']) ?></span>
              <?php if ($t['winner_user_id'] == $user_id): ?>
                <span class="px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center space-x-1">
                  <i class="fa-solid fa-crown"></i> <span>WINNER</span>
                </span>
              <?php else: ?>
                <span class="px-2 py-0.5 bg-slate-800 text-slate-400 font-semibold text-[10px] rounded">
                  Participated
                </span>
              <?php endif; ?>
            </div>
            <h4 class="font-bold text-sm text-white"><?= htmlspecialchars($t['title']) ?></h4>
            <div class="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-xs flex justify-between items-center">
              <span class="text-slate-400">Winner: <strong class="text-amber-300"><?= htmlspecialchars($t['winner_name'] ?? 'Declared') ?></strong></span>
              <span class="text-slate-400">Prize: <strong class="text-emerald-400">₹<?= number_format($t['prize_pool']) ?></strong></span>
            </div>
          </div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>
  <?php endif; ?>
</main>

<?php require_once 'common/bottom.php'; ?>`
  },
  {
    name: 'wallet.php',
    path: 'wallet.php',
    category: 'root',
    description: 'Wallet Page with Manual UPI Deposit QR Modal, Withdrawals & Transaction History',
    content: `<?php
// wallet.php
require_once 'common/config.php';
check_user_login();

$user_id = $_SESSION['user_id'];
$msg = '';
$msg_type = 'info';

// Fetch app settings (Admin UPI ID & QR)
$settings = get_app_settings($conn);

// Fetch user info
$u_stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$u_stmt->bind_param("i", $user_id);
$u_stmt->execute();
$user = $u_stmt->get_result()->fetch_assoc();

// Handle Deposit Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'deposit') {
    $amount = floatval($_POST['amount'] ?? 0);
    $txn_id = trim($_POST['transaction_id'] ?? '');

    if ($amount <= 0) {
        $msg = 'Please enter a valid deposit amount.';
        $msg_type = 'error';
    } elseif (empty($txn_id)) {
        $msg = 'Please enter the UPI Transaction ID / UTR number for verification.';
        $msg_type = 'error';
    } else {
        // Check duplicate transaction ID
        $chk = $conn->prepare("SELECT id FROM deposits WHERE transaction_id = ?");
        $chk->bind_param("s", $txn_id);
        $chk->execute();
        if ($chk->get_result()->num_rows > 0) {
            $msg = 'This Transaction ID has already been submitted.';
            $msg_type = 'error';
        } else {
            $ins = $conn->prepare("INSERT INTO deposits (user_id, amount, transaction_id, status) VALUES (?, ?, ?, 'Pending')");
            $ins->bind_param("ids", $user_id, $amount, $txn_id);
            if ($ins->execute()) {
                $msg = 'Deposit request of ₹' . number_format($amount, 2) . ' submitted! Admin will verify and credit your wallet shortly.';
                $msg_type = 'success';
            } else {
                $msg = 'Failed to submit deposit request. Try again.';
                $msg_type = 'error';
            }
        }
    }
}

// Handle Withdrawal Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'withdraw') {
    $amount = floatval($_POST['amount'] ?? 0);
    $user_upi = trim($_POST['upi_id'] ?? $user['upi_id'] ?? '');

    if ($amount < 50) {
        $msg = 'Minimum withdrawal amount is ₹50.';
        $msg_type = 'error';
    } elseif ($amount > $user['wallet_balance']) {
        $msg = 'Insufficient wallet balance for this withdrawal.';
        $msg_type = 'error';
    } elseif (empty($user_upi)) {
        $msg = 'Please enter your UPI ID to receive payment.';
        $msg_type = 'error';
    } else {
        $ins = $conn->prepare("INSERT INTO withdrawals (user_id, amount, upi_id, status) VALUES (?, ?, ?, 'Pending')");
        $ins->bind_param("ids", $user_id, $amount, $user_upi);
        if ($ins->execute()) {
            // Update user's saved UPI ID if changed
            if ($user_upi !== $user['upi_id']) {
                $upd = $conn->prepare("UPDATE users SET upi_id = ? WHERE id = ?");
                $upd->bind_param("si", $user_upi, $user_id);
                $upd->execute();
            }
            $msg = 'Withdrawal request of ₹' . number_format($amount, 2) . ' submitted successfully. Money will be sent to ' . htmlspecialchars($user_upi) . ' within 2-4 hours.';
            $msg_type = 'success';
        } else {
            $msg = 'Failed to submit withdrawal request.';
            $msg_type = 'error';
        }
    }
}

// Fetch transaction history
$txns = $conn->query("SELECT * FROM transactions WHERE user_id = $user_id ORDER BY created_at DESC LIMIT 20");

// Fetch pending requests
$pending_deposits = $conn->query("SELECT * FROM deposits WHERE user_id = $user_id AND status = 'Pending' ORDER BY created_at DESC");
$pending_withdrawals = $conn->query("SELECT * FROM withdrawals WHERE user_id = $user_id AND status = 'Pending' ORDER BY created_at DESC");

require_once 'common/header.php';
?>

<main class="max-w-md mx-auto px-4 pt-4 pb-8 space-y-4">
  <!-- Feedback Message -->
  <?php if (!empty($msg)): ?>
    <div class="p-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2 border <?= $msg_type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400' ?>">
      <i class="fa-solid <?= $msg_type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation' ?>"></i>
      <span><?= htmlspecialchars($msg) ?></span>
    </div>
  <?php endif; ?>

  <!-- Main Wallet Balance Card -->
  <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 p-6 shadow-2xl text-white">
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center space-x-1.5">
        <i class="fa-solid fa-shield-halved"></i>
        <span>Gaming Wallet</span>
      </span>
      <span class="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold border border-amber-500/30">
        INR (₹)
      </span>
    </div>
    <div class="mb-5">
      <p class="text-xs text-slate-400 font-medium">Available Balance</p>
      <h2 class="text-3xl font-black text-white tracking-tight mt-0.5">
        ₹<?= number_format($user['wallet_balance'], 2) ?>
      </h2>
    </div>

    <!-- Actions: Add Money & Withdraw -->
    <div class="grid grid-cols-2 gap-3">
      <button onclick="openModal('modalDeposit')" class="py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
        <i class="fa-solid fa-circle-plus"></i>
        <span>Add Money</span>
      </button>
      <button onclick="openModal('modalWithdraw')" class="py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-extrabold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 active:scale-95 transition-all">
        <i class="fa-solid fa-arrow-up-from-bracket"></i>
        <span>Withdraw</span>
      </button>
    </div>
  </div>

  <!-- Pending Requests Notice (if any) -->
  <?php if ($pending_deposits->num_rows > 0 || $pending_withdrawals->num_rows > 0): ?>
    <div class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2">
      <h4 class="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
        <i class="fa-solid fa-hourglass-half"></i>
        <span>Pending Requests Under Verification</span>
      </h4>
      <?php while ($d = $pending_deposits->fetch_assoc()): ?>
        <div class="flex justify-between items-center text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg">
          <span>Deposit (UTR: <?= htmlspecialchars($d['transaction_id']) ?>)</span>
          <span class="font-bold text-emerald-400">+₹<?= number_format($d['amount'], 2) ?> (Pending)</span>
        </div>
      <?php endwhile; ?>
      <?php while ($w = $pending_withdrawals->fetch_assoc()): ?>
        <div class="flex justify-between items-center text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg">
          <span>Withdrawal to <?= htmlspecialchars($w['upi_id']) ?></span>
          <span class="font-bold text-amber-400">-₹<?= number_format($w['amount'], 2) ?> (Processing)</span>
        </div>
      <?php endwhile; ?>
    </div>
  <?php endif; ?>

  <!-- Transaction History -->
  <div>
    <h3 class="text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-3 flex items-center space-x-2">
      <i class="fa-solid fa-clock-rotate-left text-amber-400"></i>
      <span>Transaction History</span>
    </h3>

    <div class="space-y-2">
      <?php if ($txns->num_rows == 0): ?>
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">
          No transactions recorded yet.
        </div>
      <?php else: ?>
        <?php while ($txn = $txns->fetch_assoc()): ?>
          <div class="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs <?= $txn['type'] === 'credit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400' ?>">
                <i class="fa-solid <?= $txn['type'] === 'credit' ? 'fa-arrow-down' : 'fa-arrow-up' ?>"></i>
              </div>
              <div>
                <p class="text-xs font-bold text-white"><?= htmlspecialchars($txn['description']) ?></p>
                <p class="text-[10px] text-slate-500"><?= date('d M Y, h:i A', strtotime($txn['created_at'])) ?></p>
              </div>
            </div>
            <span class="text-xs font-black <?= $txn['type'] === 'credit' ? 'text-emerald-400' : 'text-red-400' ?>">
              <?= $txn['type'] === 'credit' ? '+' : '-' ?>₹<?= number_format($txn['amount'], 2) ?>
            </span>
          </div>
        <?php endwhile; ?>
      <?php endif; ?>
    </div>
  </div>
</main>

<!-- 1. ADD MONEY MODAL (Manual UPI QR & Transaction ID) -->
<div id="modalDeposit" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
  <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
      <h3 class="font-extrabold text-sm text-white flex items-center space-x-2">
        <i class="fa-solid fa-qrcode text-amber-400"></i>
        <span>Scan & Pay via UPI</span>
      </h3>
      <button onclick="closeModal('modalDeposit')" class="text-slate-400 hover:text-white text-base">✕</button>
    </div>

    <!-- QR Code & UPI Details -->
    <div class="text-center space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
      <img src="<?= htmlspecialchars($settings['qr_image_url'] ?? 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=adeptplay@upi') ?>" alt="Admin UPI QR" class="w-44 h-44 mx-auto rounded-xl border border-slate-700 shadow-md">
      <p class="text-[11px] text-slate-400">Scan using PhonePe, GPay, Paytm or any UPI App</p>
      <div class="bg-slate-900 border border-amber-500/30 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs">
        <span class="font-mono text-amber-300 font-bold"><?= htmlspecialchars($settings['upi_id'] ?? 'adeptplay@upi') ?></span>
        <button type="button" onclick="navigator.clipboard.writeText('<?= htmlspecialchars($settings['upi_id'] ?? 'adeptplay@upi') ?>'); alert('UPI ID copied to clipboard!');" class="text-[11px] text-amber-400 font-bold hover:underline">
          Copy
        </button>
      </div>
    </div>

    <!-- Deposit Form -->
    <form method="POST" action="wallet.php" class="space-y-3">
      <input type="hidden" name="action" value="deposit">
      <div>
        <label class="block text-[11px] font-bold text-slate-300 mb-1">Amount Paid (₹)</label>
        <input type="number" name="amount" min="10" step="1" required placeholder="e.g. 100" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-300 mb-1">UPI Transaction ID / UTR Number</label>
        <input type="text" name="transaction_id" required placeholder="e.g. 329104829104" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
        <p class="text-[10px] text-slate-500 mt-1">Found in your payment app receipt under UTR/Txn Ref.</p>
      </div>
      <button type="submit" class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 active:scale-95">
        Submit Deposit Request
      </button>
    </form>
  </div>
</div>

<!-- 2. WITHDRAW MODAL -->
<div id="modalWithdraw" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4">
  <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
      <h3 class="font-extrabold text-sm text-white flex items-center space-x-2">
        <i class="fa-solid fa-money-bill-transfer text-amber-400"></i>
        <span>Withdraw to UPI</span>
      </h3>
      <button onclick="closeModal('modalWithdraw')" class="text-slate-400 hover:text-white text-base">✕</button>
    </div>

    <form method="POST" action="wallet.php" class="space-y-3">
      <input type="hidden" name="action" value="withdraw">
      <div>
        <label class="block text-[11px] font-bold text-slate-300 mb-1">Amount to Withdraw (₹)</label>
        <input type="number" name="amount" min="50" max="<?= $user['wallet_balance'] ?>" step="1" required placeholder="Min ₹50" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
        <p class="text-[10px] text-slate-500 mt-1">Max available: ₹<?= number_format($user['wallet_balance'], 2) ?></p>
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-300 mb-1">Your UPI ID (VPA)</label>
        <input type="text" name="upi_id" value="<?= htmlspecialchars($user['upi_id'] ?? '') ?>" required placeholder="e.g. yourname@oksbi" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
        <p class="text-[10px] text-slate-500 mt-1">This UPI ID will be saved to your profile.</p>
      </div>
      <button type="submit" class="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 active:scale-95">
        Request Withdrawal
      </button>
    </form>
  </div>
</div>

<script>
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('hidden');
      el.classList.add('flex');
    }
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('hidden');
      el.classList.remove('flex');
    }
  }
</script>

<?php require_once 'common/bottom.php'; ?>`
  },
  {
    name: 'profile.php',
    path: 'profile.php',
    category: 'root',
    description: 'User Profile & Settings with Saved UPI ID, Password Change & Logout',
    content: `<?php
// profile.php
require_once 'common/config.php';
check_user_login();

$user_id = $_SESSION['user_id'];
$msg = '';
$msg_type = 'info';

// Handle Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header("Location: login.php");
    exit();
}

// Handle Profile Updates
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'update_profile') {
        $email = trim($_POST['email'] ?? '');
        $upi_id = trim($_POST['upi_id'] ?? '');

        if (empty($email)) {
            $msg = 'Email address cannot be empty.';
            $msg_type = 'error';
        } else {
            $upd = $conn->prepare("UPDATE users SET email = ?, upi_id = ? WHERE id = ?");
            $upd->bind_param("ssi", $email, $upi_id, $user_id);
            if ($upd->execute()) {
                $msg = 'Profile and UPI ID updated successfully!';
                $msg_type = 'success';
            } else {
                $msg = 'Failed to update profile.';
                $msg_type = 'error';
            }
        }
    } elseif ($action === 'change_password') {
        $old_pwd = $_POST['old_password'] ?? '';
        $new_pwd = $_POST['new_password'] ?? '';

        $chk = $conn->prepare("SELECT password FROM users WHERE id = ?");
        $chk->bind_param("i", $user_id);
        $chk->execute();
        $user_row = $chk->get_result()->fetch_assoc();

        if (!password_verify($old_pwd, $user_row['password'])) {
            $msg = 'Current password is incorrect.';
            $msg_type = 'error';
        } elseif (strlen($new_pwd) < 6) {
            $msg = 'New password must be at least 6 characters.';
            $msg_type = 'error';
        } else {
            $new_hash = password_hash($new_pwd, PASSWORD_BCRYPT);
            $upd_p = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
            $upd_p->bind_param("si", $new_hash, $user_id);
            $upd_p->execute();
            $msg = 'Password changed successfully!';
            $msg_type = 'success';
        }
    }
}

// Fetch current user details
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

require_once 'common/header.php';
?>

<main class="max-w-md mx-auto px-4 pt-4 pb-8 space-y-4">
  <!-- Feedback -->
  <?php if (!empty($msg)): ?>
    <div class="p-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2 border <?= $msg_type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400' ?>">
      <i class="fa-solid <?= $msg_type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation' ?>"></i>
      <span><?= htmlspecialchars($msg) ?></span>
    </div>
  <?php endif; ?>

  <!-- User Card -->
  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-center shadow-xl">
    <div class="w-16 h-16 bg-gradient-to-tr from-amber-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 font-black text-xl text-slate-950 shadow-lg shadow-amber-500/20">
      <?= strtoupper(substr($user['username'], 0, 1)) ?>
    </div>
    <h2 class="text-lg font-black text-white"><?= htmlspecialchars($user['username']) ?></h2>
    <p class="text-xs text-slate-400"><?= htmlspecialchars($user['email']) ?></p>
    <div class="mt-3 inline-block px-3 py-1 bg-slate-950 border border-amber-500/30 rounded-full text-xs text-amber-300 font-bold">
      Wallet: ₹<?= number_format($user['wallet_balance'], 2) ?>
    </div>
  </div>

  <!-- Edit Profile & UPI ID Form -->
  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
      <i class="fa-solid fa-id-card text-amber-400"></i>
      <span>Account & UPI Settings</span>
    </h3>

    <form method="POST" action="profile.php" class="space-y-3">
      <input type="hidden" name="action" value="update_profile">
      <div>
        <label class="block text-[11px] font-semibold text-slate-400 mb-1">Username (Fixed)</label>
        <input type="text" disabled value="<?= htmlspecialchars($user['username']) ?>" class="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400">
      </div>
      <div>
        <label class="block text-[11px] font-semibold text-slate-400 mb-1">Email Address</label>
        <input type="email" name="email" value="<?= htmlspecialchars($user['email']) ?>" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
      </div>
      <div>
        <label class="block text-[11px] font-semibold text-slate-400 mb-1">Default UPI ID for Withdrawals</label>
        <input type="text" name="upi_id" value="<?= htmlspecialchars($user['upi_id'] ?? '') ?>" placeholder="e.g. mobile@paytm or upi@oksbi" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
        <p class="text-[10px] text-slate-500 mt-1">Saved automatically for fast 1-click withdrawals.</p>
      </div>
      <button type="submit" class="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all">
        Save Profile
      </button>
    </form>
  </div>

  <!-- Change Password Form -->
  <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
      <i class="fa-solid fa-lock text-amber-400"></i>
      <span>Change Password</span>
    </h3>

    <form method="POST" action="profile.php" class="space-y-3">
      <input type="hidden" name="action" value="change_password">
      <div>
        <label class="block text-[11px] font-semibold text-slate-400 mb-1">Current Password</label>
        <input type="password" name="old_password" required class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
      </div>
      <div>
        <label class="block text-[11px] font-semibold text-slate-400 mb-1">New Password</label>
        <input type="password" name="new_password" required minlength="6" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500">
      </div>
      <button type="submit" class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all">
        Update Password
      </button>
    </form>
  </div>

  <!-- Logout Button -->
  <a href="profile.php?action=logout" class="block w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-2xl text-xs text-center uppercase tracking-wider transition-all">
    <i class="fa-solid fa-arrow-right-from-bracket mr-1"></i> Logout Account
  </a>
</main>

<?php require_once 'common/bottom.php'; ?>`
  }
];
