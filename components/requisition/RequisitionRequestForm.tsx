
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Autocomplete,
  Chip,
  InputAdornment,
  Grid,
  Switch,
  FormControlLabel
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import dayjs, { Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AppRole } from "@/utils/constants";
import JobDescription from "@/components/requisition/JobDescription";
import { convertToMarkdown } from "@/utils/documentConverter";
import { getLoggedInUserManager } from "@/api/user";
import { searchInterviewers } from "@/api/interview";

interface InterviewerResult {
  id: string;
  displayName: string;
  mail: string;
  jobTitle: string;
}

// --- Mock Data Constants ---

const LOCATIONS_NIGERIA = ["Lagos", "Kano", "Abuja", "Port-Harcourt", "Ibadan", "Sokoto", "Onitsha", "Remote"];
const JOB_REASONS = ["New Headcount", "Replacement"];
const ACCOMMODATIONS = ["Bachelor", "Family"];
const LEAVE_STATUSES = ["30 Days after 1 Year", "Yearly", "After 2 Years"];
const FAMILY_STATUS_TIMINGS = ["Immediate", "After 6 Months", "After 1 Year", "After 2 Years", "NA"];


interface LocationItem {
  id: number;
  location: string;
  headcount: string;
}

interface RequisitionRequestFormProps {
  type: "Local" | "Expat";
  onNext: (formData: any) => void;
}

