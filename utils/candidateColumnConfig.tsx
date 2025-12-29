import React from "react";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import { getFirstAndLastInitials } from "./transform";
import { getStatusChipProps } from "./statusColorMapping";
import { CandidateProfile } from "@/interface/candidate";
import { TableColumn } from "@/interface/table";

// Define common render functions to be reused
const renderCandidateName = (candidate: Partial<CandidateProfile>) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Avatar sx={{ bgcolor: "primary.main", fontSize: "15px" }}>
        {candidate.candidate_name
          ? getFirstAndLastInitials(candidate.candidate_name)
          : "N/A"}
      </Avatar>
      <Typography variant="body2" fontWeight={500}>
        {candidate.candidate_name || "---"}
      </Typography>
    </Box>
  );
};

const renderContact = (candidate: Partial<CandidateProfile>) => (
  <Box>
    <Typography variant="body2">{candidate.email || "---"}</Typography>
    <Typography variant="caption" color="text.secondary">
      {candidate.mobile_number || "---"}
    </Typography>
  </Box>
);

const renderStatus = (candidate: Partial<CandidateProfile>) => {
  return candidate.current_status ? (
    <Chip 
        {...getStatusChipProps(candidate.current_status)} 
        size="small" 
        sx={{ borderRadius: '6px', fontWeight: 500, ...(getStatusChipProps(candidate.current_status).sx || {}) }}
    />
  ) : (
    "---"
  );
};

const renderDate = (dateString?: string | null) =>
  dateString ? new Date(dateString).toLocaleDateString() : "---";

// Main configuration object
export const columnConfig: {
  [key: string]: TableColumn<Partial<CandidateProfile>>[];
} = {
  all: [
    { key: "candidate_name", label: "Candidate Name", render: renderCandidateName },
    { key: "contact", label: "Contact", render: renderContact },
    { key: "role_applied_for", label: "Position" },
    { key: "submitted_date", label: "Applied", render: (c) => renderDate(c.submitted_date) },
    { key: "source", label: "Source" },
    { key: "current_status", label: "Status", render: renderStatus },
  ],
  applied: [
    { key: "candidate_name", label: "Candidate Name", render: renderCandidateName },
    { key: "contact", label: "Contact", render: renderContact },
    { key: "role_applied_for", label: "Position" },
    { key: "submitted_date", label: "Applied", render: (c) => renderDate(c.submitted_date) },
    { key: "source", label: "Source" },
    { key: "current_status", label: "Status", render: renderStatus },
  ],
  shortlisted: [
    { key: "candidate_name", label: "Candidate Name", render: renderCandidateName },
    { key: "contact", label: "Contact", render: renderContact },
    { key: "role_applied_for", label: "Position" },
    { key: "shortlisted_date", label: "Shortlisted Date", render: (c) => renderDate(c.shortlisted_date) },
    { key: "current_status", label: "Status", render: renderStatus },
  ],
  interview_scheduled: [
    { key: "candidate_name", label: "Candidate Name", render: renderCandidateName },
    { key: "contact", label: "Contact", render: renderContact },
    { key: "role_applied_for", label: "Position" },
    { key: "interview_date", label: "Interview Date", render: (c) => renderDate(c.interview_date) },
    { key: "current_status", label: "Status", render: renderStatus },
  ],
  pending_feedback: [
      { key: "candidate_name", label: "Candidate Name", render: renderCandidateName },
      { key: "contact", label: "Contact", render: renderContact },
      { key: "role_applied_for", label: "Position" },
      { key: "interview_date", label: "Interview Date", render: (c) => renderDate(c.interview_date) },
      { key: "current_status", label: "Status", render: renderStatus },
  ],
  interviewed: [
    { key: "candidate_name", label: "Candidate Name", render: renderCandidateName },
    { key: "contact", label: "Contact", render: renderContact },
    { key: "role_applied_for", label: "Position" },
    { key: "interview_date", label: "Interview Date", render: (c) => renderDate(c.interview_date) },
    { key: "current_status", label: "Status", render: renderStatus },
  ],
  approved_for_offer: [
    { key: "candidate_name", label: "Candidate Name", render: renderCandidateName },
    { key: "contact", label: "Contact", render: renderContact },
    { key: "role_applied_for", label: "Position" },
    { key: "current_status", label: "Status", render: renderStatus },
  ],
  "offer-accepted": [
    { key: "candidate_name", label: "Candidate Name", render: renderCandidateName },
    { key: "contact", label: "Contact", render: renderContact },
    { key: "role_applied_for", label: "Position" },
    { key: "joined_date", label: "Joining Date", render: (c) => renderDate(c.joined_date) },
    { key: "current_status", label: "Status", render: renderStatus },
  ],
  "offer-rejected": [
    { key: "candidate_name", label: "Candidate Name", render: renderCandidateName },
    { key: "contact", label: "Contact", render: renderContact },
    { key: "role_applied_for", label: "Position" },
    { key: "rejected_date", label: "Rejection Date", render: (c) => renderDate(c.rejected_date) },
    { key: "rejection_reason", label: "Reason" },
    { key: "current_status", label: "Status", render: renderStatus },
  ],
  "offer-withdrawn": [
    { key: "candidate_name", label: "Candidate Name", render: renderCandidateName },
    { key: "contact", label: "Contact", render: renderContact },
    { key: "role_applied_for", label: "Position" },
    { key: "rejected_date", label: "Withdrawn Date", render: (c) => renderDate(c.rejected_date) },
    { key: "current_status", label: "Status", render: renderStatus },
  ],
  // Default fallback
  default: [
    { key: "candidate_name", label: "Candidate Name", render: renderCandidateName },
    { key: "contact", label: "Contact", render: renderContact },
    { key: "role_applied_for", label: "Position" },
    { key: "current_status", label: "Status", render: renderStatus },
  ],
};

export const getColumnsForStatus = (
  status: string | undefined
): TableColumn<Partial<CandidateProfile>>[] => {
  if (!status) return columnConfig.default;
  return columnConfig[status] || columnConfig.default;
};
