export interface CandidateProfile { 
  candidate_id: string;
  candidate_name: string;
  email: string | null; 
  mobile_number: string | null; 
  location: string | null; 
  current_status: string | null; 
  source: string | null; 
  total_experience_years: string | null;
}