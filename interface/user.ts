// Define a type for the user data
export enum AppRole {
  Admin = "admin",
  Recruiter = "recruiter",
  HiringManager = "hiring_manager",
  StandardEmployee = "standard_employee",
  HeadOfHr = 'head_of_hr', 
  HrManager = 'hr_manager'
}

export interface User {
    id: string;
    full_name: string;
    email: string;
    role_name: AppRole;
    // Add any other user properties here
}
  
  // Define a type for the slice state
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}