
"use client";
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  alpha,
  useTheme
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { callCreateRequisition, stopLoading } from "@/redux/slices/requisition";
import { dispatch } from "@/redux/dispatchHandle";
import PreferenceTable, {
  PreferenceItem,
} from "@/components/requisition/PreferenceTable";
import { useRouter } from 'next/navigation';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Link from 'next/link';
import { IconButton, Tooltip } from '@mui/material';


// 1. Define the dynamic component
const RequisitionRequestForm = dynamic(
  () => import('@/components/requisition/RequisitionRequestForm'),
  {
    ssr: false, // This stops the PDF/Canvas error during build
    loading: () => <div>Loading Form...</div>
  }
);


const RequisitionRequest = () => {
  const theme = useTheme();
  const router = useRouter();
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
      reportingManager,
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
    console.log("Active Preferences:", activePreferences);
    if (activePreferences.length > 0) {

      activePreferences.forEach((p) => {
        preferencesSummary.push({
          pref_key: p.pref_key,
          min_required_rank: p.min_required_rank,
          weight_score: p.weight_score,
          ask_candidate: true,
          skill_id: p.skill_id
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
      reportingManager,
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
    const success = await callCreateRequisition(payload);

    // // Only redirect if the submission was successful
    if (success) {
      router.push("/requisition");
    }
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              variant="h4"
              sx={{ color: "text.primary", fontWeight: "bold" }}
            >
              Talent Request Form
            </Typography>
            <Tooltip title="How to fill this form?">
              <IconButton
                component={Link}
                href="/how-to-use#step-2"
                sx={{
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                }}
              >
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
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




