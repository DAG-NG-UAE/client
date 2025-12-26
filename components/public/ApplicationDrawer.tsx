"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stack,
  Divider,
  Drawer,
  IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { Requisition } from '@/interface/requisition';
import { apply } from '@/api/candidate';
import { enqueueSnackbar } from 'notistack';

// Reusable Form Input Component (Internal to this file for now)
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
  value = '',
  disabled = false,
  onChange
}) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#101828' }}>
      {label} {required && <Box component="span" sx={{ color: '#d32f2f' }}>*</Box>}
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
      disabled={disabled}
      onChange={onChange}
      InputProps={{
        sx: { 
          borderRadius: 2, 
          backgroundColor: '#ffffff',
          color: '#101828',
          '& .MuiOutlinedInput-notchedOutline': {
             borderColor: 'rgba(0,0,0,0.2)'
          }
        }
      }}
    />
  </Box>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#101828' }}>
    {title}
  </Typography>
);

interface ApplicationDrawerProps {
  open: boolean;
  onClose: () => void;
  careerDetails: Partial<Requisition>;
  requisitionId: string;
}

export default function ApplicationDrawer({ open, onClose, careerDetails, requisitionId }: ApplicationDrawerProps) {
  // Form field states
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false); // State to manage submission status
  
  const [availability, setAvailability] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [source, setSource] = useState('');
  const [otherSource, setOtherSource] = useState('');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setCvFile(files[0]);
    } else {
      setCvFile(null);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setCvFile(event.dataTransfer.files[0]);
    }
  };

  const isFormValid =
    fullName !== '' &&
    emailAddress !== '' &&
    phoneNumber !== '' &&
    availability !== '' &&
    experience !== '' &&
    location !== '' &&
    expectedSalary !== '' &&
    cvFile !== null &&
    privacyConsent &&
    source !== '' &&
    (source === 'Other' ? otherSource !== '' : true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      enqueueSnackbar('Please fill all required fields and accept the privacy notice.', {variant: 'error'})
      return;
    }

    setSubmitting(true); // Disable button on submit

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('emailAddress', emailAddress);
    formData.append('phoneNumber', phoneNumber);
    formData.append('availability', availability);
    formData.append('experience', experience);
    formData.append('expectedSalary', expectedSalary);
    formData.append('coverLetter', coverLetter);
    formData.append('privacyConsent', String(privacyConsent));
    formData.append('source', source === 'Other' ? otherSource : source);
    if (careerDetails.position) {
      formData.append('position', careerDetails.position);
    }
    if (careerDetails.department) {
      formData.append('department', careerDetails.department);
    }
    if (cvFile) {
      formData.append('cvFile', cvFile, cvFile.name);
    }
    formData.append('requisitionPositionSlot', location);

    try {
      await apply(formData, requisitionId);
      enqueueSnackbar('You will be contacted if you are shortlisted!', { variant: 'success'})
      setFullName('');
      setEmailAddress('');
      setPhoneNumber('');
      setAvailability('');
      setExperience('');
      setExpectedSalary('');
      setCoverLetter('');
      setPrivacyConsent(false);
      setCvFile(null); // Clear the file state
      setLocation('');
      setSource('');
      setOtherSource('');
      onClose(); // Close drawer on success
      // Reset form could be here
    } catch (error) {
      console.error('Error submitting form:', error);
      enqueueSnackbar('There was an error submitting your form!', { variant: 'info'})
    } finally {
      setSubmitting(false); // Re-enable button after submission attempt
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', md: 600 },
          bgcolor: '#ffffff', // Force White
          color: '#101828',   // Force Black text
          p: 0
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: '#e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#ffffff' }}>
          <Typography variant="h6" fontWeight="bold" color="#101828">Apply for {careerDetails.position}</Typography>
          <IconButton onClick={onClose} sx={{ color: '#666' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 4, bgcolor: '#ffffff' }}>
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <Box mb={4}>
              <SectionHeader title="Personal Information" />
                <FormInput label="Full Name" required placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <FormInput label="Email Address" required placeholder="john.doe@email.com" type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
                <FormInput label="Phone Number" required placeholder="(555) 123-4567" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <FormInput label="Position Applied For" required disabled={true} value={careerDetails.position || ''} />
            </Box>

            <Divider sx={{ my: 4, borderColor: '#e0e0e0' }} />

            {/* Application Details */}
            <Box mb={4}>
              <SectionHeader title="Application Details" />
              
              {/* Resume Upload */}
              <Box mb={3}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#101828' }}>
                  CV/Resume <span style={{ color: '#d32f2f' }}>*</span>
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: '#ccc',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: '#f8f9fa',
                    '&:hover': { bgcolor: '#f0f0f0', borderColor: '#155dfc' }
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('cv-upload-input')?.click()}
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
                      <Typography variant="body1" color="#101828">{cvFile.name}</Typography>
                      <Button size="small" onClick={(e) => { e.stopPropagation(); setCvFile(null); }}>Remove</Button>
                    </Stack>
                  ) : (
                    <>
                      <CloudUploadIcon sx={{ fontSize: 40, color: '#666', mb: 1 }} />
                      <Typography variant="body2" color="#666">
                        Click to upload or drag and drop
                      </Typography>
                    </>
                  )}
                  <Typography variant="caption" color="#888" display="block" mt={0.5}>
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </Typography>
                </Box>
              </Box>

              <FormInput label="Expected Salary" required placeholder="e.g., $120,000 - $140,000" value={expectedSalary} onChange={(e) => setExpectedSalary(e.target.value)} />

              <Box mb={3}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#101828' }}>
                  Experience <span style={{ color: '#d32f2f' }}>*</span>
                </Typography>
                <Select
                  fullWidth
                  displayEmpty
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  sx={{ 
                    borderRadius: 2, 
                    bgcolor: '#ffffff',
                    color: '#101828',
                    '& .MuiOutlinedInput-notchedOutline': {
                       borderColor: 'rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  <MenuItem value="" disabled>
                    <Typography color="#888">Select experience</Typography>
                  </MenuItem>
                  <MenuItem value="0-6months">0-6 Months</MenuItem>
                  <MenuItem value="1-3years">1-3 years</MenuItem>
                  <MenuItem value="4-8years">4-8 years</MenuItem>
                  <MenuItem value="10+years">10+ years</MenuItem>
                  <MenuItem value="20+years">20+ years</MenuItem>
                </Select>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#101828' }}>
                  Availability to Join <span style={{ color: '#d32f2f' }}>*</span>
                </Typography>
                <Select
                  fullWidth
                  displayEmpty
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  sx={{ 
                    borderRadius: 2, 
                    bgcolor: '#ffffff',
                    color: '#101828',
                    '& .MuiOutlinedInput-notchedOutline': {
                       borderColor: 'rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  <MenuItem value="" disabled>
                    <Typography color="#888">Select availability</Typography>
                  </MenuItem>
                  <MenuItem value="immediate">Immediately</MenuItem>
                  <MenuItem value="2weeks">2 Weeks Notice</MenuItem>
                  <MenuItem value="1month">1 Month Notice</MenuItem>
                  <MenuItem value="3month">3 Month Notice</MenuItem>
                </Select>
              </Box>

              <Box mb={3}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#101828' }}>
                      Select Location <span style={{ color: '#d32f2f' }}>*</span>
                  </Typography>
                  <Select
                    fullWidth
                    displayEmpty
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    sx={{ 
                      borderRadius: 2, 
                      bgcolor: '#ffffff',
                      color: '#101828',
                      '& .MuiOutlinedInput-notchedOutline': {
                       borderColor: 'rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      <Typography color="#888">Select Location</Typography>
                    </MenuItem>
                    {careerDetails.requisition_positions?.map((loc) => (
                      <MenuItem key={loc.position_slot_id} value={loc.position_slot_id}>{loc.location}</MenuItem>
                    ))}
                  </Select>
              </Box>

              <Box mb={3}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#101828' }}>
                      How did you hear about us? <span style={{ color: '#d32f2f' }}>*</span>
                  </Typography>
                  <Select
                    fullWidth
                    displayEmpty
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    sx={{ 
                      borderRadius: 2, 
                      bgcolor: '#ffffff',
                      color: '#101828',
                      '& .MuiOutlinedInput-notchedOutline': {
                       borderColor: 'rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    <MenuItem value="" disabled>
                      <Typography color="#888">Select Source</Typography>
                    </MenuItem>
                    <MenuItem value="Career Website">Career Website</MenuItem>
                    <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                    <MenuItem value="Job Mag">Job Mag</MenuItem>
                    <MenuItem value="Indeed">Indeed</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
              </Box>

              {source === 'Other' && (
                <FormInput 
                  label="Please specify" 
                  required 
                  placeholder="e.g., Friend, Google Search"
                  value={otherSource}
                  onChange={(e) => setOtherSource(e.target.value)}
                />
              )}

              <FormInput 
                label="Cover Letter (Optional)" 
                placeholder="Tell us why you're interested..."
                multiline
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </Box>

            <Divider sx={{ my: 4, borderColor: '#e0e0e0' }} />

            {/* Privacy */}
            <Box mb={4}>
              <SectionHeader title="Privacy & Data Protection" />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={privacyConsent} 
                    onChange={(e) => setPrivacyConsent(e.target.checked)} 
                    sx={{ color: '#155dfc', '&.Mui-checked': { color: '#155dfc' } }}
                  />
                }
                label={
                  <Typography variant="body2" color="#101828">
                    I confirm that I have read and understood the Company Recruitment Privacy Notice. <Box component="span" sx={{ color: '#d32f2f' }}>*</Box>
                  </Typography>
                }
              />
              <Typography variant="caption" color="#666" display="block" mt={2} sx={{ lineHeight: 1.5 }}>
                Data will be retained for 6 months.
              </Typography>
            </Box>

            {/* Footer Actions */}
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="contained" 
                size="large" 
                fullWidth 
                type="submit" 
                disabled={!isFormValid || submitting}
                sx={{ 
                  py: 1.5, 
                  bgcolor: '#155dfc', 
                  '&:hover': { bgcolor: '#0F4DBA' },
                  '&:disabled': { bgcolor: '#e0e0e0' }
                }}
              >
                Submit Application
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Drawer>
  );
}
