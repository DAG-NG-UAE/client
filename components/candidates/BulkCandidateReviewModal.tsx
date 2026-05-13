"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import BlockIcon from "@mui/icons-material/Block";
import CloseIcon from "@mui/icons-material/Close";
import { apply } from "@/api/candidate";
import { enqueueSnackbar } from "notistack";
import { isValidEmail, isValidPhone, sanitizePhone } from "@/utils/validators";
import { Requisition } from "@/interface/requisition";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CandidateSlide {
  filename: string;
  parsedSuccess: boolean;
  originalFile: File;
  fullName: string;
  emailAddress: string;
  emailError: string;
  phoneNumber: string;
  phoneError: string;
  experience: string;
  availability: string;
  source: string;
  otherSource: string;
  stage: string;
  coverLetter: string;
  skills: string[];
  submitting: boolean;
  submitted: boolean;
  skipped: boolean;
  submitError: string;
}

interface BulkCandidateReviewModalProps {
  open: boolean;
  onClose: () => void;
  slides: CandidateSlide[];
  onSlidesChange: (slides: CandidateSlide[]) => void;
  requisition: Partial<Requisition> | null;
  requisitionId: string;
  onAllSubmitted: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isSlideReady(s: CandidateSlide): boolean {
  if (s.submitted || s.skipped) return true;
  return (
    s.fullName !== "" &&
    s.emailAddress !== "" &&
    isValidEmail(s.emailAddress) &&
    !s.emailError &&
    s.phoneNumber !== "" &&
    isValidPhone(s.phoneNumber) &&
    !s.phoneError &&
    s.experience !== "" &&
    s.availability !== "" &&
    s.source !== "" &&
    (s.source === "Other" ? s.otherSource !== "" : true) &&
    s.stage !== ""
  );
}

function dotColor(s: CandidateSlide, isCurrent: boolean): string {
  if (s.submitted) return "success.main";
  if (s.submitError) return "error.main";
  if (s.skipped) return "text.disabled";
  if (isCurrent) return "primary.main";
  return "divider";
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

export default function BulkCandidateReviewModal({
  open,
  onClose,
  slides,
  onSlidesChange,
  requisition,
  requisitionId,
  onAllSubmitted,
}: BulkCandidateReviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submittingAll, setSubmittingAll] = useState(false);

  const updateSlide = (index: number, patch: Partial<CandidateSlide>) => {
    onSlidesChange(slides.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const toggleSkip = (index: number) => {
    const s = slides[index];
    // Can't skip an already-submitted slide
    if (s.submitted) return;
    updateSlide(index, { skipped: !s.skipped, submitError: "" });
  };

  const current = slides[currentIndex];

  const allReady = slides.length > 0 && slides.every(isSlideReady);
  const allDone = slides.length > 0 && slides.every((s) => s.submitted || s.skipped);
  const toSubmit = slides.filter((s) => !s.submitted && !s.skipped);

  const handleSubmitAll = async () => {
    setSubmittingAll(true);

    // Take a snapshot so loop indices stay stable even as we call onSlidesChange
    const snapshot = [...slides];
    let successCount = 0;

    for (let i = 0; i < snapshot.length; i++) {
      const s = snapshot[i];
      if (s.submitted || s.skipped) { successCount++; continue; }

      onSlidesChange(
        snapshot.map((sl, idx) =>
          idx === i ? { ...sl, submitting: true, submitError: "" } : sl
        )
      );

      const formData = new FormData();
      formData.append("fullName", s.fullName);
      formData.append("emailAddress", s.emailAddress);
      formData.append("phoneNumber", s.phoneNumber);
      formData.append("availability", s.availability);
      formData.append("experience", s.experience);
      formData.append("coverLetter", s.coverLetter);
      formData.append("privacyConsent", "true");
      formData.append("source", s.source === "Other" ? s.otherSource : s.source);
      if (requisition?.position) formData.append("position", requisition.position);
      if (requisition?.department) formData.append("department", requisition.department);
      formData.append("cvFile", s.originalFile, s.originalFile.name);
      formData.append("requisitionPositionSlot", requisition?.locations ?? "");
      formData.append("isSlug", "false");
      formData.append("old_status", "null");
      formData.append("new_status", s.stage);

      try {
        await apply(formData, requisition?.requisition_id ?? requisitionId);
        snapshot[i] = { ...snapshot[i], submitting: false, submitted: true };
        onSlidesChange([...snapshot]);
        successCount++;
      } catch {
        snapshot[i] = {
          ...snapshot[i],
          submitting: false,
          submitError: "Failed to submit — check details and retry.",
        };
        onSlidesChange([...snapshot]);
      }
    }

    setSubmittingAll(false);

    const skippedCount = snapshot.filter((s) => s.skipped).length;
    const failedCount = snapshot.filter((s) => s.submitError).length;

    if (failedCount === 0) {
      const msg =
        skippedCount > 0
          ? `${successCount - skippedCount} candidate(s) added, ${skippedCount} skipped.`
          : `${successCount} candidate(s) added successfully!`;
      enqueueSnackbar(msg, { variant: "success" });
      onAllSubmitted();
    } else {
      enqueueSnackbar(
        `${successCount} of ${toSubmit.length + successCount} submitted. Review errors on remaining slides.`,
        { variant: "warning" }
      );
    }
  };

  if (!current) return null;

  const isCurrentLocked = current.submitted || current.skipped;

  return (
    <Dialog
      open={open}
      onClose={submittingAll ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      {/* ── Title ── */}
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box flex={1} minWidth={0}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Candidate {currentIndex + 1} of {slides.length}
            </Typography>
            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
              <Typography variant="h6" fontWeight={700} noWrap sx={{ maxWidth: 400 }}>
                {current.fullName || "(Name not parsed)"}
              </Typography>
              {current.submitted && (
                <Chip icon={<CheckCircleOutlineIcon />} label="Submitted" color="success" size="small" variant="outlined" />
              )}
              {current.skipped && !current.submitted && (
                <Chip icon={<BlockIcon />} label="Skipped" size="small" variant="outlined" sx={{ color: "text.secondary", borderColor: "divider" }} />
              )}
              {current.submitError && (
                <Chip icon={<WarningAmberIcon />} label="Error" color="error" size="small" variant="outlined" />
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {current.filename}
            </Typography>
          </Box>

          <IconButton size="small" onClick={onClose} disabled={submittingAll} sx={{ ml: 1, mt: 0.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Progress dots */}
        <Stack direction="row" spacing={0.5} mt={1.5}>
          {slides.map((s, i) => (
            <Tooltip key={i} title={s.filename} arrow>
              <Box
                onClick={() => setCurrentIndex(i)}
                sx={{
                  width: 8, height: 8, borderRadius: "50%", cursor: "pointer",
                  bgcolor: dotColor(s, i === currentIndex),
                  transition: "background-color 0.2s",
                  flexShrink: 0,
                }}
              />
            </Tooltip>
          ))}
        </Stack>

        {/* Warnings */}
        {!current.parsedSuccess && !current.skipped && (
          <Box sx={{ mt: 1.5, px: 2, py: 1, bgcolor: "warning.50", borderRadius: 1, border: "1px solid", borderColor: "warning.200" }}>
            <Typography variant="caption" color="warning.dark">
              This CV could not be parsed — fill in the details manually, or skip this candidate.
            </Typography>
          </Box>
        )}
      </DialogTitle>

      <Divider />

      {/* ── Body ── */}
      <Fade in key={currentIndex}>
        <DialogContent sx={{ pt: 2 }}>

          {/* Skipped state */}
          {current.skipped && !current.submitted ? (
            <Box
              sx={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", py: 6, gap: 2, textAlign: "center",
              }}
            >
              <BlockIcon sx={{ fontSize: 48, color: "text.disabled" }} />
              <Typography variant="body1" color="text.secondary">
                This candidate will be skipped and not added to the system.
              </Typography>
              <Button variant="outlined" size="small" onClick={() => toggleSkip(currentIndex)}>
                Undo Skip
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 3 }}>
              {/* Left: parsed / pre-filled */}
              <Box sx={{ flex: "0 0 42%", minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={2} textTransform="uppercase" letterSpacing={0.5} fontSize="0.7rem">
                  Parsed from CV
                </Typography>

                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                    Full Name *
                  </Typography>
                  <TextField
                    fullWidth size="small"
                    value={current.fullName}
                    disabled={isCurrentLocked}
                    onChange={(e) => updateSlide(currentIndex, { fullName: e.target.value })}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                    Email *
                  </Typography>
                  <TextField
                    fullWidth size="small" type="email"
                    value={current.emailAddress}
                    error={!!current.emailError}
                    helperText={current.emailError}
                    disabled={isCurrentLocked}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateSlide(currentIndex, {
                        emailAddress: val,
                        emailError: val && !isValidEmail(val) ? "Invalid email" : "",
                      });
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                    Phone *
                  </Typography>
                  <TextField
                    fullWidth size="small" type="tel"
                    value={current.phoneNumber}
                    error={!!current.phoneError}
                    helperText={current.phoneError}
                    disabled={isCurrentLocked}
                    onChange={(e) => {
                      const val = sanitizePhone(e.target.value);
                      updateSlide(currentIndex, {
                        phoneNumber: val,
                        phoneError: val && !isValidPhone(val) ? "8–15 digits, leading + allowed" : "",
                      });
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                    Experience *
                  </Typography>
                  <Select
                    fullWidth size="small" displayEmpty
                    value={current.experience}
                    disabled={isCurrentLocked}
                    onChange={(e) => updateSlide(currentIndex, { experience: e.target.value })}
                    sx={{ borderRadius: 1.5 }}
                  >
                    <MenuItem value="" disabled>Select experience</MenuItem>
                    <MenuItem value="0-6months">0–6 Months</MenuItem>
                    <MenuItem value="1-3years">1–3 years</MenuItem>
                    <MenuItem value="4-8years">4–8 years</MenuItem>
                    <MenuItem value="10+years">10+ years</MenuItem>
                    <MenuItem value="20+years">20+ years</MenuItem>
                  </Select>
                </Box>

                {current.skills.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.75}>
                      Skills
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {current.skills.map((skill) => (
                        <Chip key={skill} label={skill} size="small" sx={{ fontSize: "0.7rem" }} />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Vertical divider */}
              <Divider orientation="vertical" flexItem />

              {/* Right: user fills these */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={2} textTransform="uppercase" letterSpacing={0.5} fontSize="0.7rem">
                  Required Details
                </Typography>

                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                    Availability to Join *
                  </Typography>
                  <Select
                    fullWidth size="small" displayEmpty
                    value={current.availability}
                    disabled={isCurrentLocked}
                    onChange={(e) => updateSlide(currentIndex, { availability: e.target.value })}
                    sx={{ borderRadius: 1.5 }}
                  >
                    <MenuItem value="" disabled>Select availability</MenuItem>
                    <MenuItem value="immediate">Immediately</MenuItem>
                    <MenuItem value="2weeks">2 Weeks Notice</MenuItem>
                    <MenuItem value="1month">1 Month Notice</MenuItem>
                    <MenuItem value="3month">3 Month Notice</MenuItem>
                  </Select>
                </Box>

                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                    Source *
                  </Typography>
                  <Select
                    fullWidth size="small" displayEmpty
                    value={current.source}
                    disabled={isCurrentLocked}
                    onChange={(e) => updateSlide(currentIndex, { source: e.target.value, otherSource: "" })}
                    sx={{ borderRadius: 1.5 }}
                  >
                    <MenuItem value="" disabled>How did you get this candidate?</MenuItem>
                    <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                    <MenuItem value="Referral">Referral</MenuItem>
                    <MenuItem value="Direct Application">Direct Application</MenuItem>
                    <MenuItem value="Agency">Agency</MenuItem>
                    <MenuItem value="Social Media">Social Media</MenuItem>
                    <MenuItem value="Headhunted">Headhunted</MenuItem>
                    <MenuItem value="Career Fair">Career Fair</MenuItem>
                    <MenuItem value="Job board">Job board</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </Box>

                {current.source === "Other" && (
                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                      Please specify *
                    </Typography>
                    <TextField
                      fullWidth size="small"
                      placeholder="e.g., Friend, Google Search"
                      value={current.otherSource}
                      disabled={isCurrentLocked}
                      onChange={(e) => updateSlide(currentIndex, { otherSource: e.target.value })}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                    />
                  </Box>
                )}

                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                    Recruitment Stage *
                  </Typography>
                  <Select
                    fullWidth size="small" displayEmpty
                    value={current.stage}
                    disabled={isCurrentLocked}
                    onChange={(e) => updateSlide(currentIndex, { stage: e.target.value })}
                    sx={{ borderRadius: 1.5 }}
                    renderValue={(val) => {
                      if (!val) return <Typography color="text.disabled" variant="body2">Select a stage</Typography>;
                      const labels: Record<string, string> = {
                        applied: "Applied", shortlisted: "Shortlisted", interviewed: "Interviewed",
                        pre_offer: "Pre-Offer", internal_salary_proposal: "Internal Salary Proposal",
                        approved_for_offer: "Approved for Offer",
                      };
                      return labels[val] ?? val;
                    }}
                  >
                    <MenuItem value="" disabled>Select a stage</MenuItem>
                    <MenuItem value="applied">Applied</MenuItem>
                    <MenuItem value="shortlisted">Shortlisted</MenuItem>
                    <MenuItem value="interviewed">Interviewed</MenuItem>
                    <MenuItem value="pre_offer">Pre-Offer</MenuItem>
                    <MenuItem value="internal_salary_proposal">Internal Salary Proposal</MenuItem>
                    <MenuItem value="approved_for_offer">Approved for Offer</MenuItem>
                  </Select>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                    Cover Letter (Optional)
                  </Typography>
                  <TextField
                    fullWidth size="small" multiline rows={3}
                    placeholder="Tell us why this candidate is being added..."
                    value={current.coverLetter}
                    disabled={isCurrentLocked}
                    onChange={(e) => updateSlide(currentIndex, { coverLetter: e.target.value })}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                  />
                </Box>

                {current.submitError && (
                  <Box sx={{ mt: 2, px: 2, py: 1, bgcolor: "error.50", borderRadius: 1, border: "1px solid", borderColor: "error.200" }}>
                    <Typography variant="caption" color="error.main">{current.submitError}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Fade>

      <Divider />

      {/* ── Footer ── */}
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        {/* Prev / Next + Skip */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            size="small"
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={currentIndex === 0 || submittingAll}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40, textAlign: "center" }}>
            {currentIndex + 1} / {slides.length}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setCurrentIndex((i) => i + 1)}
            disabled={currentIndex === slides.length - 1 || submittingAll}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
          </IconButton>

          {!current.submitted && (
            <Button
              size="small"
              color={current.skipped ? "primary" : "inherit"}
              variant={current.skipped ? "outlined" : "text"}
              onClick={() => toggleSkip(currentIndex)}
              disabled={submittingAll}
              sx={{ ml: 1, color: current.skipped ? undefined : "text.secondary" }}
            >
              {current.skipped ? "Undo Skip" : "Skip"}
            </Button>
          )}
        </Stack>

        {/* Cancel + Submit All */}
        <Stack direction="row" spacing={1.5}>
          <Button color="inherit" onClick={onClose} disabled={submittingAll}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!allReady || submittingAll || allDone}
            onClick={handleSubmitAll}
            sx={{ minWidth: 160 }}
          >
            {submittingAll ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} color="inherit" />
                <span>Submitting…</span>
              </Stack>
            ) : allDone ? (
              "All Done"
            ) : (
              `Submit${toSubmit.length > 0 ? ` (${toSubmit.length})` : ""}`
            )}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
