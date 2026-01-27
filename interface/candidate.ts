export type CandidateStatus =
  | "applied"
  | "shortlisted"
  | "interview_scheduled"
  | "interviewed"
  | "offer_extended"
  | "offer_accepted"
  | "offer_rejected";

export interface CandidateActionButton {
  label: string; // Text displayed on the button
  actionType: string; // A unique identifier for the action (e.g., 'SHORTLIST_CANDIDATE')
  description: string; // Detailed description of the action, as provided
  triggersWorkflow?: "Scheduling" | "Offer"; // Indicates if a specific workflow is triggered
  requiresConfirmation?: boolean; // True if a confirmation dialog is needed
  requiresNotes?: boolean; // True if notes are required for this action
  targetStatus?: string; // The status the candidate will transition to (for simple changes)
}

export interface CandidateActions {
  progressionAction: CandidateActionButton | null;
  rejectionAction: CandidateActionButton | null;
}

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
  cv_path?: string;

  // candidate status history
  old_status?: string;
  new_status?: string;
  changed_by?: string;
  shortlisted_date?: string; //this is saved based done on the new_status being equal to 'shortlisted'
  // notes is already above

  // Interview details
  interview_date?: string;
  interview_time?: string;
  interview_location?: string;
  hiring_manger?: string;

  // Matching
  match_score?: number;
  requirement_match?: RequirementMatch[];
}

export interface RequirementMatch {
  skill_name: string | null;
  weight_score: number;
  required_rank: number;
  candidate_rank: number;
  category_label: string;
  required_label: string;
  candidate_label: string;
}
