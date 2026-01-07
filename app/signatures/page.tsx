"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { AppRole } from "@/utils/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface SignatureSlotProps {
  title: string;
  role: string;
  description: string;
}

const SignatureSlot = ({ title, role, description }: SignatureSlotProps) => {
  const theme = useTheme();
  // In a real app, this would come from an API/backend based on the role
  const [signature, setSignature] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSignature = () => {
    setSignature(null);
  };

  return (
    <Card
      sx={{
        flex: 1,
        minWidth: 300,
        backgroundColor: theme.palette.background.paper,
        // borderRadius: theme.shape.borderRadius,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, height: '100%' }}>
        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 200,
            border: `2px dashed ${theme.palette.divider}`,
            // borderRadius: theme.shape.borderRadius,
            backgroundColor:
              theme.palette.mode === "light"
                ? "rgba(0, 0, 0, 0.02)"
                : "rgba(255, 255, 255, 0.02)",
            position: "relative",
            overflow: "hidden",
            mb: 2,
          }}
        >
          {signature ? (
            <>
              <Box
                component="img"
                src={signature}
                alt={`${title} Signature`}
                sx={{
                  maxWidth: "100%",
                  maxHeight: 180,
                  objectFit: "contain",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 1,
                }}
              >
                  <IconButton
                    size="small"
                    component="label"
                    sx={{ bgcolor: theme.palette.background.paper }}
                  >
                     <EditIcon fontSize="small" />
                     <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                  </IconButton>
                <IconButton
                  size="small"
                  onClick={handleRemoveSignature}
                  sx={{ bgcolor: theme.palette.background.paper }}
                >
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                color: "text.secondary",
              }}
            >
              <Typography variant="body2">No signature uploaded</Typography>
            </Box>
          )}
        </Box>

        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          fullWidth
          sx={{
            mt: "auto",
            textTransform: "none",
            borderRadius: theme.shape.borderRadius,
          }}
        >
          {signature ? "Replace Signature" : "Upload Signature"}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileUpload}
          />
        </Button>
      </CardContent>
    </Card>
  );
};

export default function SignaturesPage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: theme.spacing(3),
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Signature Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload and manage digital signatures for official HR documents and contracts.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Flexbox as requested
          gap: 3,
        }}
      >
        <SignatureSlot
          title="Head of HR Signature"
          role={AppRole.HeadOfHr}
          description="This signature will be used for high-level approvals and official offer letters."
        />
        <SignatureSlot
          title="HR Manager Signature"
          role={AppRole.HrManager}
          description="This signature will be applied to standard recruitment documents and potential candidate communications."
        />
      </Box>
    </Box>
  );
}
