import React from "react";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import { getFirstAndLastInitials } from "./transform";
import { getStatusChipProps } from "./statusColorMapping";
import { CandidateProfile } from "@/interface/candidate";

// Enhanced ColumnDefinition to include an optional renderCell function
export type ColumnDefinition<TData> =
  | {
      id: keyof TData;
      label: string;
      renderCell?: (candidate: Partial<TData>) => React.ReactNode;
    }
  | {
      id: string;
      label: string;
      renderCell: (candidate: Partial<TData>) => React.ReactNode;
    };

// Define common render functions to be reused
const renderCandidateName = (candidate: Partial<CandidateProfile>) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Avatar sx={{ bgcolor: "primary.main", fontSize: "15px" }}>
        {candidate.candidate_name
          ? getFirstAndLastInitials(candidate.candidate_name)
          : "N/A"}
      </Avatar>
      <Typography variant="body2">
        {candidate.candidate_name || "---"}
      </Typography>
    </Box>
  );
};

const renderContact = (candidate: Partial<CandidateProfile>) => (
  <>
    <Typography variant="body2">{candidate.email || "---"}</Typography>
    <Typography variant="body2" color="text.secondary">
      {candidate.mobile_number || "---"}
    </Typography>
  </>
);

const renderStatus = (candidate: Partial<CandidateProfile>) => {
  return candidate.current_status ? (
    <Chip {...getStatusChipProps(candidate.current_status)} size="small" />
  ) : (
    "---"
  );
};

const renderDate = (dateString?: string | null) =>
  dateString ? new Date(dateString).toLocaleDateString() : "---";

// Main configuration object
export const columnConfig: {
  [key: string]: ColumnDefinition<CandidateProfile>[];
} = {
  all: [
{
      id: "candidate_name",
      label: "Candidate Name",
      renderCell: renderCandidateName,
    },
    { id: "contact", label: "Contact", renderCell: renderContact },
    { id: "role_applied_for", label: "Position" },
    {
      id: "submitted_date",
      label: "Applied Date",
      renderCell: (c) => renderDate(c.submitted_date),
    },
    { id: "source", label: "Source" },
    { id: "current_status", label: "Status", renderCell: renderStatus },
  ],
  applied: [
    {
      id: "candidate_name",
      label: "Candidate Name",
      renderCell: renderCandidateName,
    },
    { id: "contact", label: "Contact", renderCell: renderContact },
    { id: "role_applied_for", label: "Position" },
    {
      id: "submitted_date",
      label: "Applied Date",
      renderCell: (c) => renderDate(c.submitted_date),
    },
    { id: "source", label: "Source" },
    { id: "current_status", label: "Status", renderCell: renderStatus },
  ],
  shortlisted: [
    {
      id: "candidate_name",
      label: "Candidate Name",
      renderCell: renderCandidateName,
    },
    { id: "contact", label: "Contact", renderCell: renderContact },
    { id: "role_applied_for", label: "Position" },
    // Assuming a 'shortlisted_date' field will exist on the profile
    {
      id: "shortlisted_date",
      label: "Shortlisted Date",
      renderCell: (c) => renderDate(c.shortlisted_date),
    },
    { id: "current_status", label: "Status", renderCell: renderStatus },
  ],
  'interview-scheduled': [
    {
      id: "candidate_name",
      label: "Candidate Name",
      renderCell: renderCandidateName,
    },
    { id: "contact", label: "Contact", renderCell: renderContact },
    { id: "role_applied_for", label: "Position" },
    // Assuming 'interview_date' will exist
    { id: "interview_date", label: "Interview Date", renderCell: (c) => renderDate(c.interview_date) },
    { id: "current_status", label: "Status", renderCell: renderStatus },
  ],
  'offer-accepted': [
    {
      id: "candidate_name",
      label: "Candidate Name",
      renderCell: renderCandidateName,
    },
    { id: "contact", label: "Contact", renderCell: renderContact },
    { id: "role_applied_for", label: "Position" },
    {
      id: "joined_date",
      label: "Joining Date",
      renderCell: (c) => renderDate(c.joined_date),
    },
    { id: "current_status", label: "Status", renderCell: renderStatus },
  ],
  // A sensible default configuration
  default: [
    {
      id: "candidate_name",
      label: "Candidate Name",
      renderCell: renderCandidateName,
    },
    { id: "contact", label: "Contact", renderCell: renderContact },
    { id: "role_applied_for", label: "Position" },
    { id: "current_status", label: "Status", renderCell: renderStatus },
  ],
};

export const getColumnsForStatus = (
  status: string | undefined
): ColumnDefinition<CandidateProfile>[] => {
  if (!status) return columnConfig.default;
  return columnConfig[status] || columnConfig.default;
};
