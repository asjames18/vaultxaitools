export interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  role?: string;
}

export type UserFilterStatus = 'all' | 'confirmed' | 'unconfirmed';

export type UserMessage = { type: 'success' | 'error'; text: string } | null;
