"use client";

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Chip,
  Stack,
  Divider,
  useTheme
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { getCareerDetail } from '@/api/requisitionApi';
import { Requisition } from '@/interface/requisition';
import { apply } from '@/api/candidate';

// Reusable Form Input Component
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

const FormInput: React.FC<FormInputProps> = ({
  label,
  required = false,
  placeholder,
  type = 'text',
  multiline = false,
  rows,
  value = '', // Initialize value to empty string to ensure it's always controlled
  disabled = false, // Add disabled prop with default false
  onChange
}) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
      {label} {required && <Box component="span" sx={{ color: 'error.main' }}>*</Box>}
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
      disabled={disabled} // Pass disabled prop to TextField
      onChange={onChange}
      InputProps={{
        sx: { borderRadius: 2, backgroundColor: 'background.paper' }
      }}
    />
  </Box>
);

// Reusable Section Header
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#101828' }}>
    {title}
  </Typography>
);

export default function ApplyPage({ params }: { params: { id: string } }) {
  const theme = useTheme();
  const [availability, setAvailability] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState(''); 
  const [careerDetails, setCareerDetails] = useState<Partial<Requisition>>({});

  // Form field states
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null); // State for CV file

  const fetchJobDetails = async (slug:string) => { 
    try{ 
      const result = await getCareerDetail(slug)
      setCareerDetails(result)
    }catch(error){ 
      console.log("Error fetching career details")
    }
  
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
  
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setCvFile(selectedFile); 
    } else {
      setCvFile(null);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    // You might want to add some visual feedback here, e.g., change border color
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    // Revert visual feedback
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setCvFile(event.dataTransfer.files[0]);
    }
  };

  useEffect(() => { 
    fetchJobDetails('340ff80e-eede-45a8-a0c9-55b3435e73c4')
  }, [])

  const isFormValid = 
    fullName !== '' &&
    emailAddress !== '' &&
    phoneNumber !== '' &&
    availability !== '' &&
    experience !== '' &&
    location !== '' &&
    expectedSalary !== '' &&
    cvFile !== null && // Check if CV file is uploaded
    privacyConsent;
  
  // submit the form 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      alert('Please fill all required fields and accept the privacy notice.');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('emailAddress', emailAddress);
    formData.append('phoneNumber', phoneNumber);
    formData.append('availability', availability);
    formData.append('experience', experience);
    formData.append('expectedSalary', expectedSalary);
    formData.append('coverLetter', coverLetter);
    formData.append('privacyConsent', String(privacyConsent)); // Convert boolean to string
    if (careerDetails.position) {
      formData.append('position', careerDetails.position);
    }
    if (careerDetails.department) {
      formData.append('department', careerDetails.department);
    }
    if (cvFile) {
      console.log('File being sent:', {
        name: cvFile.name,
        size: cvFile.size,
        type: cvFile.type,
        lastModified: cvFile.lastModified
      });
      formData.append('cvFile', cvFile, cvFile.name); // Explicitly include filename
    }
    formData.append('requisitionPositionSlot', location) // This was added by the user in the previous turn


   // Better FormData logging
  console.log('FormData contents:');
  for (const pair of formData.entries()) {
    if (pair[1] instanceof File) {
      console.log(`${pair[0]}:`, {
        name: pair[1].name,
        size: pair[1].size,
        type: pair[1].type
      });
    } else {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  }

    // submit the form 
    try{
      const response = await apply(formData,'340ff80e-eede-45a8-a0c9-55b3435e73c4' )
    }catch(error){ 
      console.error('Error submitting form:', error);
      alert('An error occurred during submission.');
    }
  };

 


  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header Section */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText', 
        pt: 8, 
        pb: 12,
        px: 4
      }}>
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Typography variant="h3" fontWeight="bold">
              {careerDetails.position}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {careerDetails.department} • {careerDetails.requisition_positions?.slice(0, 2).map((location) => location.location).join(', ')}
              {careerDetails.requisition_positions && careerDetails.requisition_positions.length > 2 && ' ...'}
            </Typography>
            {/* <Stack direction="row" spacing={1} mt={2}>
              <Chip label="Remote Available" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'inherit' }} />
              <Chip label="$120k - $160k" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'inherit' }} />
              <Chip label="Full Benefits" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'inherit' }} />
            </Stack> */}
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: -8, mb: 8, position: 'relative', zIndex: 2 }}>
        <Paper elevation={0} sx={{ p: 6, borderRadius: 4, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)', bgcolor: 'background.paper' }}>
          <form onSubmit={handleSubmit} encType="multipart/form-data"> {/* Wrap content in form tag */}
          {/* <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
            Submit Your Application
          </Typography> */}

          {/* Personal Information */}
          <Box mb={4}>
            <SectionHeader title="Personal Information" />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormInput label="Full Name" required placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormInput label="Email Address" required placeholder="john.doe@email.com" type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormInput label="Phone Number" required placeholder="(555) 123-4567" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormInput label="Position Applied For" required disabled={true} value={careerDetails.position} />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Application Details */}
          <Box mb={4}>
            <SectionHeader title="Application Details" />
            
            {/* Resume Upload */}
            <Box mb={3}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                CV/Resume <span style={{ color: theme.palette.error.main }}>*</span>
              </Typography>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: 'background.default',
                  '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' }
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('cv-upload-input')?.click()} // Trigger file input click
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
                    <Button size="small" onClick={(e) => { e.stopPropagation(); setCvFile(null); }}>Remove</Button>
                  </Stack>
                ) : (
                  <>
                    <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      Click to upload or drag and drop
                    </Typography>
                  </>
                )}
                <Typography variant="caption" color="textSecondary" display="block" mt={0.5}>
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </Typography>
              </Box>
            </Box>

            <FormInput label="Expected Salary" required placeholder="e.g., $120,000 - $140,000 or Negotiable" value={expectedSalary} onChange={(e) => setExpectedSalary(e.target.value)} />

            <Box mb={3}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                Experience <span style={{ color: theme.palette.error.main }}>*</span>
              </Typography>
              <Select
                fullWidth
                displayEmpty
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
              >
                <MenuItem value="" disabled>
                  <Typography color="textSecondary">Select experience</Typography>
                </MenuItem>
                <MenuItem value="0-6months">0-6 Months</MenuItem>
                <MenuItem value="1-3years">1-3 years</MenuItem>
                <MenuItem value="4-8years">4-8 years</MenuItem>
                <MenuItem value="10+years">10+ years</MenuItem>
                <MenuItem value="20+years">20+ years</MenuItem>
              </Select>
            </Box>

            <Box mb={3}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                Availability to Join <span style={{ color: theme.palette.error.main }}>*</span>
              </Typography>
              <Select
                fullWidth
                displayEmpty
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
              >
                <MenuItem value="" disabled>
                  <Typography color="textSecondary">Select availability</Typography>
                </MenuItem>
                <MenuItem value="immediate">Immediately</MenuItem>
                <MenuItem value="2weeks">2 Weeks Notice</MenuItem>
                <MenuItem value="1month">1 Month Notice</MenuItem>
                <MenuItem value="3month">3 Month Notice</MenuItem>
              </Select>
            </Box>

            <Box mb={3}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                    Select Location <span style={{ color: theme.palette.error.main }}>*</span>
                </Typography>
                {/* display the available locations to the user so they click the locations they are applying for  */}
                <Select
                  fullWidth
                  displayEmpty
                  value={location} // Changed from availability to location
                  onChange={(e) => setLocation(e.target.value)}
                  sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
                >
                  <MenuItem value ="" disabled>
                    <Typography color="textSecondary">Select Location</Typography>
                  </MenuItem>
                  {careerDetails.requisition_positions?.map((location) => (
                    <MenuItem value={location.position_slot_id}>{location.location}</MenuItem>
                  ))}
                 
                </Select>
            </Box>

            <FormInput 
              label="Cover Letter (Optional)" 
              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              multiline
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Privacy & Data Protection */}
          <Box mb={4}>
            <SectionHeader title="Privacy & Data Protection" />
            <FormControlLabel
              control={<Checkbox checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} />}
              label={
                <Typography variant="body2" component="span">
                  I confirm that I have read and understood the Company Recruitment Privacy Notice linked below. <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                </Typography>
              }
            />
            
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
               <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                 Click here to view our Recruitment Privacy Notice
               </Typography>
            </Box>

            <Typography variant="caption" color="textSecondary" display="block" mt={2} sx={{ lineHeight: 1.5 }}>
              Data Retention Statement: We will retain your application data for up to 6 months after the position is filled, for legitimate business purposes as described in the Privacy Notice. This allows us to consider you for similar opportunities and maintain records in compliance with legal requirements.
            </Typography>
          </Box>

          {/* Actions */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
            <Button variant="outlined" size="large" sx={{ px: 4, borderColor: 'divider', color: 'text.secondary' }}>
              Cancel
            </Button>
            <Button variant="contained" size="large" sx={{ px: 4 }} type="submit" disabled={!isFormValid}> {/* Add type="submit" and disabled prop */}
              Submit Application
            </Button>
          </Stack>

        </form> {/* Close form tag */}
        </Paper>
        <Typography variant="caption" align="center" display="block" mt={4} color="textSecondary">
          Having trouble with your application? Contact us at <span style={{ color: theme.palette.primary.main }}>careers@company.com</span>
        </Typography>
      </Container>
    </Box>
  )

}
