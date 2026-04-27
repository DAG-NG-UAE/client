/**
 * Maps raw Excel labels from the standard company competency profile
 * to normalized field keys. Validation checks that the file contains
 * the expected labels before allowing submission.
 */

// Normalized label → field key
const LABEL_TO_FIELD: Record<string, string> = {
  "name":                                                        "full_name",
  "role applied for":                                            "role_applied_for",
  "location":                                                    "location",
  "cv source":                                                   "cv_source",
  "mobile no":                                                   "mobile_number",
  "email id":                                                    "email",
  "total years experience":                                      "total_experience_years",
  "employment status":                                           "employment_status",
  "current/last place worked":                                   "current_place_of_work",
  "current/last place designation":                              "role_current",
  "current gross salary":                                        "current_gross_salary",
  "current net salary":                                          "current_net_salary",
  "other benefits (if any)":                                     "benefits_received",
  "notice period":                                               "notice_period",
  "educational qualification/professional certification":        "qualification",
  "age":                                                         "age",
  "state of origin":                                             "state_of_origin",
  "spouse occupation (if married)":                              "spouse_occupation",
  "children (number and age)":                                   "children",
  "expected salary range(please mention the minimum expectation": "salary_target_min",
  "open to relocation within nigeria(yes/no)":                   "open_to_relocation",
};

// These labels MUST be present for the file to be considered valid
const REQUIRED_LABELS = [
  "name",
  "email id",
  "mobile no",
  "total years experience",
  "employment status",
  "current/last place worked",
  "open to relocation within nigeria(yes/no)",
];

const normalize = (label: string) => label.trim().toLowerCase();

export interface MappedCompetencyProfile {
  [field: string]: string;
}

/**
 * Checks whether the parsed labels match the expected competency profile structure.
 * Returns null if valid, or an error message string if not.
 */
export function validateCompetencyLabels(labels: string[]): string | null {
  const normalized = labels.map(normalize).filter(Boolean);

  const missing = REQUIRED_LABELS.filter(
    (required) => !normalized.some((label) => label.startsWith(required) || required.startsWith(label) || label === required)
  );

  if (missing.length > 0) {
    return `This does not appear to be the standard company competency profile. Missing fields: ${missing.map((m) => `"${m}"`).join(", ")}.`;
  }

  return null;
}

/**
 * Maps an array of { label, value } pairs to a structured object using known field keys.
 * Unrecognised labels are included under a snake_cased fallback key.
 */
export function mapCompetencyProfile(rows: { label: string; value: string }[]): MappedCompetencyProfile {
  const result: MappedCompetencyProfile = {};

  rows.forEach(({ label, value }) => {
    const key = normalize(label);
    const fieldName = LABEL_TO_FIELD[key] ?? toSnakeCase(label);
    result[fieldName] = value;
  });

  return result;
}

function toSnakeCase(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
