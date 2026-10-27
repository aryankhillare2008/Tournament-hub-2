import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Tournament, 
  Participant, 
  Transaction, 
  DepositRequest, 
  WithdrawalRequest, 
  AppSettings 
} from '../types';
import { 
  initialUsers, 
  initialTournaments, 
  initialParticipants, 
  initialTransactions, 
  initialDeposits, 
  initialWithdrawals, 
  initialSettings 
} from '../data/initialData';
import confetti from 'canvas-confetti';

interface AppContextType {
  // Data State
  users: User[];
  currentUser: User;
  tournaments: Tournament[];
  participants: Participant[];
  transactions: Transaction[];
  deposits: DepositRequest[];
  withdrawals: WithdrawalRequest[];
  settings: AppSettings;
  
  // Navigation & View State
  activeView: string;
  setActiveView: (view: string) => void;
  selectedTournamentId: number | null;
  setSelectedTournamentId: (id: number | null) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  userAuthToken: boolean;
  setUserAuthToken: (val: boolean) => void;
  
  // Notification Toast
  toast: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;

  // Actions
  switchUser: (userId: number) => void;
  userLogin: (username: string, password?: string) => boolean;
  userSignup: (username: string, email: string, password?: string) => boolean;
  userLogout: () => void;
  updateUserProfile: (email: string, upiId: string) => void;
  
  // Tournament Actions
  joinTournament: (tournamentId: number) => boolean;
  createTournament: (data: Omit<Tournament, 'id' | 'created_at'>) => void;
  updateRoomCredentials: (tournamentId: number, roomId: string, roomPass: string, status: Tournament['status']) => void;
  declareWinner: (tournamentId: number, winnerUserId: number) => void;
  deleteTournament: (tournamentId: number) => void;
  
  // Financial Actions
  submitDepositRequest: (amount: number, transactionId: string) => boolean;
  submitWithdrawalRequest: (amount: number, upiId: string) => boolean;
  approveDeposit: (depositId: number) => void;
  rejectDeposit: (depositId: number) => void;
  completeWithdrawal: (withdrawalId: number) => void;
  rejectWithdrawal: (withdrawalId: number) => void;
  
