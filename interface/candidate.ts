
export interface CandidateProfile { 
   requisition_id: string;
   department: string; 
  candidate_id: string;
  assigned_position_slot_id?: string; // FK to RequisitionLine (will be set after DB insert)
  candidate_name: string;
  source: string;
  hired_date?: string | null;
  offer_date?: string | null;
  current_gross_salary?: string;
  salary_offered?: number | null;
  role_applied_for?: string;
  location?: string;
  email?: string;
  mobile_number?: string;
  open_to_relocation?: string;
  notes?: string;
  current_status?: string;
  submitted_date?: string; // Changed to string to match usage, or Date if preferred

  // Demographics
  age?: string;
  state_of_origin?: string;
  qualification?: string;
  spouse_occupation?: string;
  children_details?: string;

  // Compensation
  total_experience_years?: string;
  employment_status?: string;
  current_place_of_work?: string;
  role_current?: string;
  current_net_salary?: string;
  benefits_received?: string;
  notice_period?: string;
  salary_target_min?: string;

  // Final Offer
  rejected_date?: string | null;
  rejection_reason?: string | null;
  joined_date?: string | null;

  // application additional details 
  privacy_consent?: boolean; 
  cover_letter?: string; 
  cv_path?: string
}