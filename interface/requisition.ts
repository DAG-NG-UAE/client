export interface Requisition {
  requisition_id: string;
  requisition_raised_by: string;
  position: string;
  department: string;
  submitted_date: string;
  status: "In Progress" | "Approved" | "Pending" | "Closed";
  applicants: number;
  current_job_description_id: string | null;

  // Extended fields for detailed view
  num_positions?: number;
  proposed_salary?: string;
  posting_locations?: string[];
  recruiter?: string;
  job_description?: string;
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
}
