// Define a type for the user data
export interface User {
    id: string;
    full_name: string;
    email: string;
    role_name: string;
    // Add any other user properties here
}
  
  // Define a type for the slice state
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}