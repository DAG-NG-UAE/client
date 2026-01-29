export interface Clauses {
  master_clause_id: string;
  title: string;
  content: string;
  is_mandatory: boolean;
  custom_content?: string;
  company_name?: string;
}
export interface ExtendedClause extends Clauses {
  instanceId: string; // Unique ID for the drag mapping (in case multiple of same clause)
  sort_order: number; // Added for sorting
}

export interface Offer {
  offer_id: string;
  candidate_id: string;
  current_status: string; //this is the candidate current status
  requisition_id: string;
  position: string;
  location: string;
  salary_net: number;
  commencement_date: string;
  company_name: string;
  accepted_at: string;
  rejection_reason: string | null;
  digital_signature: string;
  status: "accepted" | "rejected" | "pending";
  expiry_date: string;
  finalized_date: string;
  last_accessed_at: string;
  access_count: number;

  clauses?: Clauses[];
}

export interface Language {
  language: string;
  read: boolean;
  write: boolean;
  speak: boolean;
}

export interface FamilyMember {
  relation_type: string;
  name: string;
  dob: string | null; // ISO string YYYY-MM-DD
  gender: string;
  profession: string;
}

export interface EmploymentHistory {
  company_name: string;
  doj: string | null;
  dol: string | null;
  last_designation: string;
  reason_for_leaving: string;
}

export interface EducationalHistory {
  qualification: string;
  institute: string;
  specialization: string;
  passing_year: string;
}

export interface TrainingCertification {
  name: string;
  location: string;
  completion_date: string | null;
}

export interface Reference {
  name: string;
  contact_no: string;
}

export interface NegotiationDetails {
  sender: string;
  candidateName: string;
  message: string;
  timestamp: string;
}

export interface JoiningDetails {
  // Section 2: Personal Details
  first_name: string;
  last_name: string;
  middle_name: string;
  gender: string;
  dob: string | null;
  place_of_birth: string;
  country_of_birth: string;
  nationality: string;
  marital_status: string;
  religion: string;
  blood_group: string;
  languages: Language[];

  // Section 3: Contact & Address
  permanent_address: string;
  current_address: string;
  mobile_nigeria: string;
  personal_email: string;

  // Section 4: Identification & Licenses
  passport_number: string;
  passport_issue_date: string | null;
  passport_expiry_date: string | null;
  passport_place_of_issue: string;
  has_driving_license: string; // "Yes" / "No"
  driving_license_number: string;

  // Section 5: Financials
  bank_name: string;
  account_number: string;
  account_type: string; // "Savings" | "Current"
  pension_fund_account: string;
  gross_salary: string;

  // Section 6: Family & Next of Kin
  relatives_in_company: {
    has_relative: string; // "Yes" / "No"
    name: string;
    relation: string;
    dept: string;
  };
  family_members: FamilyMember[];
  next_of_kin: {
    name: string;
    relationship: string;
    age: number;
    address: string; // Often needed
    phone: string; // Often needed
  };

  // Section 7: Emergency Contacts & References
  emergency_primary: {
    name: string;
    relationship: string;
    address: string;
    phone: string;
  };
  references: Reference[];

  // Section 8: History
  employment_history: EmploymentHistory[];
  educational_history: EducationalHistory[];
  trainings_certifications: TrainingCertification[];
  negotiation_history?: NegotiationDetails[];
  preferred_email?: string;
  preferred_number?: string;
}

export interface Guarantor {
  guarantor_full_name: string;
  email_address: string;
  place_of_work_address: string;
  income_range: string;
  relationship_with_employee: string;
  relationship_other?: string;
  known_duration: string;
  known_duration_comment?: string; // "Comments"
  assessment_character: string;
  assessment_comment?: string;
  is_honest: string;
  recommend_for_employment: string;
  recommend_comment?: string;
  will_stand_as_guarantor: string;
  general_comment?: string;

  // Bottom section
  phone_number: string;
  house_address: string;

  // Declaration check
  declaration_agreed: boolean;
  digital_signature: string;
  declaration_date: string | null;
}

export interface PreOfferDocument {
  id: string;
  url: string | null;
  type: string;
  status:
    | "awaiting_upload"
    | "pending_review"
    | "approved"
    | "rejected"
    | "missing";
  updatedAt?: string;
  displayName: string;
}

export interface SavePreOfferDocsRequest {
  candidateId: string;
  requisitionId: string;
  requestedDocs: PreOfferDocument[];
}

export interface FetchPreOfferDocsResponse {
  success: boolean;
  message: string;
  data: PreOfferDocument[];
}
