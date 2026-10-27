import { User, Tournament, Participant, Transaction, DepositRequest, WithdrawalRequest, AppSettings } from '../types';

export const initialUsers: User[] = [
  {
    id: 1,
    username: 'AryanGamer',
    email: 'aryan@example.com',
    wallet_balance: 350,
    upi_id: 'aryan@okaxis',
    is_blocked: false,
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-03-01 10:00:00'
  },
  {
    id: 2,
    username: 'ShadowNinja',
    email: 'shadow@example.com',
    wallet_balance: 120,
    upi_id: 'shadow@paytm',
    is_blocked: false,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-03-02 11:30:00'
  },
  {
    id: 3,
    username: 'ViperSniper',
    email: 'viper@example.com',
    wallet_balance: 540,
    upi_id: 'viper@ybl',
    is_blocked: false,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-03-03 14:15:00'
  },
  {
    id: 4,
    username: 'PhoenixQueen',
    email: 'phoenix@example.com',
    wallet_balance: 80,
    upi_id: 'phoenix@icici',
    is_blocked: false,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-03-04 18:20:00'
  }
];

export const initialTournaments: Tournament[] = [
  {
    id: 1,
    title: 'BGMI Erangel Mega Championship #402',
    game_name: 'BGMI',
    entry_fee: 50,
    prize_pool: 2000,
    match_time: '2026-10-07 19:30:00',
    room_id: 'ROOM-88291',
    room_password: 'adept99play',
    status: 'Live',
    commission_percent: 15,
    max_players: 100,
    game_type: 'Squad',
    map_name: 'Erangel',
    banner_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-10-06 12:00:00'
  },
  {
    id: 2,
    title: 'Free Fire MAX Bermuda Clash Solo',
    game_name: 'Free Fire MAX',
    entry_fee: 30,
    prize_pool: 1200,
    match_time: '2026-10-07 21:00:00',
    room_id: 'FF-49210',
    room_password: 'ffpass2026',
    status: 'Upcoming',
    commission_percent: 20,
    max_players: 48,
    game_type: 'Solo',
    map_name: 'Bermuda',
    banner_image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-10-06 15:00:00'
  },
  {
    id: 3,
    title: 'Call of Duty: Warzone Mobile Duo Battle',
    game_name: 'COD Mobile',
    entry_fee: 100,
    prize_pool: 3500,
    match_time: '2026-10-08 18:00:00',
    room_id: '',
    room_password: '',
    status: 'Upcoming',
    commission_percent: 15,
    max_players: 50,
    game_type: 'Duo',
    map_name: 'Verdansk',
    banner_image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-10-07 09:00:00'
  },
  {
    id: 4,
    title: 'BGMI Sanhok Blitz Solo Cup',
    game_name: 'BGMI',
    entry_fee: 25,
    prize_pool: 800,
    match_time: '2026-10-06 20:00:00',
    room_id: 'ROOM-10928',
    room_password: 'sanhokwin',
    status: 'Completed',
    commission_percent: 20,
    winner_user_id: 1,
    winner_username: 'AryanGamer',
    max_players: 40,
    game_type: 'Solo',
    map_name: 'Sanhok',
    banner_image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-10-05 10:00:00'
  }
];

export const initialParticipants: Participant[] = [
  { id: 1, user_id: 1, tournament_id: 1, username: 'AryanGamer', joined_at: '2026-10-06 18:00:00' },
  { id: 2, user_id: 2, tournament_id: 1, username: 'ShadowNinja', joined_at: '2026-10-06 19:10:00' },
  { id: 3, user_id: 3, tournament_id: 1, username: 'ViperSniper', joined_at: '2026-10-06 20:30:00' },
  { id: 4, user_id: 1, tournament_id: 4, username: 'AryanGamer', joined_at: '2026-10-05 14:00:00' },
  { id: 5, user_id: 2, tournament_id: 4, username: 'ShadowNinja', joined_at: '2026-10-05 15:00:00' },
  { id: 6, user_id: 4, tournament_id: 4, username: 'PhoenixQueen', joined_at: '2026-10-05 16:20:00' }
];

export const initialTransactions: Transaction[] = [
  { id: 1, user_id: 1, amount: 800, type: 'credit', description: 'Prize Money - Winner of BGMI Sanhok Blitz', created_at: '2026-10-06 21:00:00' },
  { id: 2, user_id: 1, amount: 50, type: 'debit', description: 'Joined Tournament #1: BGMI Erangel Mega', created_at: '2026-10-06 18:00:00' },
  { id: 3, user_id: 1, amount: 25, type: 'debit', description: 'Joined Tournament #4: BGMI Sanhok Blitz', created_at: '2026-10-05 14:00:00' },
  { id: 4, user_id: 1, amount: 100, type: 'credit', description: 'UPI Manual Deposit Approved (UTR: UPI994821038)', created_at: '2026-10-05 12:30:00' }
];

export const initialDeposits: DepositRequest[] = [
  {
    id: 1,
    user_id: 1,
    username: 'AryanGamer',
    amount: 100,
    transaction_id: 'UPI994821038',
    status: 'Completed',
    created_at: '2026-10-05 12:20:00',
    note: 'Verified via GPay Bank SMS'
  },
  {
    id: 2,
    user_id: 2,
    username: 'ShadowNinja',
    amount: 200,
    transaction_id: 'PAYTM8829104719',
    status: 'Pending',
    created_at: '2026-10-07 10:15:00'
  },
  {
    id: 3,
    user_id: 3,
    username: 'ViperSniper',
    amount: 500,
    transaction_id: 'PHONEPE736291038',
    status: 'Pending',
    created_at: '2026-10-07 10:45:00'
  }
];

export const initialWithdrawals: WithdrawalRequest[] = [
  {
    id: 1,
    user_id: 3,
    username: 'ViperSniper',
    amount: 250,
    upi_id: 'viper@ybl',
    status: 'Pending',
    created_at: '2026-10-07 09:30:00'
  },
  {
    id: 2,
    user_id: 1,
    username: 'AryanGamer',
    amount: 400,
    upi_id: 'aryan@okaxis',
    status: 'Completed',
    created_at: '2026-10-04 16:00:00',
    admin_note: 'Transferred via UPI UTR: 48920194819'
  }
];

export const initialSettings: AppSettings = {
  id: 1,
  upi_id: 'adeptplay@upi',
  qr_image_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=adeptplay@upi&pn=AdeptPlayEsports&cu=INR',
  app_name: 'Adept Play Esports',
  support_email: 'support@adeptplay.com',
  support_whatsapp: '+91 98765 43210',
  min_deposit: 10,
  min_withdrawal: 50,
  updated_at: '2026-10-07 08:00:00'
};
