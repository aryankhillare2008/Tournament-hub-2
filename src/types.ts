export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  wallet_balance: number;
  upi_id?: string;
  is_blocked?: boolean;
  avatar?: string;
  created_at: string;
}

export interface Admin {
  id: number;
  username: string;
  password?: string;
}

export type TournamentStatus = 'Upcoming' | 'Live' | 'Completed';

export interface Tournament {
  id: number;
  title: string;
  game_name: string;
  entry_fee: number;
  prize_pool: number;
  match_time: string;
  room_id: string;
  room_password: string;
  status: TournamentStatus;
  commission_percent: number;
  winner_user_id?: number | null;
  winner_username?: string | null;
  max_players?: number;
  game_type?: 'Solo' | 'Duo' | 'Squad';
  map_name?: string;
  banner_image?: string;
  created_at: string;
}

export interface Participant {
  id: number;
  user_id: number;
  tournament_id: number;
  username?: string;
  joined_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  created_at: string;
}

export interface DepositRequest {
  id: number;
  user_id: number;
  username: string;
  amount: number;
  transaction_id: string;
  status: 'Pending' | 'Completed' | 'Rejected';
  created_at: string;
  note?: string;
}

export interface WithdrawalRequest {
  id: number;
  user_id: number;
  username: string;
  amount: number;
  upi_id: string;
  status: 'Pending' | 'Completed' | 'Rejected';
  created_at: string;
  admin_note?: string;
}

export interface AppSettings {
  id: number;
  upi_id: string;
  qr_image_url: string;
  app_name: string;
  support_email: string;
  support_whatsapp: string;
  min_deposit: number;
  min_withdrawal: number;
  updated_at: string;
}

export interface FileItem {
  name: string;
  path: string;
  category: 'root' | 'common' | 'admin' | 'admin_common' | 'sql';
  content: string;
  description: string;
}
