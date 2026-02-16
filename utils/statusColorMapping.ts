import { ChipProps } from "@mui/material";

/**
 * Interface for the return type of getStatusChipProps
 * Ensuring compatibility with Material UI Chip component
 */
interface StatusChipConfig extends Partial<ChipProps> {
  label: string;
}

const statusConfig: Record<string, StatusChipConfig> = {
  // Main Requisition / Generic Statuses
  open: {
    label: "Open",
    color: "success",
    variant: "outlined",
  },
  "in review": {
    label: "In Review",
    color: "warning",
    variant: "outlined",
  },
  closed: {
    label: "Closed",
    color: "success",
    variant: "outlined",
  },
  approved: {
    label: "Approved",
    color: "success",
    variant: "outlined",
  },
  pending: {
    label: "Pending",
    color: "error",
    variant: "outlined",
  },
  on_hold: {
    label: "On Hold",
    color: "error",
    variant: "outlined",
  },
  progress: {
    label: "In Progress",
    color: "primary",
    variant: "outlined",
  },

  // Candidate Specific Statuses (Premium Palette)
  applied: {
    label: "Applied",
    sx: { bgcolor: "#dbeafe", color: "#1e3a8a" }, // Darker blue for text
    variant: "filled",
  },
  shortlisted: {
    label: "Shortlisted",
    sx: { bgcolor: "#fef9c2", color: "#854d0e" }, // Amber 800
    variant: "filled",
  },
  interview_scheduled: {
    label: "Interview Scheduled",
    sx: { bgcolor: "#fef9c2", color: "#854d0e" },
    variant: "filled",
  },
  "interview-scheduled": {
    // Handling hyphenated version from constants
    label: "Interview Scheduled",
    sx: { bgcolor: "#fef9c2", color: "#854d0e" },
    variant: "filled",
  },
  interview: {
    label: "Interview",
    sx: { bgcolor: "#f3e8ff", color: "#6b21a8" },
    variant: "filled",
  },
  interviewed: {
    label: "Interviewed",
    sx: { bgcolor: "#f3e8ff", color: "#6b21a8" },
    variant: "filled",
  },
  pending_feedback: {
    label: "Pending Feedback",
    sx: { bgcolor: "#ffe2e2", color: "#991b1b" }, // Red 800
    variant: "filled",
  },
  "pending-feedback": {
    label: "Pending Feedback",
    sx: { bgcolor: "#ffe2e2", color: "#991b1b" },
    variant: "filled",
  },

  // Offer Workflow
  approved_for_offer: {
    label: "Approved for Offer",
    sx: { bgcolor: "#FEF3C7", color: "#92400e" }, // Amber 800
    variant: "filled",
  },
  pre_offer: {
    label: "Pre-Offer",
    sx: { bgcolor: "#e0f2f1", color: "#00695c" }, // Teal 800
    variant: "filled",
  },
  internal_salary_proposal: {
    label: "Internal Salary Proposal",
    sx: { bgcolor: "#e8eaf6", color: "#283593" }, // Indigo 800
    variant: "filled",
  },
  offer: {
    label: "Offer",
    sx: { bgcolor: "#dbfce7", color: "#166534" }, // Green 800
    variant: "filled",
  },
  offer_extended: {
    label: "Offer Extended",
    sx: { bgcolor: "#f0fdf4", color: "#15803d" }, // Green 700/800
    variant: "filled",
  },
  accepted: {
    label: "Accepted",
    sx: { bgcolor: "#dbfce7", color: "#166534" },
    variant: "filled",
  },
  "offer-accepted": {
    label: "Offer Accepted",
    sx: { bgcolor: "#dbfce7", color: "#166534" },
    variant: "filled",
  },
  revision_requested: {
    label: "Revision Requested",
    sx: { bgcolor: "#fff7ed", color: "#9a3412" }, // Orange 800
    variant: "filled",
  },
  rejected: {
    label: "Rejected",
    sx: { bgcolor: "#fef2f2", color: "#991b1b" }, // Red 800
    variant: "filled",
  },
  offer_rejected: {
    label: "Offer Rejected",
    sx: { bgcolor: "#fff1f2", color: "#be123c" }, // Rose 700
    variant: "filled",
  },
  "offer-rejected": {
    label: "Offer Rejected",
    sx: { bgcolor: "#fff1f2", color: "#be123c" },
    variant: "filled",
  },
  "offer-withdrawn": {
    label: "Offer Withdrawn",
    sx: { bgcolor: "#f5f5f5", color: "#404040" },
    variant: "filled",
  },
  hired: {
    label: "Hired",
    sx: { bgcolor: "#ecfdf5", color: "#065f46" }, // Emerald 800
    variant: "filled",
  },

  // Publication Statuses
  published: {
    label: "Yes",
    color: "success",
    variant: "outlined",
  },
  not_published: {
    label: "No",
    color: "error",
    variant: "outlined",
  },
  no_publication: {
    label: "N/A",
    color: "default",
    variant: "outlined",
  },
};

/**
 * Returns the appropriate props for a Material UI Chip component based on the status string.
 */
export const getStatusChipProps = (
  status: string | undefined,
): StatusChipConfig => {
  if (!status) {
    return {
      label: "Unknown",
      color: "default",
      variant: "outlined",
    };
  }

  const normalizedStatus = status.toLowerCase().trim().replace(/\s+/g, "_");

  // Try exact match first
  if (statusConfig[status.toLowerCase()]) {
    return statusConfig[status.toLowerCase()];
  }

  // Try normalized match (spaces to underscores)
  if (statusConfig[normalizedStatus]) {
    return statusConfig[normalizedStatus];
  }

  // Fallback for status like "offer-accepted" if not already matched
  const hyphenatedMatch = status.toLowerCase().replace(/_/g, "-");
  if (statusConfig[hyphenatedMatch]) {
    return statusConfig[hyphenatedMatch];
  }

  // Final default fallback
  return {
    label: status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    color: "default",
    variant: "outlined",
  };
};
