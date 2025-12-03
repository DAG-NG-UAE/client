export interface Requisition {
  requisition_id: string;
  requisition_raised_by: string;
  position: string;
  department: string;
  submitted_date: string;
  status: 'In Progress' | 'Approved' | 'Pending' | 'Closed';
  applicants: number;
  current_job_description_id: string | null
}