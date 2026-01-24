
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

  // --- Form State ---
  // Shared
  const [requestDate, setRequestDate] = useState<Dayjs | null>(dayjs());
  const [nickname, setNickname] = useState("System Analyst (Lagos Mainland)");
  const [department, setDepartment] = useState("Digital");
  const [raisedBy, setRaisedBy] = useState(user?.full_name || "");
  const [requesterDesignation, setRequesterDesignation] = useState("Data Engineer"); 
  
  // Position
  const [position, setPosition] = useState("System Analyst");
  
  // Dates
  const [resumptionDate, setResumptionDate] = useState<Dayjs | null>(null);
  
  // Manager
  const [reportingManager, setReportingManager] = useState("Shirely werchota (CDO)");
  const [hodEmail, setHodEmail] = useState("isabella.k@bajajnigeria.com");
  
  // Content
  const [justification, setJustification] = useState("");
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  
  // HOD Approval Logic
  const [requireHodApproval, setRequireHodApproval] = useState(true);

  // -- Locations (Shared for both Local and Expat now) --
  const [locations, setLocations] = useState<LocationItem[]>([
    { id: Date.now(), location: "", headcount: "1" },
  ]);

  // -- Local Specific --
  const [salaryLocal, setSalaryLocal] = useState("500000");
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
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setJobDescription(e.target.files[0]);
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
      jobDescription: jobDescription?.name, // Just name for now
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

  return (
    <Box component="form" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
      
      {/* --- Row 1 --- */}
      <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
        <DatePicker
          label="Request Date"
          value={requestDate}
          onChange={(newValue) => setRequestDate(newValue)}
          readOnly 
          slotProps={{ textField: { fullWidth: true } }}
        />
      </Box>
      <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
         <TextField
          fullWidth
          label="Department"
          placeholder="Department the hire will belong to"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </Box>

      {/* --- Row 2 --- */}
      <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
        <TextField
          fullWidth
          label="Requisition Internal Name"
          placeholder="e.g. Q1 Expansion Data Team"
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
          label="Your Designation"
          value={requesterDesignation}
          onChange={(e) => setRequesterDesignation(e.target.value)}
        />
      </Box>
      <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
        <TextField
          fullWidth
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
            slotProps={{ textField: { fullWidth: true } }}
            disablePast
         />
      </Box>

      <Box sx={{ width: "100%" }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Locations & Headcount (Fixed)</Typography>
                {locations.map((item, index) => (
                  <Box key={item.id} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
                    <Box sx={{ flex: 1 }}>
                      <FormControl fullWidth>
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
                        label="Headcount"
                        type="number"
                        value={item.headcount}
                        InputProps={{ readOnly: true }} // Fixed to 1 as per request
                        helperText="Headcount is fixed to 1 per location entry"
                      />
                    </Box>
                    <Box sx={{ width: 100, display: "flex", justifyContent: "center" }}>
                      <IconButton onClick={() => handleRemoveLocation(item.id)} disabled={locations.length === 1}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      {index === locations.length - 1 && (
                        <IconButton onClick={handleAddLocation}>
                          <AddCircleOutlineIcon />
                        </IconButton>
                      )}
                    </Box>
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

      {/* --- CONDITIONAL SECTIONS --- */}

      {/* --- LOCAL SPECIFIC --- */}
      {type === "Local" && (
        <>
            <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
                <TextField 
                    fullWidth
                    label="Proposed Monthly Salary"
                    value={salaryLocal}
                    onChange={(e) => setSalaryLocal(formatCurrency(e.target.value))}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₦</InputAdornment>,
                    }}
                />
            </Box>

            
        </>
      )}

      {/* --- EXPAT SPECIFIC --- */}
      {type === "Expat" && (
        <>

            {/* Expat Salary Row */}
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

      {/* --- Row: Managers --- */}
       <Box sx={{ flex: `1 1 ${HALF_WIDTH}`, maxWidth: HALF_WIDTH }}>
          <TextField
              fullWidth
              label="Reporting Manager"
              value={reportingManager}
              onChange={(e) => setReportingManager(e.target.value)}
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
                    sx={{ mt: 1 }}
                    label="HOD Approval Email"
                    value={hodEmail}
                    onChange={(e) => setHodEmail(e.target.value)}
                    placeholder="e.g. hod@example.com - This person will receive an approval request"
                />
            )}
       </Box>

       {/* --- Justification & Description --- */}
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
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Job Description</Typography>
          {/* {handleFileUpload()} */}
       </Box>

      {/* --- Action Buttons --- */}
      <Box sx={{ width: '100%', mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
        >
            Proceed to Preferences
        </Button>
      </Box>
    </Box>
  );
};

export default RequisitionRequestForm;