const RequisitionRequestForm: React.FC<RequisitionRequestFormProps> = ({
  type,
  onNext,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [manager, setManager] = useState<string>("");

  useEffect(() => {
    const fetchManager = async () => {
      if (user?.microsoft_account_id) {
        const manager = await getLoggedInUserManager();
        setManager(manager);
      }
    };
    fetchManager();
  }, []);
  // console.log(manager)

  // --- Form State ---
  // Shared
  const [requestDate, setRequestDate] = useState<Dayjs | null>(dayjs());
  const [nickname, setNickname] = useState("");
  const [department, setDepartment] = useState("");
  const [raisedBy, setRaisedBy] = useState(user?.full_name || "");
  const [requesterDesignation, setRequesterDesignation] = useState(user?.job_title || "");

  // Position
  const [position, setPosition] = useState("");

  // Dates
  const [resumptionDate, setResumptionDate] = useState<Dayjs | null>(null);

  // Manager
  const [reportingManager, setReportingManager] = useState("");
  const [managerInput, setManagerInput] = useState("");
  const [managerOptions, setManagerOptions] = useState<InterviewerResult[]>([]);
  const [isSearchingManager, setIsSearchingManager] = useState(false);
  const [hodEmail, setHodEmail] = useState("isabella.k@bajajnigeria.com");

  // Content
  const [justification, setJustification] = useState("");
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [jobDescriptionContent, setJobDescriptionContent] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  // HOD Approval Logic
  const [requireHodApproval, setRequireHodApproval] = useState(true);

  // -- Locations (Shared for both Local and Expat now) --
  const [locations, setLocations] = useState<LocationItem[]>([
    { id: Date.now(), location: "", headcount: "1" },
  ]);

  // -- Local Specific --
  const [salaryLocal, setSalaryLocal] = useState("");
  const [reasonForHire, setReasonForHire] = useState("New Headcount"); // Defaulted to New Headcount
  const [replacementFor, setReplacementFor] = useState("");

  // -- Expat Specific --
  const [nationality, setNationality] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [salaryCurrency, setSalaryCurrency] = useState("");
  const [salaryExpat, setSalaryExpat] = useState("");
  const [accommodation, setAccommodation] = useState("");
  const [leaveStatus, setLeaveStatus] = useState("");
  const [familyStatus, setFamilyStatus] = useState("");
  const [compProficiency, setCompProficiency] = useState("No");
  const [compProficiencyLevel, setCompProficiencyLevel] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");

  // Location Handlers
  const handleLocationChange = (id: number, field: keyof LocationItem, value: string) => {
    setLocations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddLocation = () => {
    setLocations((prev) => [
      ...prev,
      { id: Date.now(), location: "", headcount: "1" },
    ]);
  };

  const handleRemoveLocation = (id: number) => {
    setLocations((prev) => prev.filter((item) => item.id !== id));
  };

  // Update raisedBy if user loads late
  useEffect(() => {
    if (user?.full_name && !raisedBy) {
      setRaisedBy(user.full_name);
    }
  }, [user, raisedBy]);

  useEffect(() => {
    if (!managerInput || managerInput.length < 2) {
      setManagerOptions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingManager(true);
      try {
        const results = await searchInterviewers(managerInput);
        setManagerOptions(results || []);
      } catch {
        setManagerOptions([]);
      } finally {
        setIsSearchingManager(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [managerInput]);

  useEffect(() => {
    if (user?.role_name) {
      const privilegedRoles = [AppRole.HeadOfHr, AppRole.HrManager, AppRole.Recruiter];
      if (privilegedRoles.includes(user.role_name as AppRole)) {
        setRequireHodApproval(false);
      } else {
        setRequireHodApproval(true);
      }
    }
  }, [user]);

  // Handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setJobDescription(file);

      // Convert document
      setIsConverting(true);
      try {
        const markdown = await convertToMarkdown(file);
        setJobDescriptionContent(markdown);
      } catch (error) {
        console.error("Conversion failed", error);
        // You might want to show a toast/alert here
      } finally {
        setIsConverting(false);
      }
    }
  };


  const formatCurrency = (value: string) => {
    const number = value.replace(/,/g, "").replace(/\D/g, "");
    return number ? Number(number).toLocaleString() : "";
  };

  const handleSubmit = () => {
    // Collect all relevant data based on type
    const commonData = {
      requestDate,
      nickname,
      department,
      raisedBy,
      designation: requesterDesignation,
      position,
      dateOfResumption: resumptionDate,
      reportingManager: reportingManager,
      hodEmail,
      jobDescription: jobDescriptionContent, // Send the markdown content!
      originalFileName: jobDescription?.name,
      justification: reasonForHire, // This seems to be the "Reason" (e.g. Replacement)
      reason: justification, // This seems to be the "Justification text"
      proposedSalaryCurrency: salaryCurrency,
      internalName: nickname,
      requiredHodApproval: requireHodApproval,
      replacementFor: reasonForHire === "Replacement" ? replacementFor : null,
    };

    let specificData = {};

    if (type === "Local") {
      specificData = {
        locations: locations, // Send the array
        proposedSalary: salaryLocal,
        proposedSalaryCurrency: 'Naira',
      };
    } else {
      specificData = {
        locations: locations, // Send the array of locations
        nationality,
        languages: selectedLanguages,
        proposedSalaryCurrency: salaryCurrency,
        proposedSalary: salaryExpat,
        accommodation,
        leaveStatus,
        familyStatus,
        computerProficiency: compProficiency === "Yes" ? compProficiencyLevel : "None",
        qualification,
        minimumExperience: experience,
      };
    }

    onNext({ ...commonData, ...specificData, recruitmentType: type });
  };

  // Layout Constants
  const HALF_WIDTH = "calc(50% - 12px)"; // Gap is 24px (theme.spacing(3)), so we subtract half of that
  const FULL_WIDTH = "100%";

  // --- Validation ---
  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = Boolean(
    requestDate &&
    department.trim() &&
    nickname.trim() &&
    raisedBy.trim() &&
    requesterDesignation.trim() &&
    position.trim() &&
    resumptionDate &&
    resumptionDate.isAfter(dayjs().subtract(1, 'day')) &&
    resumptionDate.isBefore(dayjs().add(1, 'year').add(1, 'day')) &&
    (type === "Local" ? salaryLocal.trim() : salaryExpat.trim()) &&
    locations.length > 0 &&
    locations.every((loc) => loc.location.trim() && loc.headcount && Number(loc.headcount) > 0) &&
    reportingManager.trim() &&
    (!requireHodApproval || (hodEmail.trim() && isEmailValid(hodEmail)))
  );

  return (
    <Box component="form" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>

      {/* --- Section 1: General Information --- */}
      <Box sx={{ width: '100%', mb: 0.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          General Information
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Basic details about this requisition request
        </Typography>
      </Box>

      {/* --- Row 1 --- */}
      <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
        <DatePicker
          label="Request Date"
          value={requestDate}
          onChange={(newValue) => setRequestDate(newValue)}
          maxDate={dayjs().add(1, 'year')}
          slotProps={{ textField: { fullWidth: true } }}
        />
      </Box>
      <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
        <TextField
          fullWidth
          required
          label="Department"
          placeholder="Department the hire will belong to"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </Box>

      {/* --- Section 2: Position Details --- */}
      <Box sx={{ width: '100%', mt: 1, mb: 0.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Position Details
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Tell us about the role you are hiring for
        </Typography>
      </Box>

      {/* --- Row 2 --- */}
      <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
        <TextField
          fullWidth
          required
          label="Requisition Internal Name"
          placeholder="e.g. JobTitle_Location_reason(New or Replacement)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </Box>
      <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
        <TextField
          fullWidth
          label="Requisition Raised By"
          value={raisedBy}
          InputProps={{ readOnly: true }}
          variant="filled"
        />
      </Box>

      {/* --- Row 3 --- */}
      <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
        <TextField
          fullWidth
          required
          label="Your Designation"
          value={requesterDesignation}
          onChange={(e) => setRequesterDesignation(e.target.value)}
        />
      </Box>
      <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
        <TextField
          fullWidth
          required
          label="Position Hiring For"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
      </Box>

      {/* --- Row 4 --- */}
      <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
        <DatePicker
          label="Expected Resumption"
          value={resumptionDate}
          onChange={(newValue) => setResumptionDate(newValue)}
          maxDate={dayjs().add(1, 'year')}
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
              error: resumptionDate ? (resumptionDate.isBefore(dayjs(), 'day') || resumptionDate.isAfter(dayjs().add(1, 'year'))) : false,
              helperText: resumptionDate && resumptionDate.isBefore(dayjs(), 'day')
                ? "Date cannot be in the past"
                : resumptionDate && resumptionDate.isAfter(dayjs().add(1, 'year'))
                  ? "Date cannot be more than 1 year in the future"
                  : ""
            }
          }}
          disablePast
        />
      </Box>

      <Box sx={{ width: "100%", mt: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          Locations & Headcount <Box component="span" sx={{ color: 'error.main' }}>*</Box>
        </Typography>
        {locations.map((item, index) => (
          <Box key={item.id} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth required>
                <InputLabel>Location</InputLabel>
                <Select
                  value={item.location}
                  label="Location"
                  onChange={(e) => handleLocationChange(item.id, "location", e.target.value)}
                >
                  {LOCATIONS_NIGERIA.map((l) => (
                    <MenuItem key={l} value={l}>{l}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                required
                label="Headcount"
                type="number"
                value={item.headcount}
                onChange={(e) => handleLocationChange(item.id, "headcount", e.target.value)}
                inputProps={{ min: 1 }}
              />
            </Box>
            {/* <Box sx={{ width: 100, display: "flex", justifyContent: "center" }}>
                      <IconButton onClick={() => handleRemoveLocation(item.id)} disabled={locations.length === 1}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      {index === locations.length - 1 && (
                        <IconButton onClick={handleAddLocation}>
                          <AddCircleOutlineIcon />
                        </IconButton>
                      )}
                    </Box> */}
          </Box>
        ))}
      </Box>

      <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
        <FormControl fullWidth>
          <InputLabel>Reason for Hire</InputLabel>
          <Select
            value={reasonForHire}
            label="Reason for Hire"
            onChange={(e) => setReasonForHire(e.target.value)}
          >
            {JOB_REASONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {reasonForHire === "Replacement" && (
        <Box sx={{ flex: "1 1 100%" }}>
          <TextField
            fullWidth
            label="Replacement For (Name)"
            value={replacementFor}
            onChange={(e) => setReplacementFor(e.target.value)}
            helperText="Please specify the name of the employee being replaced"
          />
        </Box>
      )}

      {/* --- Section 3: Compensation & Hiring Reason --- */}
      <Box sx={{ width: '100%', mt: 1, mb: 0.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Compensation & Hiring Reason
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Salary details and the business case for this role
        </Typography>
      </Box>

      {/* --- LOCAL SPECIFIC --- */}
      {type === "Local" && (
        <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
          <TextField
            fullWidth
            required
            label="Proposed Monthly Salary"
            value={salaryLocal}
            onChange={(e) => setSalaryLocal(formatCurrency(e.target.value))}
            InputProps={{
              startAdornment: <InputAdornment position="start">₦</InputAdornment>,
            }}
          />
        </Box>
      )}

      {/* --- EXPAT SPECIFIC --- */}
      {type === "Expat" && (
        <>
          <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={salaryCurrency}
                label="Currency"
                onChange={(e) => setSalaryCurrency(e.target.value)}
              >
                <MenuItem value="USD">USD ($)</MenuItem>
                <MenuItem value="INR">INR (₹)</MenuItem>
                <MenuItem value="NGN">NGN (₦)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
            <TextField
              fullWidth
              required
              label="Expected Monthly Salary"
              value={salaryExpat}
              onChange={(e) => setSalaryExpat(formatCurrency(e.target.value))}
            />
          </Box>

          <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
            <FormControl fullWidth>
              <InputLabel>Accommodation</InputLabel>
              <Select
                value={accommodation}
                label="Accommodation"
                onChange={(e) => setAccommodation(e.target.value)}
              >
                {ACCOMMODATIONS.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
            <FormControl fullWidth>
              <InputLabel>Leave Status</InputLabel>
              <Select
                value={leaveStatus}
                label="Leave Status"
                onChange={(e) => setLeaveStatus(e.target.value)}
              >
                {LEAVE_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
            <FormControl fullWidth>
              <InputLabel>Family Status Timing</InputLabel>
              <Select
                value={familyStatus}
                label="Family Status Timing"
                onChange={(e) => setFamilyStatus(e.target.value)}
              >
                {FAMILY_STATUS_TIMINGS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </>
      )}

      {/* --- Section 4: Reporting & Approvals --- */}
      <Box sx={{ width: '100%', mt: 1, mb: 0.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Reporting & Approvals
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Management structure and approval workflow
        </Typography>
      </Box>

      {/* --- Row: Managers --- */}
      <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
        <Autocomplete
          options={managerOptions}
          getOptionLabel={(option) => option.displayName}
          filterOptions={(x) => x}
          loading={isSearchingManager}
          inputValue={managerInput}
          onInputChange={(_, value) => {
            setManagerInput(value);
            if (!value) setReportingManager("");
          }}
          onChange={(_, selected) => {
            if (selected) {
              setReportingManager(selected.mail);
              setManagerInput(selected.mail);
            }
          }}
          renderOption={(props, option) => {
            const { key, ...rest } = props as any;
            return (
              <Box component="li" key={key} {...rest}>
                <Box>
                  <Typography variant="body2" fontWeight={600}>{option.displayName}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{option.jobTitle}</Typography>
                  <Typography variant="caption" color="text.disabled">{option.mail}</Typography>
                </Box>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              label="Reporting Manager"
              placeholder="Type a name to search..."
            />
          )}
        />
      </Box>

      <Box sx={{ flex: "1 1 100%" }}>
        {([AppRole.HeadOfHr, AppRole.HrManager, AppRole.Recruiter].includes(user?.role_name as AppRole)) && (
          <FormControlLabel
            control={
              <Switch
                checked={requireHodApproval}
                onChange={(e) => setRequireHodApproval(e.target.checked)}
              />
            }
            label="Require HOD Approval?"
          />
        )}

        {requireHodApproval && (
          <TextField
            fullWidth
            required
            sx={{ mt: 1 }}
            label="HOD Approval Email"
            value={hodEmail}
            onChange={(e) => setHodEmail(e.target.value)}
            placeholder="e.g. hod@example.com - This person will receive an approval request"
          />
        )}
      </Box>

      {/* --- Section 5: Justification & Documentation --- */}
      <Box sx={{ width: '100%', mt: 1, mb: 0.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Justification & Documentation
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Explain the business need and provide job specifications
        </Typography>
      </Box>

      <Box sx={{ flex: "1 1 100%" }}>
        <TextField
          fullWidth
          label="Justification / Business Case"
          multiline
          minRows={3}
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          placeholder="Why is this hire necessary? What is the business impact?"
        />
      </Box>

      <Box sx={{ flex: "1 1 100%" }}>
        {/* File Upload Section */}
        <Box sx={{ mb: 2 }}>
          <input
            accept=".docx,.pdf"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload Job Description (PDF/DOCX)
            </Button>
          </label>
          {jobDescription && (
            <Typography variant="caption" sx={{ ml: 2 }}>
              {jobDescription.name} - {(jobDescription.size / 1024).toFixed(2)} KB
            </Typography>
          )}
          {isConverting && <Typography variant="caption" sx={{ ml: 2 }}>Converting...</Typography>}
        </Box>

        {/* Job Description Editor/Preview */}
        <JobDescription
          requisition={{ content: jobDescriptionContent }}
          isEditMode={true}
          onContentChange={(content) => setJobDescriptionContent(content)}
        />
      </Box>

      {/* --- Action Buttons --- */}
      <Box sx={{ width: '100%', mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Proceed to Preferences
        </Button>
      </Box>
    </Box>
  );
};

export default RequisitionRequestForm;
