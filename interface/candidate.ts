
export interface CandidateActionButton {
  label: string;
  actionType: string; 
  description: string; 
  triggersWorkflow?: "Scheduling" | "Offer" | "Reject Candidate" | "Begin Pre-offer Discussion" | "Begin Internal Salary Proposal"; 
  requiresConfirmation?: boolean; 
  requiresNotes?: boolean; 
  targetStatus?: string; 
}

export interface CandidateActions {
  progressionAction: CandidateActionButton | null;
  rejectionAction: CandidateActionButton | null;
}

export interface CandidateProfile {
  requisition_id: string;
  department: string;
  candidate_id: string;
  offer_id: string;
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
  interview_id?: string; 
  interview_event_id?: string;
  interview_date?: string;
  interview_time?: string;
  interview_location?: string;
  hiring_manger?: string;

  // Matching
  match_score?: number;
  requirement_match?: RequirementMatch[];
  share_token?: string;

  //determine if you will show the share competency link button or not 
  competency_profile_completed_at?: string
}

export interface RequirementMatch {
  skill_name: string | null;
  weight_score: number;
  required_rank: number;
  candidate_rank: number;
  category_label: string;
  required_label: string;
  candidate_label: string;
  is_linear: boolean;
}

export interface CandidateStatusHistory {
  history_id: number;
  candidate_id: string;
  requisition_id: string;
  old_status: string;
  new_status: string;
  changed_date: string;
  changed_by: string | null;
  notes: string | null;
}

export interface CandidateEvaluationPayload {
  interviewer_id: string;
  interviewer_name: string;
  interviewer_grand_total: string;
  candidate_overall_avg: string;
}

export interface EvaluationCriterion {
  score: number;
  comments: string;
  criteria: string;
}

export interface CandidateEvaluationSession {
  interviewer_name: string;
  interviewer_id: string;
  evaluation_date: string;
  evaluation_details: EvaluationCriterion[];
  day_grand_total: string;
  day_average: string;
  recommendation?: string; // Keeping this optional as it might be useful or inferred
}
