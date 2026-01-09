export interface AvailablePositions { 
  requisition_id: string; 
  position: string 
}

export interface RequisitionPosition {
  position_slot_id: string;
  slot_number: number;
  location: string;
}

export interface RequisitionPositionLists { 
  position_slot_id: string; 
  loc: string; 
  qty: number
}[]

export interface Requisition {
  requisition_id: string;
  requisition_raised_by: string;
  position: string;
  department: string;
  submitted_date: string;
  status: "In Progress" | "Approved" | "Pending" | "Closed";
  applicants: number;
  current_job_description_id: string | null;
  sanity_job_list_key: string 

  // Extended fields for detailed view
  num_positions?: number;
  num_filled?: number;
  proposed_salary?: string;
  expected_start_date?: string;
  positions_list: {position_slot_id: string; loc: string; qty: number; is_active: boolean}[];
  stakeholder_names: {id: string; email: string; name: string; role: string}[]; 
  locations: string;
  recruitment_reason?: string;
  recruiter?: string;
  content?: string;

  published?: boolean; 
  public_share_link?:string;
  activity_log?: {
    title: string;
    user: string;
    timestamp: string;
    details?: string;
  }[];
  status_history?: {
    status: string;
    date: string;
  }[];

  created_at: string;

  posting_locations?: string[]; //! Delete this later 
  requisition_positions?: RequisitionPosition[];//! Delete this later 
}

export type RecruiterSelection = { userId: string; roleId: string; };