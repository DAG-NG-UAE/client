export const DATABASE_FIELDS = [
  'Name',
  'Role Applied For',
  'Location',
  'CV Source',
  'Mobile No',
  'Email ID',
  'Total Years Experience',
  'Employment Status',
  'Current/Last Placed Worked',
  'Current Role',
  'Current Gross Salary',
  'Current Net Salary',
  'Other Benefits',
  'Notice Period',
  'Qualification & Professional Certification',
  'Age',
  'State of Origin',
  'Spouse Occupation (If Married)',
  'Children',
  'Minimum expected Salary',
  'Open to Relocation'
  // Add more database fields as needed
];
export const DOCUMENT_TYPES = {
  RECRUITMENT_TRACKER: 'Recruitment Tracker',
  // Add other document types as needed
};

export const DATABASE_FIELDS_BY_DOCUMENT_TYPE = {
  [DOCUMENT_TYPES.RECRUITMENT_TRACKER]: [
    { name: 'Date of Request Received', required: true},
    { name: 'Role', required: true },
    { name: 'Department', required: true },
    { name: 'Region', required: true },
    // { name: 'Hiring Manager', required: false },
    // { name: 'Expected Start Date', required: false},
    { name: 'Status', required: false },
    { name: 'Candidate Name', required: true },
    { name: 'Candidate Role', required: true },
    // { name: 'CV Source', required: false },
    // { name: 'Mobile Number', required: false },
    // { name: 'Email', required: false },
    // { name: 'Total Years Experience', required: false },
    // { name: 'Employment Status', required: false },
    // { name: 'Current Place Worked', required: false },
    // { name: 'Current Role', required: false },
    { name: 'Existing / Previous Salary', required: false },
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
    { name: 'Gross Salary Offered', required: false},
    { name: 'Offered Date', required: false}
  ],
  // Add more mappings for other document types
};

// You might still keep a combined list if needed for some generic validation or display,
// but the primary mapping logic would use DATABASE_FIELDS_BY_DOCUMENT_TYPE.
export const ALL_DATABASE_FIELDS = [
  ...DATABASE_FIELDS_BY_DOCUMENT_TYPE[DOCUMENT_TYPES.RECRUITMENT_TRACKER].map(field => field.name),
];

export interface HistoricalRecord {
  uploadDate: string;
  fileName: string;
  type: 'Closed Positions' | 'Open Positions' | 'On Hold';
  year: number;
  quarter: string;
  requisitions: number;
  candidates: number;
  status: 'Complete' | 'Failed';
}

export const SAMPLE_HISTORICAL_DATA: HistoricalRecord[] = [
  {
    uploadDate: 'Nov 29, 2025',
    fileName: 'dummy_candidate.xlsx',
    type: 'Closed Positions',
    year: 2024,
    quarter: 'Q4',
    requisitions: 45,
    candidates: 234,
    status: 'Complete',
  },
  {
    uploadDate: 'Nov 28, 2025',
    fileName: 'Q4_2024_Recruitment_Data.xlsx',
    type: 'Closed Positions',
    year: 2024,
    quarter: 'Q4',
    requisitions: 45,
    candidates: 234,
    status: 'Complete',
  },
  {
    uploadDate: 'Nov 25, 2025',
    fileName: 'Q3_2024_Open_Positions.xlsx',
    type: 'Open Positions',
    year: 2024,
    quarter: 'Q3',
    requisitions: 28,
    candidates: 156,
    status: 'Complete',
  },
  {
    uploadDate: 'Nov 22, 2025',
    fileName: 'Q2_2024_Recruitment_Tracker.xlsx',
    type: 'Closed Positions',
    year: 2024,
    quarter: 'Q2',
    requisitions: 38,
    candidates: 189,
    status: 'Complete',
  },
  {
    uploadDate: 'Nov 20, 2025',
    fileName: 'Q1_2024_Historical_Data.xlsx',
    type: 'On Hold',
    year: 2024,
    quarter: 'Q1',
    requisitions: 12,
    candidates: 45,
    status: 'Failed',
  },
];