
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  Grid,
  Stack,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import dayjs, { Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { createRequisition } from "@/api/requisitionApi";
import { callCreateRequisition, stopLoading } from "@/redux/slices/requisition";
import { dispatch } from "@/redux/dispatchHandle";

const LOCATIONS = [
  "Lagos",
  "Abuja",
  "Port-Harcourt",
  "Sokoto",
  "Ibadan",
  "Kano",
  "Yola",
  "Akure",
  "Kaduna",
  "Onitsha",
  "Lafia",
  "Other",
];

interface LocationItem {
  id: number;
  location: string;
  customLocation: string;
  headcount: string;
}

const RequisitionRequest = () => {
 
    const {user} = useSelector((state: RootState) => state.auth);
    const {loading} = useSelector((state: RootState) => state.requisitions);
  // Form State
  const [requestDate, setRequestDate] = useState<Dayjs | null>(null);
  const [department, setDepartment] = useState("Digital");
  const [raisedBy, setRaisedBy] = useState(user?.full_name);
  const [designation, setDesignation] = useState("Data Engineer");
  const [justification, setJustification] = useState("");
  const [position, setPosition] = useState("Chief Technology Officer");
  const [proposedSalary, setProposedSalary] = useState("100000000");
  const [dateOfResumption, setDateOfResumption] = useState<Dayjs | null>(null);
  const [reason, setReason] = useState("I need the new staff");
  const [hodApproval, setHodApproval] = useState("isabella.k@bajajnigeria.com");
  const [locations, setLocations] = useState<LocationItem[]>([
    { id: 1, location: "", customLocation: "", headcount: "" },
  ]);

  // Helpers
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-digits
    const value = e.target.value.replace(/,/g, "").replace(/\D/g, "");
    if (!value) {
      setProposedSalary("");
      return;
    }
    // Format with commas
    const formatted = Number(value).toLocaleString();
    setProposedSalary(formatted);
  };

  const addLocation = () => {
    setLocations([
      ...locations,
      { id: Date.now(), location: "", customLocation: "", headcount: "" },
    ]);
  };

  const removeLocation = (id: number) => {
    if (locations.length > 1) {
      setLocations(locations.filter((loc) => loc.id !== id));
    }
  };

  const updateLocation = (
    id: number,
    field: keyof LocationItem,
    value: string
  ) => {
    setLocations(
      locations.map((loc) => (loc.id === id ? { ...loc, [field]: value } : loc))
    );
  };

  const isFormValid =
    requestDate &&
    department &&
    raisedBy &&
    designation &&
    justification &&
    position &&
    proposedSalary &&
    dateOfResumption &&
    hodApproval &&
    locations.every(
      (loc) =>
        (loc.location !== "Other" ? loc.location : loc.customLocation) &&
        Number(loc.headcount) > 0
    );

    useEffect(() => {
      if(loading == true){
        dispatch(stopLoading())
      }
    }, [])
    const handleSubmit = async () => {
    // Construct locationsSummary HTML string
    let locationsSummary = "";
    locations.forEach((loc) => {
      const locName =
        loc.location === "Other" ? loc.customLocation : loc.location;
      if (locName && loc.headcount) {
        locationsSummary += `\n<b>Location:</b> ${locName}<br> \n<b>Candidates Required:</b> ${loc.headcount}\n<hr>`;
      }
    });

    const payload = {
      automationType: 'new_req',
      requestDate: requestDate ? requestDate.format("YYYY-MM-DD") : null,
      department,
      raisedBy,
      designation,
      justification,
      position,
      proposedSalary: proposedSalary.replace(/,/g, ""),
      dateOfResumption: dateOfResumption
        ? dateOfResumption.format("YYYY-MM-DD")
        : null,
      reason: reason || null,
      hodApproval,
      submittedBy: user?.email,
      locationsSummary,
    };

    console.log("Submitting Payload:", JSON.stringify(payload, null, 2));
    // In a real app, you would send this to the backend here
    await callCreateRequisition(payload)
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          p: 4,
          backgroundColor: "background.default",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: "900px",
            p: 6,
            backgroundColor: "#fff",
            borderRadius: "4px",
            position: "relative",
          }}
        >
          {/* Header */}
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "text.primary", fontWeight: "bold" }}
          >
            Talent Request Form
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            Please fill out the details below to raise a new requisition.
          </Typography>

          {/* Form Container with Flexbox */}
          <Box
            component="form"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3, // Creates spacing effectively
            }}
          >
            {/* Request Date */}
            <Box sx={{ flex: "1 1 calc(50% - 24px)", minWidth: "300px" }}>
              <DatePicker
                label="Request Date"
                value={requestDate}
                onChange={(newValue) => setRequestDate(newValue)}
                disablePast
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>

            {/* Department */}
            <Box sx={{ flex: "1 1 calc(50% - 24px)", minWidth: "300px" }}>
              <TextField
                fullWidth
                label="Department"
                placeholder="e.g. Digital"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </Box>

            {/* Raised By */}
            <Box sx={{ flex: "1 1 calc(50% - 24px)", minWidth: "300px" }}>
              <TextField
                fullWidth
                label="Requisition Raised By"
                value={raisedBy || ""}
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
            </Box>

            {/* Designation */}
            <Box sx={{ flex: "1 1 calc(50% - 24px)", minWidth: "300px" }}>
              <TextField
                fullWidth
                label="Designation (Your Position)"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
            </Box>

            {/* Justification */}
            <Box sx={{ flex: "1 1 calc(50% - 24px)", minWidth: "300px" }}>
              <TextField
                select
                fullWidth
                label="Justification"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              >
                <MenuItem value="New Recruitment">New Recruitment</MenuItem>
                <MenuItem value="Replacement">Replacement</MenuItem>
              </TextField>
            </Box>

            {/* Position Hiring For */}
            <Box sx={{ flex: "1 1 calc(50% - 24px)", minWidth: "300px" }}>
              <TextField
                fullWidth
                label="Position Hiring For"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </Box>

            {/* Proposed Salary */}
            <Box sx={{ flex: "1 1 calc(50% - 24px)", minWidth: "300px" }}>
              <TextField
                fullWidth
                label="Proposed Salary"
                value={proposedSalary}
                onChange={handleSalaryChange}
                placeholder="e.g. 80,000"
              />
            </Box>

            {/* Expected Date of Resumption */}
            <Box sx={{ flex: "1 1 calc(50% - 24px)", minWidth: "300px" }}>
              <DatePicker
                label="Expected Date of Resumption"
                value={dateOfResumption}
                onChange={(newValue) => setDateOfResumption(newValue)}
                disablePast
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>

            {/* Reason */}
            <Box sx={{ flex: "1 1 100%" }}>
              <TextField
                fullWidth
                label="Reason"
                multiline
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Box>

            {/* HOD Approval */}
            <Box sx={{ flex: "1 1 100%" }}>
              <TextField
                fullWidth
                label="HOD Approval Email"
                placeholder="email of the hod"
                value={hodApproval}
                onChange={(e) => setHodApproval(e.target.value)}
              />
            </Box>

            {/* Locations Section */}
            <Box sx={{ flex: "1 1 100%" }}>
              <Typography variant="h6" sx={{ mt: 1, mb: 2 }}>
                Locations & Headcount
              </Typography>

              {locations.map((loc, index) => (
                <Box
                  key={loc.id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 2,
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ flex: 2 }}>
                    <TextField
                      select
                      fullWidth
                      label="Location"
                      value={loc.location}
                      onChange={(e) =>
                        updateLocation(loc.id, "location", e.target.value)
                      }
                    >
                      {LOCATIONS.map((l) => (
                        <MenuItem key={l} value={l}>
                          {l}
                        </MenuItem>
                      ))}
                    </TextField>
                    {loc.location === "Other" && (
                      <TextField
                        fullWidth
                        sx={{ mt: 1 }}
                        placeholder="Enter location"
                        value={loc.customLocation}
                        onChange={(e) =>
                          updateLocation(loc.id, "customLocation", e.target.value)
                        }
                      />
                    )}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Headcount"
                      type="number"
                      value={loc.headcount}
                      onChange={(e) =>
                        updateLocation(loc.id, "headcount", e.target.value)
                      }
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: 56,
                    }}
                  >
                    {index === locations.length - 1 && (
                      <IconButton color="primary" onClick={addLocation}>
                        <AddCircleOutlineIcon />
                      </IconButton>
                    )}
                    {locations.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => removeLocation(loc.id)}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={!isFormValid}
            >
              Submit Request
            </Button>
          )}
          </Box>

          <Box
            sx={{
              mt: 8,
              pt: 2,
              borderTop: "1px solid #eee",
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.disabled">
              DAG/IMS/HRA/F/12
            </Typography>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default RequisitionRequest;



