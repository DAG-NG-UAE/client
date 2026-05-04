const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

// Allows an optional leading + then digits only, 8–15 digits (ITU E.164 compliant)
const PHONE_REGEX = /^\+?\d{8,15}$/;

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.trim());
}

// Strips any character that isn't a digit or a leading +
export function sanitizePhone(value: string): string {
  const stripped = value.replace(/[^\d+]/g, "");
  // Keep + only if it's the first character
  const plus = stripped.startsWith("+") ? "+" : "";
  return plus + stripped.replace(/\+/g, "");
}

export function isValidCvFile(file: File): boolean {
  return file.type === "application/pdf";
}
