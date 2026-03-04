import { AppRole } from "@/utils/constants";


export interface User {
  user_id: string;
  full_name: string;
  email: string;
  role_name: AppRole;
  role_id: string;
  color?: string;
  microsoft_account_id?: string
  job_title?: string;
  // Add any other user properties here
}

// Define a type for the slice state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isLoggingIn: boolean;
  error: string | null;
}