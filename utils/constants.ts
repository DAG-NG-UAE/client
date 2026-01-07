export const DATABASE_FIELDS = [
  "Name",
  "Role Applied For",
  "Location",
  "CV Source",
  "Mobile No",
  "Email ID",
  "Total Years Experience",
  "Employment Status",
  "Current/Last Placed Worked",
  "Current Role",
  "Current Gross Salary",
  "Current Net Salary",
  "Other Benefits",
  "Notice Period",
  "Qualification & Professional Certification",
  "Age",
  "State of Origin",
  "Spouse Occupation (If Married)",
  "Children",
  "Minimum expected Salary",
  "Open to Relocation",
  // Add more database fields as needed
];
export const DOCUMENT_TYPES = {
  RECRUITMENT_TRACKER: "Recruitment Tracker",
  // Add other document types as needed
};

export const DATABASE_FIELDS_BY_DOCUMENT_TYPE = {
  [DOCUMENT_TYPES.RECRUITMENT_TRACKER]: [
    { name: "Date of Request Received", required: true, description: 'Date the request was sent' },
    { name: "Role", required: true, description: 'Role applied for' },
    { name: "Department", required: true, description: 'Department' },
    { name: "Region", required: true, description: 'Region' },
    // { name: 'Hiring Manager', required: false },
    { name: 'Expected Start Date', required: false, description: 'Date the candidate is expected to start' },
    { name: "Status", required: false, description: 'Status' },
    { name: "Candidate Name", required: true },
    { name: "Candidate Role", required: true },
    // { name: 'CV Source', required: false },
    // { name: 'Mobile Number', required: false },
    // { name: 'Email', required: false },
    // { name: 'Total Years Experience', required: false },
    // { name: 'Employment Status', required: false },
    // { name: 'Current Place Worked', required: false },
    // { name: 'Current Role', required: false },
    { name: "Existing / Previous Salary", required: false, description: 'Previous Salary of Candidate' },
    // { name: 'Current Net Salary', required: false },
    // { name: 'Other Benefits', required: false },
    // { name: 'Notice Period', required: false },
    // { name: 'Qualification & Professional Certification', required: false },
    // { name: 'Age', required: false },
    // { name: 'State of Origin', required: false },
    // { name: 'Spouse Occupation (If Married)', required: false },
    // { name: 'Children', required: false },
    // { name: 'Minimum expected Salary', required: false },
    // { name: 'Open to Relocation', required: false },
    { name: "Source of Recruitment", required: false, description: "Source used to get the candidate"},
    { name: "Gross Salary Offered", required: false, description: "Gross salary offered to the candidate" },
    { name: "Offered Date", required: false, description: "Date when the offer was made"},
    { name: "Joining date", required: false, description: "Date when the candidate is joining" },
  ],
  // Add more mappings for other document types
};

// You might still keep a combined list if needed for some generic validation or display,
// but the primary mapping logic would use DATABASE_FIELDS_BY_DOCUMENT_TYPE.
export const ALL_DATABASE_FIELDS = [
  ...DATABASE_FIELDS_BY_DOCUMENT_TYPE[DOCUMENT_TYPES.RECRUITMENT_TRACKER].map(
    (field) => field.name
  ),
];

export interface HistoricalRecord {
  historical_id: string;
  upload_date: string;
  file_name: string;
  requisition_count: number;
  candidate_count: number;
  status: string;
}

export const statusDetails: { [key: string]: { title: string; subtitle: string } } = {
  all: {
    title: 'Manage Candidates', 
    subtitle: 'Manage and track all candidate applications'
  },
  applied: {
    title: 'Applied Candidates',
    subtitle: 'View and manage all candidates who have applied for open positions.',
  },
  shortlisted: {
    title: 'Shortlisted Candidates',
    subtitle: 'View and manage all shortlisted candidates for various roles.',
  },
  'interview_scheduled': {
    title: 'Interview Scheduled',
    subtitle: 'Candidates who have an interview scheduled.',
  },
  'pending_feedback': {
    title: 'Pending Feedback',
    subtitle: 'Candidates for whom feedback is pending post-interview.',
  },
  interviewed: {
    title: 'Interviewed Candidates',
    subtitle: 'Candidates who have been interviewed.',
  },
  'offer-accepted': {
    title: 'Offer Accepted',
    subtitle: 'Candidates who have accepted a job offer.',
  },
  'offer-rejected': {
    title: 'Offer Rejected',
    subtitle: 'Candidates who have rejected a job offer.',
  },
  'offer-withdrawn': {
    title: 'Offer Withdrawn',
    subtitle: 'Candidates whose job offers have been withdrawn.',
  },
};

export const enum allowedCandidatePaths{ 
  'all' = 'all',
  'applied' = 'applied', 
  'shortlisted' = 'shortlisted', 
  'interview-scheduled' = 'interview-scheduled', 
  'pending-feedback' = 'pending-feedback', 
  'interviewed' ='interviewed' , 
  'offer-accepted' = 'offer-accepted', 
  'offer-rejected' = 'offer-rejected', 
  'offer-withdrawn' = 'offer-withdrawn'
}

export const enum AppRole { 
  Admin = 'admin',
  HR = 'hr',
  Recruiter = 'recruiter',
  HiringManager = 'hiring_manager',
  StandardEmployee = 'standard_employee',

  // 
  HeadOfHr = 'head_of_hr', 
  HrManager = 'hr_manager'
}

export const offerStatusDetail: { [key: string]: { title: string; subtitle: string } } = {
  all: {
    title: 'Offers', 
    subtitle: 'Manage and track all offers'
  },
  pending: {
    title: 'Pending Offers',
    subtitle: 'View and manage all pending offers.',
  },
  accepted: {
    title: 'Accepted Offers',
    subtitle: 'View and manage all accepted offers.',
  },
  rejected: {
    title: 'Rejected Offers',
    subtitle: 'View and manage all rejected offers.',
  },
}