
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { callCreateRequisition, stopLoading } from "@/redux/slices/requisition";
import { dispatch } from "@/redux/dispatchHandle";
import RequisitionRequestForm from "@/components/requisition/RequisitionRequestForm";
import PreferenceTable, {
  PreferenceItem,
} from "@/components/requisition/PreferenceTable";

const RequisitionRequest = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector((state: RootState) => state.requisitions);

  // 0: Local, 1: Expat
  const [activeTab, setActiveTab] = useState(0);
  
  // 0: Form, 1: Preferences
  const [step, setStep] = useState(0);

  // Store form data from step 1
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (loading) {
      dispatch(stopLoading());
    }
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setStep(0); // Reset step when changing recruitment type
    setFormData(null);
  };

  const handleFormNext = (data: any) => {
    setFormData(data);
    setStep(1);
  };

  const handlePreferencesBack = () => {
    setStep(0);
  };

  const handleFinalSubmit = async (preferences: PreferenceItem[]) => {
    if (!formData) return;

    const {
      requestDate,
      department,
      raisedBy,
      designation,
      justification,
      position,
      proposedSalary,
      dateOfResumption,
      reason,
      hodEmail,
      locations,
      proposedSalaryCurrency,
      internalName,
      // Expat Specifics
      accommodation,
      leaveStatus,
      familyStatus,
      computerProficiency,
      qualification,
      minimumExperience,
      nationality,
      languages,
      // For Local
      headcount,
      location: legacyLocation, // alias just in case
      requiredHodApproval,
      replacementFor,
      jobDescription,
      originalFileName
    } = formData;

    // Construct locationsSummary HTML string
    let locationsSummary = "";
    
    // Process locations array for both types
    if (locations && Array.isArray(locations)) {
      console.log("Locations:", locations);
      locations.forEach((loc: any) => {
        const locName = loc.location === "Other" ? loc.customLocation : loc.location;
        if (locName && loc.headcount) {
          locationsSummary += `\n<b>Location:</b> ${locName}<br> \n<b>Candidates Required:</b> ${loc.headcount}\n<hr>`;
        }
      });
    }

    // Construct Preferences Summary
    let preferencesSummary: any[] = [];
    const activePreferences = preferences.filter(p => p.askCandidate);
    
    if(activePreferences.length > 0) {

        activePreferences.forEach((p) => {
            // Check if value is array (for multi-select) or simple string
            const valDisplay = Array.isArray(p.value) ? p.value.join(", ") : p.value;
            preferencesSummary.push({
              id: p.id, 
              preference: p.preference,
              value: valDisplay
            });
        });
    }

    const payload = {
      automationType: "new_req",
      requestDate: requestDate ? requestDate.format("YYYY-MM-DD") : null,
      department,
      raisedBy,
      designation,
      justification,
      position, // This is the role title
      proposedSalary: proposedSalary ? proposedSalary.toString().replace(/,/g, "") : "",
      dateOfResumption: dateOfResumption
        ? dateOfResumption.format("YYYY-MM-DD")
        : null,
      reason: reason || null,
      hodApproval: hodEmail,
      submittedBy: user?.email,
      locationsSummary: locationsSummary, 
      preferencesSummary: preferencesSummary,
      proposedSalaryCurrency,
      internalName,
      recruitmentType: activeTab === 0 ? "Local" : "Expat",
      
      // Pass locations array
      locations: locations,
      
      requiredHodApproval,
      replacementFor,
      jobDescription,
      originalFileName,
      
      accommodation,
      leaveStatus,
      familyStatus,
      computerProficiency,
      qualification,
      minimumExperience,
      nationality,
      languages
    };

    console.log("Submitting Payload:", JSON.stringify(payload, null, 2));
    await callCreateRequisition(payload);
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
            backgroundColor: "background.paper",
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

          {/* Top Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="recruitment type tabs"
            >
              <Tab label="Local Recruitment" />
              <Tab label="Expat Recruitment" />
            </Tabs>
          </Box>

          {/* Step 0: Form */}
          {step === 0 && (
            <Box>
              {/* We mount the form based on activeTab. 
                  If we want to preserve state when switching tabs, we'd need to lift state up.
                  For now, we let them be separate instances as implied by "Local tab will have it's own form".
              */}
              {activeTab === 0 && (
                <RequisitionRequestForm
                  key="local-form"
                  type="Local"
                  onNext={handleFormNext}
                />
              )}
              {activeTab === 1 && (
                <RequisitionRequestForm
                  key="expat-form"
                  type="Expat"
                  onNext={handleFormNext}
                />
              )}
            </Box>
          )}

          {/* Step 1: Preferences */}
          {step === 1 && (
            <PreferenceTable
              recruitmentType={activeTab === 0 ? "Local" : "Expat"}
              onBack={handlePreferencesBack}
              onSubmit={handleFinalSubmit}
              loading={loading}
            />
          )}

          {/* Footer Info */}
          <Box
            sx={{
              mt: 8,
              pt: 2,
              borderTop: "1px solid",
              borderColor: "divider",
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




