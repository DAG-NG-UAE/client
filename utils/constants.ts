export const DATABASE_FIELDS = [
  'Full Name',
  'Role Applied For',
  'Location',
  'CV Source',
  'Mobile Number',
  'Email',
  'Total Years Experience',
  'Employment Status',
  'Current Place Worked',
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
    { name: 'Job Title', required: true },
    { name: 'Department', required: true },
    { name: 'Location', required: true },
    { name: 'Hiring Manager', required: false },
    { name: 'Status', required: false },
    { name: 'Full Name', required: true },
    { name: 'Role Applied For', required: true },
    { name: 'CV Source', required: false },
    { name: 'Mobile Number', required: false },
    // { name: 'Email', required: false },
    // { name: 'Total Years Experience', required: false },
    // { name: 'Employment Status', required: false },
    // { name: 'Current Place Worked', required: false },
    // { name: 'Current Role', required: false },
    // { name: 'Current Gross Salary', required: false },
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
    { name: 'Gross Salary offered', required: false},
    { name: 'Hired Date', required: false}
  ],
  // Add more mappings for other document types
};

// You might still keep a combined list if needed for some generic validation or display,
// but the primary mapping logic would use DATABASE_FIELDS_BY_DOCUMENT_TYPE.
export const ALL_DATABASE_FIELDS = [
  ...DATABASE_FIELDS_BY_DOCUMENT_TYPE[DOCUMENT_TYPES.RECRUITMENT_TRACKER].map(field => field.name),
];