  // Admin Settings
  updateAdminSettings: (upiId: string, qrImageUrl: string, appName: string) => void;
  toggleUserBlock: (userId: number) => void;
  resetDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage-backed state for realistic persistence
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('adept_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUserId, setCurrentUserId] = useState<number>(() => {
    const saved = localStorage.getItem('adept_current_user_id');
    return saved ? JSON.parse(saved) : 1;
  });

  const [userAuthToken, setUserAuthToken] = useState<boolean>(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(true);

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem('adept_tournaments');
    return saved ? JSON.parse(saved) : initialTournaments;
  });

  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem('adept_participants');
    return saved ? JSON.parse(saved) : initialParticipants;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('adept_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [deposits, setDeposits] = useState<DepositRequest[]>(() => {
    const saved = localStorage.getItem('adept_deposits');
    return saved ? JSON.parse(saved) : initialDeposits;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('adept_withdrawals');
    return saved ? JSON.parse(saved) : initialWithdrawals;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('adept_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [activeView, setActiveView] = useState<string>('user_home');
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(1);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('adept_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('adept_current_user_id', JSON.stringify(currentUserId));
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('adept_tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('adept_participants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('adept_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('adept_deposits', JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem('adept_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('adept_settings', JSON.stringify(settings));
  }, [settings]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0] || {
    id: 1,
    username: 'AryanGamer',
    email: 'aryan@example.com',
    wallet_balance: 350,
    upi_id: 'aryan@okaxis',
    created_at: '2026-03-01'
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const switchUser = (userId: number) => {
    setCurrentUserId(userId);
    setUserAuthToken(true);
    showToast(`Switched user to ${users.find(u => u.id === userId)?.username}`, 'info');
  };

  const userLogin = (username: string) => {
    const found = users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase());
    if (found) {
      if (found.is_blocked) {
        showToast('Account is restricted. Contact support.', 'error');
        return false;
      }
      setCurrentUserId(found.id);
      setUserAuthToken(true);
      showToast(`Welcome back, ${found.username}!`, 'success');
      return true;
    }
    showToast('Invalid credentials. (Try: AryanGamer / ShadowNinja)', 'error');
    return false;
  };

  const userSignup = (username: string, email: string) => {
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      showToast('Username already taken.', 'error');
      return false;
    }
    const newUser: User = {
      id: Date.now(),
      username,
      email,
      wallet_balance: 50, // Welcome bonus
      upi_id: '',
      is_blocked: false,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    const newTxn: Transaction = {
      id: Date.now(),
      user_id: newUser.id,
      amount: 50,
      type: 'credit',
      description: 'Welcome Sign-up Bonus',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    setUsers(prev => [...prev, newUser]);
    setTransactions(prev => [newTxn, ...prev]);
    setCurrentUserId(newUser.id);
    setUserAuthToken(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    showToast('Account created! ₹50 welcome bonus credited.', 'success');
    return true;
  };

  const userLogout = () => {
    setUserAuthToken(false);
    showToast('Logged out successfully.', 'info');
  };

  const updateUserProfile = (email: string, upiId: string) => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, email, upi_id: upiId } : u));
    showToast('Profile & UPI ID updated successfully!', 'success');
  };

  const joinTournament = (tournamentId: number): boolean => {
    const t = tournaments.find(item => item.id === tournamentId);
    if (!t) {
      showToast('Tournament not found', 'error');
      return false;
    }
    if (t.status === 'Completed') {
      showToast('Tournament has already concluded.', 'error');
      return false;
    }
    const alreadyJoined = participants.some(p => p.tournament_id === tournamentId && p.user_id === currentUser.id);
    if (alreadyJoined) {
      showToast('You are already registered for this tournament!', 'warning');
      return false;
    }
    if (currentUser.wallet_balance < t.entry_fee) {
      showToast(`Insufficient balance. Entry fee is ₹${t.entry_fee}. Please add money via UPI.`, 'error');
      return false;
    }

    // Deduct fee
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, wallet_balance: u.wallet_balance - t.entry_fee } : u));
    
    // Add participant
    const newPart: Participant = {
      id: Date.now(),
      user_id: currentUser.id,
      tournament_id: tournamentId,
      username: currentUser.username,
      joined_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    setParticipants(prev => [...prev, newPart]);

    // Add transaction
    const newTxn: Transaction = {
      id: Date.now() + 1,
      user_id: currentUser.id,
      amount: t.entry_fee,
      type: 'debit',
      description: `Joined Tournament #${t.id}: ${t.title}`,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    setTransactions(prev => [newTxn, ...prev]);

    confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    showToast(`Successfully joined ${t.title}! Room details will be unlocked when live.`, 'success');
    return true;
  };

  const createTournament = (data: Omit<Tournament, 'id' | 'created_at'>) => {
    const newT: Tournament = {
      ...data,
      id: tournaments.length > 0 ? Math.max(...tournaments.map(t => t.id)) + 1 : 1,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    setTournaments(prev => [newT, ...prev]);
    showToast(`Tournament "${newT.title}" published!`, 'success');
  };

  const updateRoomCredentials = (tournamentId: number, roomId: string, roomPass: string, status: Tournament['status']) => {
    setTournaments(prev => prev.map(t => t.id === tournamentId ? { ...t, room_id: roomId, room_password: roomPass, status } : t));
    showToast('Room credentials & match status updated!', 'success');
  };

  const declareWinner = (tournamentId: number, winnerUserId: number) => {
    const t = tournaments.find(item => item.id === tournamentId);
    const winner = users.find(u => u.id === winnerUserId);
    if (!t || !winner) return;

    // Credit prize
    setUsers(prev => prev.map(u => u.id === winnerUserId ? { ...u, wallet_balance: u.wallet_balance + t.prize_pool } : u));
    
    // Update tournament status
    setTournaments(prev => prev.map(item => item.id === tournamentId ? {
      ...item,
      status: 'Completed',
      winner_user_id: winnerUserId,
      winner_username: winner.username
    } : item));

    // Log prize transaction
    const newTxn: Transaction = {
      id: Date.now(),
      user_id: winnerUserId,
      amount: t.prize_pool,
      type: 'credit',
      description: `Prize Money - Winner of ${t.title}`,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    setTransactions(prev => [newTxn, ...prev]);

    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    showToast(`Winner declared! ₹${t.prize_pool} credited to ${winner.username}'s wallet.`, 'success');
  };

  const deleteTournament = (tournamentId: number) => {
    setTournaments(prev => prev.filter(t => t.id !== tournamentId));
    setParticipants(prev => prev.filter(p => p.tournament_id !== tournamentId));
    showToast('Tournament deleted.', 'info');
  };

  const submitDepositRequest = (amount: number, transactionId: string): boolean => {
    if (amount <= 0) {
      showToast('Please enter a valid amount.', 'error');
      return false;
    }
    if (!transactionId.trim()) {
      showToast('Please enter the UPI Transaction ID / UTR.', 'error');
      return false;
    }
    if (deposits.some(d => d.transaction_id.toLowerCase() === transactionId.trim().toLowerCase())) {
      showToast('This Transaction ID has already been submitted.', 'error');
      return false;
    }

    const newDep: DepositRequest = {
      id: Date.now(),
      user_id: currentUser.id,
      username: currentUser.username,
      amount,
      transaction_id: transactionId.trim(),
      status: 'Pending',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    setDeposits(prev => [newDep, ...prev]);
    showToast(`Deposit request for ₹${amount} submitted! Admin will verify and credit your wallet.`, 'success');
    return true;
  };

  const submitWithdrawalRequest = (amount: number, upiId: string): boolean => {
    if (amount < 50) {
      showToast('Minimum withdrawal is ₹50.', 'error');
      return false;
    }
    if (amount > currentUser.wallet_balance) {
      showToast('Insufficient wallet balance.', 'error');
      return false;
    }
    if (!upiId.trim()) {
      showToast('Please enter your UPI ID.', 'error');
      return false;
    }

    // Save UPI ID to user if changed
    if (upiId !== currentUser.upi_id) {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, upi_id: upiId } : u));
    }

    const newW: WithdrawalRequest = {
      id: Date.now(),
      user_id: currentUser.id,
      username: currentUser.username,
      amount,
      upi_id: upiId.trim(),
      status: 'Pending',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    setWithdrawals(prev => [newW, ...prev]);
    showToast(`Withdrawal request of ₹${amount} sent to ${upiId}.`, 'success');
    return true;
  };

  const approveDeposit = (depositId: number) => {
    const dep = deposits.find(d => d.id === depositId);
    if (!dep || dep.status !== 'Pending') return;

    // Credit balance
    setUsers(prev => prev.map(u => u.id === dep.user_id ? { ...u, wallet_balance: u.wallet_balance + dep.amount } : u));

    // Update deposit status
    setDeposits(prev => prev.map(d => d.id === depositId ? { ...d, status: 'Completed' } : d));

    // Add transaction
    const newTxn: Transaction = {
      id: Date.now(),
      user_id: dep.user_id,
      amount: dep.amount,
      type: 'credit',
      description: `UPI Deposit Approved (UTR: ${dep.transaction_id})`,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    setTransactions(prev => [newTxn, ...prev]);
    showToast(`Deposit of ₹${dep.amount} approved & credited to ${dep.username}!`, 'success');
  };

  const rejectDeposit = (depositId: number) => {
    setDeposits(prev => prev.map(d => d.id === depositId ? { ...d, status: 'Rejected' } : d));
    showToast('Deposit request marked Rejected.', 'warning');
  };

  const completeWithdrawal = (withdrawalId: number) => {
    const req = withdrawals.find(w => w.id === withdrawalId);
    if (!req || req.status !== 'Pending') return;

    const targetUser = users.find(u => u.id === req.user_id);
    if (!targetUser || targetUser.wallet_balance < req.amount) {
      showToast('User has insufficient wallet balance.', 'error');
      return;
    }

    // Deduct balance
    setUsers(prev => prev.map(u => u.id === req.user_id ? { ...u, wallet_balance: u.wallet_balance - req.amount } : u));

    // Update status
    setWithdrawals(prev => prev.map(w => w.id === withdrawalId ? { ...w, status: 'Completed' } : w));

    // Log transaction
    const newTxn: Transaction = {
      id: Date.now(),
      user_id: req.user_id,
      amount: req.amount,
      type: 'debit',
      description: `UPI Withdrawal to ${req.upi_id}`,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    setTransactions(prev => [newTxn, ...prev]);
    showToast(`Withdrawal of ₹${req.amount} processed for ${req.username}!`, 'success');
  };

  const rejectWithdrawal = (withdrawalId: number) => {
    setWithdrawals(prev => prev.map(w => w.id === withdrawalId ? { ...w, status: 'Rejected' } : w));
    showToast('Withdrawal request rejected.', 'warning');
  };

  const updateAdminSettings = (upiId: string, qrImageUrl: string, appName: string) => {
    const effectiveQr = qrImageUrl.trim() || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(appName)}&cu=INR`)}`;
    setSettings({
      ...settings,
      upi_id: upiId,
      qr_image_url: effectiveQr,
      app_name: appName,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });
    showToast('Admin UPI ID and QR settings updated successfully!', 'success');
  };

  const toggleUserBlock = (userId: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_blocked: !u.is_blocked } : u));
    showToast('User status updated.', 'info');
  };

  const resetDatabase = () => {
    setUsers(initialUsers);
    setCurrentUserId(1);
    setTournaments(initialTournaments);
    setParticipants(initialParticipants);
    setTransactions(initialTransactions);
    setDeposits(initialDeposits);
    setWithdrawals(initialWithdrawals);
    setSettings(initialSettings);
    localStorage.clear();
    showToast('Database reset to original clean state!', 'success');
  };

  return (
    <AppContext.Provider value={{
      users,
      currentUser,
      tournaments,
      participants,
      transactions,
      deposits,
      withdrawals,
      settings,
      activeView,
      setActiveView,
      selectedTournamentId,
      setSelectedTournamentId,
      isAdminLoggedIn,
      setIsAdminLoggedIn,
      userAuthToken,
      setUserAuthToken,
      toast,
      showToast,
      switchUser,
      userLogin,
      userSignup,
      userLogout,
      updateUserProfile,
      joinTournament,
      createTournament,
      updateRoomCredentials,
      declareWinner,
      deleteTournament,
      submitDepositRequest,
      submitWithdrawalRequest,
      approveDeposit,
      rejectDeposit,
      completeWithdrawal,
      rejectWithdrawal,
      updateAdminSettings,
      toggleUserBlock,
      resetDatabase
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
