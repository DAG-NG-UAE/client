"use client";

import React, { useState, useMemo, useEffect, memo } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stack,
  Divider,
  Paper,
  IconButton,
  CircularProgress,
  ListItemText
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchRequisitionById } from "@/redux/slices/requisition";
import RequisitionHeader from "@/components/requisition/RequisitionHeader";
import { apply } from "@/api/candidate";
import { enqueueSnackbar } from "notistack";

// ---------------------------------------------------------------------------
// Reusable sub-components (local)
// ---------------------------------------------------------------------------

interface FormInputProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FormInput: React.FC<FormInputProps> = memo(
  ({ label, required = false, placeholder, type = "text", multiline = false, rows, value = "", disabled = false, onChange }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
        {label}{" "}
        {required && (
          <Box component="span" sx={{ color: "#d32f2f" }}>
            *
          </Box>
        )}
      </Typography>
      <TextField
        fullWidth
        placeholder={placeholder}
        required={required}
        type={type}
        multiline={multiline}
        rows={rows}
        variant="outlined"
        size="medium"
        value={value}
        disabled={disabled}
        onChange={onChange}
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      />
    </Box>
  )
);

const SectionTitle: React.FC<{ title: string }> = memo(({ title }) => (
  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
    {title}
  </Typography>
));

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AddCandidatePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? decodeURIComponent(params.id as string).replace(/ /g, "_") : "";

  const { selectedRequisition, loading } = useSelector(
    (state: RootState) => state.requisitions
  );

  useEffect(() => {
    if (id) fetchRequisitionById(id);
  }, [id]);

  // Auto-populate location from the requisition when it loads
  useEffect(() => {
    if (selectedRequisition?.locations) {
      setLocation(selectedRequisition.locations);
    }
  }, [selectedRequisition?.locations]);

  console.log(`the selected requisition is ${JSON.stringify(selectedRequisition)}`)

  // Form state
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [availability, setAvailability] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");
  const [otherSource, setOtherSource] = useState("");
  const [stage, setStage] = useState("");

  // File handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setCvFile(files && files.length > 0 ? files[0] : null);
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDragLeave = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) setCvFile(e.dataTransfer.files[0]);
  };

  const isFormValid = useMemo(
    () =>
      fullName !== "" &&
      emailAddress !== "" &&
      phoneNumber !== "" &&
      availability !== "" &&
      experience !== "" &&
      location !== "" &&
      expectedSalary !== "" &&
      cvFile !== null &&
      source !== "" &&
      (source === "Other" ? otherSource !== "" : true) &&
      stage !== "",
    [fullName, emailAddress, phoneNumber, availability, experience, location, expectedSalary, cvFile, source, otherSource]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      enqueueSnackbar("Please fill all required fields and accept the privacy notice.", { variant: "error" });
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("emailAddress", emailAddress);
    formData.append("phoneNumber", phoneNumber);
    formData.append("availability", availability);
    formData.append("experience", experience);
    formData.append("expectedSalary", expectedSalary);
    formData.append("coverLetter", coverLetter);
    formData.append("privacyConsent", "true");
    formData.append("source", source === "Other" ? otherSource : source);
    if (selectedRequisition?.position) formData.append("position", selectedRequisition.position);
    if (selectedRequisition?.department) formData.append("department", selectedRequisition.department);
    if (cvFile) formData.append("cvFile", cvFile, cvFile.name);
    formData.append("requisitionPositionSlot", location);
    formData.append("isSlug", "false");
    formData.append("old_status", "null");
    formData.append("new_status", stage);

    try {
      const requisitionId = selectedRequisition?.requisition_id!
      await apply(formData, requisitionId);
      enqueueSnackbar("Candidate added successfully!", { variant: "success" });
      

      router.back();
    } catch (error) {
      console.error("Error submitting form:", error);
      enqueueSnackbar("There was an error submitting the form.", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !selectedRequisition) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "background.default" }}>
      <Container maxWidth="md">
        <RequisitionHeader
          title={`Add Candidate — ${selectedRequisition?.position || "Requisition"}`}
          requisitionId={id}
          isEditMode
        />

        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <Box mb={4}>
              <SectionTitle title="Personal Information" />
              <FormInput label="Full Name" required placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <FormInput label="Email Address" required placeholder="john.doe@email.com" type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
              <FormInput label="Phone Number" required placeholder="(555) 123-4567" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <FormInput label="Position Applied For" required disabled value={selectedRequisition?.position || ""} />
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Application Details */}
            <Box mb={4}>
              <SectionTitle title="Application Details" />

              {/* CV Upload */}
              <Box mb={3}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                  CV/Resume <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
                </Typography>
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: "action.hover",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("cv-upload-input")?.click()}
                >
                  <input
                    type="file"
                    id="cv-upload-input"
                    hidden
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                  />
                  {cvFile ? (
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                      <Typography variant="body1">{cvFile.name}</Typography>
                      <Button size="small" onClick={(e) => { e.stopPropagation(); setCvFile(null); }}>
                        Remove
                      </Button>
                    </Stack>
                  ) : (
                    <>
                      <CloudUploadIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Click to upload or drag and drop
                      </Typography>
                    </>
                  )}
                  <Typography variant="caption" color="text.disabled" display="block" mt={0.5}>
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </Typography>
                </Box>
              </Box>

              <FormInput label="Expected Salary" required placeholder="e.g., N120,000 - N140,000" value={expectedSalary} onChange={(e) => setExpectedSalary(e.target.value)} />

              {/* Experience */}
              <Box mb={3}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                  Experience <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
                </Typography>
                <Select
                  fullWidth
                  displayEmpty
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="" disabled>Select experience</MenuItem>
                  <MenuItem value="0-6months">0-6 Months</MenuItem>
                  <MenuItem value="1-3years">1-3 years</MenuItem>
                  <MenuItem value="4-8years">4-8 years</MenuItem>
                  <MenuItem value="10+years">10+ years</MenuItem>
                  <MenuItem value="20+years">20+ years</MenuItem>
                </Select>
              </Box>

              {/* Availability */}
              <Box mb={3}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                  Availability to Join <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
                </Typography>
                <Select
                  fullWidth
                  displayEmpty
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="" disabled>Select availability</MenuItem>
                  <MenuItem value="immediate">Immediately</MenuItem>
                  <MenuItem value="2weeks">2 Weeks Notice</MenuItem>
                  <MenuItem value="1month">1 Month Notice</MenuItem>
                  <MenuItem value="3month">3 Month Notice</MenuItem>
                </Select>
              </Box>

              {/* Location */}
              <FormInput label="Location" required disabled value={selectedRequisition?.locations || ""} />

              {/* Source */}
              <Box mb={3}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                  How did you get the candidate? <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
                </Typography>
                <Select
                  fullWidth
                  displayEmpty
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="" disabled>Select Source</MenuItem>
                  <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                  <MenuItem value="Referral">Referral </MenuItem>
                  <MenuItem value="Direct Application">Direct Application</MenuItem>
                  <MenuItem value="Agency">Agency</MenuItem>
                  <MenuItem value="Social Media">Social Media</MenuItem>
                  <MenuItem value="Headhunted">Headhunted</MenuItem>
                  <MenuItem value="Career Fair">Career Fair</MenuItem>
                  <MenuItem value="Job board">Job board</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </Box>

              {source === "Other" && (
                <FormInput
                  label="Please specify"
                  required
                  placeholder="e.g., Friend, Google Search"
                  value={otherSource}
                  onChange={(e) => setOtherSource(e.target.value)}
                />
              )}

              <FormInput
                label="Cover Letter (Optional)"
                placeholder="Tell us why this candidate is being added..."
                multiline
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Recruitment Stage */}
            <Box mb={4}>
              <SectionTitle title="Recruitment Stage" />
              <Typography variant="body2" color="text.secondary" mb={2}>
                Select the stage this candidate is entering. This determines where they will appear in the pipeline.
              </Typography>
              <Select
                fullWidth
                displayEmpty
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                sx={{ borderRadius: 2 }}
                renderValue={(selected) => {
                  if (!selected) return <Typography color="text.disabled">Select a stage</Typography>;
                  const labels: Record<string, string> = {
                    shortlisted: "Shortlisted",
                    interviewed: "Interviewed",
                    pre_offer: "Pre-Offer",
                    internal_salary_proposal: "Internal Salary Proposal",
                    approved_for_offer: "Approved for Offer",
                  };
                  return labels[selected] ?? selected;
                }}
              >
                <MenuItem value="" disabled>Select a stage</MenuItem>
                <MenuItem value="shortlisted">
                  <ListItemText
                    primary="Shortlisted"
                    secondary="Candidate has been reviewed and selected to move forward in the process."
                    slotProps={{ secondary: { sx: { fontSize: "0.75rem" } } }}
                  />
                </MenuItem>
                <MenuItem value="interviewed">
                  <ListItemText
                    primary="Interviewed"
                    secondary="Candidate has already completed one or more interview rounds."
                    slotProps={{ secondary: { sx: { fontSize: "0.75rem" } } }}
                  />
                </MenuItem>
                <MenuItem value="pre_offer">
                  <ListItemText
                    primary="Pre-Offer"
                    secondary="Candidate is in pre-offer discussion — terms and salary are being explored informally."
                    slotProps={{ secondary: { sx: { fontSize: "0.75rem" } } }}
                  />
                </MenuItem>
                <MenuItem value="internal_salary_proposal">
                  <ListItemText
                    primary="Internal Salary Proposal"
                    secondary="An internal salary package is being drafted and routed for internal approval."
                    slotProps={{ secondary: { sx: { fontSize: "0.75rem" } } }}
                  />
                </MenuItem>
                <MenuItem value="approved_for_offer">
                  <ListItemText
                    primary="Approved for Offer"
                    secondary="Candidate has been approved internally — a formal offer letter can now be extended."
                    slotProps={{ secondary: { sx: { fontSize: "0.75rem" } } }}
                  />
                </MenuItem>
              </Select>
            </Box>

            <Divider sx={{ my: 4 }} />

            

            {/* Actions */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Button
                variant="text"
                onClick={() => router.back()}
                sx={{ color: "text.secondary", fontWeight: 600 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="large"
                type="submit"
                disabled={!isFormValid || submitting}
                sx={{ px: 4, py: 1.2, borderRadius: 2 }}
              >
                {submitting ? <CircularProgress size={20} color="inherit" /> : "Add Candidate"}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
