"use client";

import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { AppRole } from "@/utils/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import axiosInstance from "@/api/axiosInstance";

// Helper to determine API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface SignatureSlotProps {
  title: string;
  role: string;
  description: string;
}

const SignatureSlot = ({ title, role, description }: SignatureSlotProps) => {
  const theme = useTheme();
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
 

  // Fetch existing signature on mount
  useEffect(() => {
    const fetchSignature = async () => {
      try {
        setLoading(true);
        // Assuming there's an endpoint to get signature by role
        const response = await axiosInstance.get(`/signature`);
        console.log(response.data)
        if (response.data.data && response.data.data.signatureUrl) {
          console.log('hhh')
           // Construct full URL if relative path is returned
           const url = response.data.data.signatureUrl.startsWith('http') 
             ? response.data.data.signatureUrl 
             : `${API_URL}${response.data.data.signatureUrl}`;
          setSignature(url);
        }
      } catch (error) {
        console.error("Failed to fetch signature:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignature();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
          alert("File size exceeds 5MB limit");
          return;
      }

      // Create a local preview URL immediately
      const previewUrl = URL.createObjectURL(file);
      const previousSignature = signature;
      setSignature(previewUrl);
      
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("signature", file); 

        const response = await axiosInstance.post(`/signature`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // Check for various response properties (value, data, or signatureUrl) to be robust
        const serverPath = response.data?.value

        if (serverPath) {
            const url = serverPath.startsWith('http') 
             ? serverPath 
             : `${API_URL}${serverPath}`;
            setSignature(url); // Update UI with the new URL from server
        }
      } catch (error) {
        console.error("Error uploading signature:", error);
        alert("Failed to upload signature. Please try again.");
        setSignature(previousSignature); // Revert to previous signature
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemoveSignature = async () => {
      if (!confirm("Are you sure you want to delete this signature?")) return;
      
      try {
        // Optional: Call backend to delete
        // await axios.delete(`${API_URL}/api/upload/signature/${role}`);
        setSignature(null);
      } catch (error) {
          console.error("Error removing signature", error);
      }
  };


  console.log(signature)

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
          {loading ? (
             <CircularProgress size={30} />
          ) : signature ? (
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
                    disabled={uploading}
                  >
                     <EditIcon fontSize="small" />
                     <input
                        type="file"
                        hidden
                        accept="image/png, image/jpeg, image/jpg" 
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
              <Typography variant="body2">{uploading ? "Uploading..." : "No signature uploaded"}</Typography>
            </Box>
          )}
        </Box>

        <Button
          component="label"
          variant="contained"
          startIcon={uploading ? <CircularProgress size={20} color="inherit"/> : <CloudUploadIcon />}
          fullWidth
          disabled={uploading}
          sx={{
            mt: "auto",
            textTransform: "none",
            borderRadius: theme.shape.borderRadius,
          }}
        >
          {uploading ? "Uploading..." : (signature ? "Replace Signature" : "Upload Signature")}
          <input
            type="file"
            hidden
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileUpload}
          />
        </Button>
      </CardContent>
    </Card>
  );
};

export default function SignaturesPage() {
  const theme = useTheme();
   const {user} = useSelector((state: RootState) => state.auth);

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
          title={user?.role_name == AppRole.HeadOfHr ? "Head of HR Signature" : "HR Manager Signature"}
          role={user?.role_name!}
          description="This signature will be used for high-level approvals and official offer letters."
        />
        
      </Box>
    </Box>
  );
}
