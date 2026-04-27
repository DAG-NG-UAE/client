"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useParams, useRouter } from "next/navigation";
import { readExcelFile } from "@/utils/excelParser";
import { validateCompetencyLabels, mapCompetencyProfile } from "@/utils/competencyMapper";
import { callUpdateCandidateStatus } from "@/redux/slices/candidates";
import { enqueueSnackbar } from "notistack";

interface ProfileRow {
  label: string;
  value: string;
}

export default function CompetencyUploadPage() {
  const router = useRouter();
  const params = useParams();
  const candidateId = params?.id ? String(params.id) : "";
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [profile, setProfile] = useState<ProfileRow[] | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFile = (incoming: File) => {
    setFile(incoming);
    setProfile(null);
    setValidationError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleParse = async () => {
    if (!file) return;
    setParsing(true);
    setValidationError(null);
    setProfile(null);

    try {
      const { labels, values } = await readExcelFile(file);

      const error = validateCompetencyLabels(labels);
      if (error) {
        setValidationError(error);
        return;
      }

      const rows: ProfileRow[] = labels
        .map((label, i) => ({ label: label.trim(), value: values[i]?.trim() ?? "" }))
        .filter((row) => row.label !== "");

      setProfile(rows);
    } catch {
      enqueueSnackbar("Failed to read the file. Make sure it's a valid Excel file.", { variant: "error" });
    } finally {
      setParsing(false);
    }
  };

  const handleUpload = async () => {
    if (!profile || !candidateId) return;
    const mapped = mapCompetencyProfile(profile);
    console.log("Mapped competency profile:", { ...mapped, candidate_id: candidateId });
    await callUpdateCandidateStatus({ ...mapped, candidate_id: candidateId });
  };

  const clearAll = () => {
    setFile(null);
    setProfile(null);
    setValidationError(null);
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "background.default" }}>
      <Container maxWidth="md">
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Competency Profile Upload
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Upload the candidate's standard company competency Excel file.
            </Typography>
          </Box>
          <Button variant="text" onClick={() => router.back()} sx={{ color: "text.secondary", fontWeight: 600 }}>
            Back
          </Button>
        </Stack>

        {/* Stage 1 — File picker */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider", mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Step 1 — Select File
          </Typography>

          <Box
            sx={{
              border: "2px dashed",
              borderColor: file ? "primary.main" : "divider",
              borderRadius: 2,
              p: 5,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: "action.hover",
              "&:hover": { borderColor: "primary.main" },
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById("competency-file-input")?.click()}
          >
            <input
              type="file"
              id="competency-file-input"
              hidden
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />
            <CloudUploadIcon sx={{ fontSize: 44, color: file ? "primary.main" : "text.disabled", mb: 1 }} />
            {file ? (
              <Typography variant="body1" fontWeight={500} color="primary.main">
                {file.name}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Click to upload or drag and drop
              </Typography>
            )}
            <Typography variant="caption" color="text.disabled" display="block" mt={0.5}>
              Accepted: .xlsx, .xls
            </Typography>
          </Box>

          {validationError && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {validationError}
            </Alert>
          )}

          <Stack direction="row" justifyContent="flex-end" mt={3} spacing={2}>
            {file && (
              <Button variant="text" onClick={clearAll} sx={{ color: "text.secondary" }}>
                Clear
              </Button>
            )}
            <Button
              variant="contained"
              disabled={!file || parsing}
              onClick={handleParse}
              startIcon={parsing ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {parsing ? "Reading..." : "Read Profile"}
            </Button>
          </Stack>
        </Paper>

        {/* Stage 2 — Preview + Upload */}
        {profile && (
          <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 4, py: 3, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircleOutlineIcon color="success" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={700}>
                  Step 2 — Review &amp; Upload
                </Typography>
              </Stack>
              <Button variant="contained" color="success" onClick={handleUpload}>
                Upload Profile
              </Button>
            </Stack>

            <Table>
              <TableBody>
                {profile.map((row, i) => (
                  <TableRow
                    key={i}
                    sx={{
                      "&:last-child td": { border: 0 },
                      bgcolor: i % 2 === 0 ? "action.hover" : "background.paper",
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, width: "45%", color: "text.primary", py: 1.5 }}>
                      {row.label}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary", py: 1.5 }}>
                      {row.value || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
