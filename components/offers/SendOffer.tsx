
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  TextField, 
  Button, 
  IconButton,
  InputAdornment,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Email as EmailIcon, 
  WhatsApp as WhatsAppIcon, 
  ContentCopy as CopyIcon,
  OpenInNew as OpenInNewIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { CandidateProfile } from '@/interface/candidate';

interface SendOfferProps {
  candidate: Partial<CandidateProfile>;
  offerId: string;
  offerToken: string;
  offerDetails: {
    position: string;
    company_name: string;
    reporting_to: string;
    commencement_date: string;
  };
  onBack: () => void;
}

export default function SendOffer({ candidate, offerId, offerToken, offerDetails, onBack }: SendOfferProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Calculate generic 3 days from now date
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  const formattedDueDate = threeDaysFromNow.toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const formattedStartDate = new Date(offerDetails.commencement_date).toLocaleDateString('en-GB', {
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // Email State
  const [emailTo, setEmailTo] = useState(candidate.email || '');
  const [emailCc, setEmailCc] = useState('');
  const [emailSubject, setEmailSubject] = useState(`Job Offer - ${offerDetails.position} - ${candidate.candidate_name || 'Candidate'}`);
  const magicLink = `${process.env.NEXT_PUBLIC_CANDIDATE_FRONTEND_DEV}?token=${offerToken}`;
  const emailBodyTemplate = `Dear ${candidate.candidate_name || 'Candidate'}
  

We are pleased to offer you the position of ${offerDetails.position} at ${offerDetails.company_name}. In this role, you will be reporting to the ${offerDetails.reporting_to}.

We have moved our onboarding process to a digital portal to make your transition smoother. You can now review your formal offer, salary breakdown, and complete your joining documents online:

Access Your Offer Portal Here: ${magicLink}

What you need to do next:

Review and acknowledge the Offer of Employment.

Complete the Digital Joining Form.

Upload your Guarantor Form and other required documents.

Please acknowledge your acceptance within 48 hours via the portal. We look forward to having all documentation completed by ${formattedDueDate}.

Congratulations once again! We are excited to welcome you to the team.

Best regards, HR Team, ${offerDetails.company_name}`;

  const [emailBody, setEmailBody] = useState(emailBodyTemplate);

  // WhatsApp State
  // "Dear [Candidate Name], we are pleased to offer you the [Position] role! Please view your formal offer and salary breakdown here: [Link]. We look forward to your response!"

  const initialWhatsAppMessage = `Dear ${candidate.candidate_name || 'Candidate'}, we are pleased to offer you the ${offerDetails.position} role! Please view your formal offer and salary breakdown here: ${magicLink} . We look forward to your response!`;
  
  const [whatsAppMessage, setWhatsAppMessage] = useState(initialWhatsAppMessage);


  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbarMessage('Copied to clipboard');
    setSnackbarOpen(true);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(emailSubject);
    const body = encodeURIComponent(emailBody);
    const cc = emailCc ? `&cc=${encodeURIComponent(emailCc)}` : '';
    
    window.location.href = `mailto:${emailTo}?subject=${subject}${cc}&body=${body}`;
  };

  const handleOpenWhatsApp = () => {
    // Use wa.me link
    // Assuming candidate.mobile_number is available. If not, generic link.
    // Need to strip non-numeric chars for phone number if used.
    let phoneParam = '';
    if(candidate.mobile_number) {
        const cleanNumber = candidate.mobile_number.replace(/\D/g, '');
        // potentially add country code if missing, but we'll assume it's mostly there or user handles it
        // If it starts with '0', typically replace with '234' for Nigeria as per context, but safe to just use as is or rely on user having it right.
        phoneParam = `phone=${cleanNumber}&`;
    }
    
    const text = encodeURIComponent(whatsAppMessage);
    window.open(`https://api.whatsapp.com/send?${phoneParam}text=${text}`, '_blank');
  };

  return (
    <Box sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
       {/* Header */}
       <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          borderBottom: '1px solid #eee',
          borderRadius: '8px 8px 0 0'
        }}
      >
        {/* <IconButton onClick={onBack} size="small">
            <ArrowBackIcon />
        </IconButton> */}
        <Typography variant="h6" fontWeight="bold">
            Send Offer
        </Typography>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="send offer method tabs">
          <Tab icon={<EmailIcon />} label="Email" iconPosition="start" />
          <Tab icon={<WhatsAppIcon />} label="WhatsApp" iconPosition="start" />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto', bgcolor: '#f9fafb' }}>
        
        {/* EMAIL TAB */}
        {activeTab === 0 && (
            <Paper elevation={0} sx={{ p: 3, maxWidth: 800, mx: 'auto', borderRadius: 2, border: '1px solid #e0e0e0' }}>
               <Box sx={{ display: 'grid', gap: 2 }}>
                    <TextField 
                        label="To" 
                        fullWidth 
                        value={emailTo} 
                        onChange={(e) => setEmailTo(e.target.value)}
                        size="small"
                    />
                    <TextField 
                        label="CC" 
                        fullWidth 
                        value={emailCc} 
                        onChange={(e) => setEmailCc(e.target.value)}
                        size="small"
                        placeholder="isabella.k@bajajnigeria.com"
                    />
                    <TextField 
                        label="Subject" 
                        fullWidth 
                        value={emailSubject} 
                        onChange={(e) => setEmailSubject(e.target.value)}
                        size="small"
                    />
                    
                    <Typography variant="subtitle2" sx={{ mt: 1, color: 'text.secondary' }}>
                        Message Body
                    </Typography>
                    <TextField 
                        fullWidth 
                        multiline
                        minRows={15}
                        value={emailBody} 
                        onChange={(e) => setEmailBody(e.target.value)}
                        sx={{ 
                            bgcolor: '#fff',
                            '& .MuiInputBase-root': {
                                fontFamily: 'monospace',
                                fontSize: '0.875rem'
                            }
                         }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
                        <Button 
                            variant="outlined" 
                            startIcon={<CopyIcon />}
                            onClick={() => handleCopy(emailBody)}
                        >
                            Copy Content
                        </Button>
                        <Button 
                            variant="contained" 
                            endIcon={<SendIcon />}
                            onClick={handleSendEmail}
                        >
                            Open in Default Mail App
                        </Button>
                    </Box>
               </Box>
            </Paper>
        )}

        {/* WHATSAPP TAB */}
        {activeTab === 1 && (
             <Paper elevation={0} sx={{ p: 3, maxWidth: 600, mx: 'auto', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <WhatsAppIcon sx={{ fontSize: 48, color: '#25D366', mb: 2 }} />
                    <Typography variant="h6">Send via WhatsApp</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Send the offer link directly to {candidate.candidate_name || 'Candidate'}'s WhatsApp.
                    </Typography>
                </Box>

                <TextField 
                    label="Message"
                    fullWidth
                    multiline
                    minRows={6}
                    value={whatsAppMessage}
                    onChange={(e) => setWhatsAppMessage(e.target.value)}
                    helperText="You can edit this message before sending"
                    sx={{ mb: 3 }}
                />

                <Box sx={{ bgcolor: '#f0fdf4', p: 2, borderRadius: 1, mb: 3, border: '1px dashed #25D366' }}>
                    <Typography variant="caption" fontWeight="bold" color="success.main">
                        LINK INCLUDED
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all', mt: 0.5, fontFamily: 'monospace' }}>
                        {magicLink}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button 
                        fullWidth
                        variant="contained" 
                        size="large"
                        sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#128C7E' } }}
                        startIcon={<WhatsAppIcon />}
                        onClick={handleOpenWhatsApp}
                    >
                        Share via WhatsApp
                    </Button>
                     <Button 
                        fullWidth
                        variant="outlined" 
                        color="inherit"
                        startIcon={<CopyIcon />}
                        onClick={() => handleCopy(whatsAppMessage)}
                    >
                        Copy Message
                    </Button>
                </Box>
             </Paper>
        )}

      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
