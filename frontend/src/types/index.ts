export interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  intent?: string;
  time: string;
}

export interface UserItem {
  username: string;
  role: string;
  is_active: boolean;
  telegram_id?: string;
  created_at: string;
}

export interface TelegramGroup {
  chat_id: number;
  title: string;
  type: string;
  updated_at: string;
}

export interface TelegramMember {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  updated_at: string;
}

export interface Employee {
  name: string;
  username: string;
  position: string;
  contract_salary: number;
  fuel_phone: number;
  other: number;
  meal: number;
  team: string;
}

export interface AuthContextType {
  currentUser: string | null;
  currentUserRole: string;
  login: (username: string, role: string) => void;
  logout: () => void;
}
