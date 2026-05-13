"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchRequisitionById } from "@/redux/slices/requisition";
import RequisitionHeader from "@/components/requisition/RequisitionHeader";
import { bulkParseCvs, BulkParseResult } from "@/api/candidate";
import { enqueueSnackbar } from "notistack";
import BulkCandidateReviewModal, {
  CandidateSlide,
} from "@/components/candidates/BulkCandidateReviewModal";

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const MAX_FILES = 10;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mapExperience(raw: string): string {
  const years = parseFloat(raw);
  if (isNaN(years)) return "";
  if (years < 1) return "0-6months";
  if (years <= 3) return "1-3years";
  if (years <= 8) return "4-8years";
  if (years <= 19) return "10+years";
  return "20+years";
}

interface FileEntry {
  file: File;
  id: string;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AddBulkCandidatesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id
    ? decodeURIComponent(params.id as string).replace(/ /g, "_")
    : "";

  const { selectedRequisition } = useSelector(
    (state: RootState) => state.requisitions
  );

  useEffect(() => {
    if (id) fetchRequisitionById(id);
  }, [id]);

  const [files, setFiles] = useState<FileEntry[]>([]);
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Review modal state
  const [reviewOpen, setReviewOpen] = useState(false);
  const [slides, setSlides] = useState<CandidateSlide[]>([]);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const pdfs = Array.from(incoming).filter(
      (f) => f.type === "application/pdf"
    );
    setFiles((prev) => {
      const combined = [...prev];
      for (const f of pdfs) {
        if (combined.length >= MAX_FILES) break;
        if (
          !combined.some(
            (e) => e.file.name === f.name && e.file.size === f.size
          )
        ) {
          combined.push({ file: f, id: `${f.name}-${f.size}-${Date.now()}` });
        }
      }
      return combined;
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((e) => e.id !== fileId));
  };

  const handleNext = async () => {
    if (files.length === 0) return;
    setParsing(true);
    try {
      const results = await bulkParseCvs(files.map((e) => e.file));

      const built: CandidateSlide[] = results.map((result) => {
        const matchedFile =
          files.find((fe) => fe.file.name === result.filename)?.file ??
          files[0].file;

        const base = {
          filename: result.filename,
          parsedSuccess: result.success,
          originalFile: matchedFile,
          availability: "",
          source: "",
          otherSource: "",
          stage: "",
          coverLetter: "",
          emailError: "",
          phoneError: "",
          submitting: false,
          submitted: false,
          skipped: false,
          submitError: "",
        };

        if (!result.success) {
          return { ...base, fullName: "", emailAddress: "", phoneNumber: "", experience: "", skills: [] };
        }

        const d = result.data;
        return {
          ...base,
          fullName: d.fullName ?? "",
          emailAddress: d.emailAddress ?? "",
          phoneNumber: d.phoneNumber ?? "",
          experience: mapExperience(d.experience ?? ""),
          skills: d.skills ?? [],
        };
      });

      const failedCount = results.filter((r) => !r.success).length;
      if (failedCount > 0) {
        enqueueSnackbar(
          `${results.length - failedCount} of ${results.length} CVs parsed successfully. ${failedCount} could not be read — fill them in manually or skip.`,
          { variant: "info", autoHideDuration: 6000 }
        );
      }

      setSlides(built);
      setReviewOpen(true);
    } catch {
      enqueueSnackbar("Failed to parse CVs. Please try again.", {
        variant: "error",
      });
    } finally {
      setParsing(false);
    }
  };

  const slots = MAX_FILES - files.length;

  return (
    <Box
      sx={{ p: 4, minHeight: "100vh", backgroundColor: "background.default" }}
    >
      <Container maxWidth="md">
        <RequisitionHeader
          title={`Add Bulk Candidates — ${selectedRequisition?.position || "Requisition"}`}
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
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Upload CVs
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Upload up to <strong>{MAX_FILES} PDFs</strong>. Non-PDF files are
            ignored automatically.
            {files.length > 0 && (
              <Box component="span" sx={{ ml: 1 }}>
                {slots} slot{slots !== 1 ? "s" : ""} remaining.
              </Box>
            )}
          </Typography>

          {/* Drop zone */}
          <Box
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() =>
              !parsing && files.length < MAX_FILES && inputRef.current?.click()
            }
            sx={{
              border: "2px dashed",
              borderColor: dragging ? "primary.main" : "divider",
              borderRadius: 3,
              bgcolor: dragging ? "primary.50" : "action.hover",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 6,
              gap: 1.5,
              cursor:
                files.length >= MAX_FILES || parsing
                  ? "not-allowed"
                  : "pointer",
              transition: "border-color 0.2s, background-color 0.2s",
              opacity: files.length >= MAX_FILES ? 0.5 : 1,
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 52, color: "text.secondary" }} />
            <Typography variant="body1" color="text.secondary">
              Drag & drop PDFs here or{" "}
              <Box
                component="span"
                sx={{ color: "primary.main", fontWeight: 600 }}
              >
                click to browse
              </Box>
            </Typography>
            <Typography variant="caption" color="text.disabled">
              PDF only · max {MAX_FILES} files
            </Typography>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              multiple
              hidden
              onChange={handleInputChange}
              disabled={files.length >= MAX_FILES || parsing}
            />
          </Box>

          {/* File list */}
          {files.length > 0 && (
            <Box mt={3}>
              <Typography variant="subtitle2" mb={1}>
                Selected files ({files.length}/{MAX_FILES})
              </Typography>
              <List
                dense
                disablePadding
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                {files.map((entry, idx) => (
                  <ListItem
                    key={entry.id}
                    divider={idx < files.length - 1}
                    secondaryAction={
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={() => removeFile(entry.id)}
                        disabled={parsing}
                      >
                        <DeleteOutlineIcon fontSize="small" color="error" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={entry.file.name}
                      secondary={formatBytes(entry.file.size)}
                      slotProps={{
                        primary: { variant: "body2", noWrap: true, sx: { maxWidth: 480 } },
                        secondary: { variant: "caption" },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {parsing && (
            <Box mt={3}>
              <LinearProgress sx={{ borderRadius: 1 }} />
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mt={1}
              >
                Parsing CVs, please wait…
              </Typography>
            </Box>
          )}

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mt={4}
          >
            <Button
              variant="text"
              color="inherit"
              onClick={() => router.back()}
              disabled={parsing}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="large"
              disabled={files.length === 0 || parsing}
              onClick={handleNext}
              sx={{ px: 4, borderRadius: 2 }}
            >
              {parsing ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                `Next — ${files.length} CV${files.length !== 1 ? "s" : ""}`
              )}
            </Button>
          </Stack>
        </Paper>
      </Container>

      {/* Review modal — opens after parsing */}
      <BulkCandidateReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        slides={slides}
        onSlidesChange={setSlides}
        requisition={selectedRequisition}
        requisitionId={id}
        onAllSubmitted={() => {
          setReviewOpen(false);
          router.back();
        }}
      />
    </Box>
  );
}
