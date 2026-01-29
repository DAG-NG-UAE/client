"use client";

import React, { useState } from 'react';
import { 
    Box, Typography, Button, Paper, Divider, Stack, Checkbox, 
    FormControlLabel, IconButton, Chip, Dialog, DialogTitle, 
    DialogContent, DialogActions, TextField, ToggleButton, ToggleButtonGroup 
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// Mock Data for UI Skeleton
const MOCK_DOCUMENTS = [
    { id: 1, name: "ID Proof (Passport/National ID)", required: true, uploaded: true, status: 'approved', fileName: "Passport_AlexRivera.pdf", date: "Sep 12, 2024" },
    { id: 2, name: "Previous 3 Months Pay Slips", required: true, uploaded: true, status: 'approved', fileName: "Payslips_Combined.pdf", date: "Sep 12, 2024" },
    { id: 3, name: "Degree Certificate & Transcripts", required: true, uploaded: true, status: 'approved', fileName: "Master_Degree_Original.png", date: "Sep 13, 2024" },
    { id: 4, name: "Background Check Consent Form", required: true, uploaded: true, status: 'pending', fileName: "BG_Consent_Signed.pdf", date: "Sep 13, 2024" },
    { id: 5, name: "Signed NDA & Ethics Agreement", required: false, uploaded: false, status: 'missing', fileName: null, date: null },
];

const PreOfferVerificationPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    
    // UI State
    const [copied, setCopied] = useState(false);
    const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [commChannel, setCommChannel] = useState('email');

    const handleAddItem = () => {
        if (!newItemName) return;
        const newDoc = { 
            id: Date.now(), 
            name: newItemName, 
            required: true, 
            uploaded: false, 
            status: 'missing', 
            fileName: null, 
            date: null 
        };
        // Just for UI demo, strictly mapped types would be needed in real app
        setDocuments([...documents, newDoc as any]); 
        setNewItemName('');
        setOpenAddModal(false);
    };

    const handleCopyLink = () => {
        const link = `https://recruit.pro/verify/${id}`; // Mock link
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Box sx={{ bgcolor: '#F5F6F8', minHeight: '100vh', p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                     <Button 
                        startIcon={<ArrowBackIcon />} 
                        onClick={() => router.back()}
                        sx={{ textTransform: 'none', color: 'text.secondary', mb: 1, fontWeight: 600 }}
                    >
                        Back to Evaluation
                    </Button>
                    <Typography variant="h4" fontWeight={700}>Pre-Offer Document Verification</Typography>
                    <Typography variant="body2" color="text.secondary">Alex Rivera • HR-2024-092 (Senior Product Manager)</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" sx={{ textTransform: 'none', fontWeight: 600, bgcolor: 'white' }}>Save Draft</Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                        onClick={() => router.push(`/candidates/offer/${id}`)}
                    >
                        All Documents Verified - Generate Offer
                    </Button>
                </Box>
            </Box>

            {/* Content Grid */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
                
                {/* Left Column: Request Configuration */}
                <Box sx={{ width: { lg: 380 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            Request Documents
                        </Typography>
                        
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                            STANDARD DOCUMENTS CHECKLIST
                        </Typography>

                        <Stack spacing={1}>
                            {documents.map(doc => (
                                <FormControlLabel 
                                    key={doc.id}
                                    control={<Checkbox defaultChecked={doc.required} size="small" />} 
                                    label={<Typography variant="body2">{doc.name}</Typography>} 
                                />
                            ))}
                            <Button 
                                startIcon={<AddIcon />} 
                                size="small" 
                                onClick={() => setOpenAddModal(true)}
                                sx={{ textTransform: 'none', fontWeight: 600, justifyContent: 'flex-start', mt: 1 }}
                            >
                                Add new item
                            </Button>
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        {/* Communication Channel */}
                        <Box>
                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                               <Typography variant="caption" fontWeight={700} color="text.secondary">
                                    COMMUNICATION CHANNEL
                                </Typography> 
                                <ToggleButtonGroup
                                    value={commChannel}
                                    exclusive
                                    onChange={(e, val) => val && setCommChannel(val)}
                                    size="small"
                                    sx={{ height: 28 }}
                                >
                                    <ToggleButton value="email" sx={{ textTransform: 'none', fontSize: '0.75rem', px: 2 }}>Email</ToggleButton>
                                    <ToggleButton value="whatsapp" sx={{ textTransform: 'none', fontSize: '0.75rem', px: 2 }}>WhatsApp</ToggleButton>
                                </ToggleButtonGroup>
                           </Box>

                           <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Typography variant="body2" fontWeight={700} color="text.secondary">Message Preview</Typography>
                                    <Chip label="Dynamic Template" size="small" sx={{ height: 20, bgcolor: '#E0E7FF', color: '#4338CA', fontSize: '0.65rem', fontWeight: 600 }} />
                                </Box>
                                <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                                    Dear Alex,<br/><br/>
                                    To proceed with your offer for the Senior Product Manager position, please upload the following documents using the secure portal link below:
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#F0F9FF', p: 1.5, borderRadius: 1, border: '1px solid', borderColor: '#BAE6FD', mb: 2 }}>
                                    <Typography variant="caption" sx={{ flex: 1, fontFamily: 'monospace', color: 'primary.main', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        https://recruit.pro/verify/ax-9283-r7
                                    </Typography>
                                    <IconButton size="small" onClick={handleCopyLink} color={copied ? "success" : "default"}>
                                        {copied ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                                    </IconButton>
                                </Box>
                                
                                <Typography variant="caption" color="text.secondary">
                                    Please complete this by EOD Thursday.
                                </Typography>
                           </Box>
                           <Button variant="contained" fullWidth sx={{ mt: 2, textTransform: 'none' }}>
                               {commChannel === 'email' ? 'Send Email Request' : 'Send WhatsApp Message'}
                           </Button>
                        </Box>
                    </Paper>
                </Box>

                {/* Right Column: Status & Preview */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Paper elevation={0} sx={{ flex: 1, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary">Total Requested</Typography>
                            <Typography variant="h4" fontWeight={700}>5</Typography>
                        </Paper>
                         <Paper elevation={0} sx={{ flex: 1, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary">Uploaded</Typography>
                             <Typography variant="h4" fontWeight={700}>4</Typography>
                        </Paper>
                        <Paper elevation={0} sx={{ flex: 1, p: 2, border: '1px solid', borderColor: 'success.light', bgcolor: '#E6F4EA', borderRadius: 2 }}>
                            <Typography variant="caption" color="success.main" fontWeight={700}>Verification Status</Typography>
                            <Typography variant="h5" fontWeight={700} color="success.dark">Ready for Offer</Typography>
                        </Paper>
                    </Box>

                    {/* Document List */}
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                             <Typography variant="subtitle1" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircleIcon color="primary" fontSize="small" /> Candidate Uploads & Verification
                            </Typography>
                            <Button size="small" sx={{ textTransform: 'none' }}>Refresh Queue</Button>
                        </Box>

                        <Stack spacing={0}>
                            {/* Header Row */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', px: 2, py: 1, bgcolor: '#F8F9FA', borderRadius: 1 }}>
                                <Typography variant="caption" fontWeight={700} color="text.secondary">DOCUMENT NAME</Typography>
                                <Typography variant="caption" fontWeight={700} color="text.secondary">UPLOAD DATE</Typography>
                                <Typography variant="caption" fontWeight={700} color="text.secondary">STATUS</Typography>
                                <Typography variant="caption" fontWeight={700} color="text.secondary" align="right">ACTIONS</Typography>
                            </Box>
                            
                            {/* Rows */}
                            {MOCK_DOCUMENTS.map((doc, index) => (
                                <Box key={doc.id} sx={{ 
                                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', 
                                    gap: 2, alignItems: 'center', 
                                    px: 2, py: 2.5, 
                                    borderBottom: index !== MOCK_DOCUMENTS.length - 1 ? '1px solid' : 'none',
                                    borderColor: 'divider'
                                }}>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Box sx={{ p: 1, bgcolor: '#F0F2F5', borderRadius: 1, color: 'text.secondary' }}>
                                            <PictureAsPdfIcon />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>{doc.fileName || "Pending Upload..."}</Typography>
                                            <Typography variant="caption" color="text.secondary">{doc.name}</Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary">{doc.date || "-"}</Typography>

                                    <Box>
                                        {doc.status === 'approved' && <Chip label="Approved" size="small" color="success" icon={<CheckCircleIcon />} sx={{ fontWeight: 600, bgcolor: '#E6F4EA', color: '#1E4620' }} />}
                                        {doc.status === 'pending' && <Chip label="Pending Review" size="small" color="primary" icon={<PendingIcon />} sx={{ fontWeight: 600, bgcolor: '#E3F2FD', color: '#0D47A1' }} />}
                                        {doc.status === 'missing' && <Chip label="Missing" size="small" color="default" sx={{ fontWeight: 600 }} />}
                                    </Box>

                                    <Box sx={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" color="success"><CheckCircleIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" color="error"><CancelIcon fontSize="small" /></IconButton>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Box>
            </Box>
            {/* Add Document Dialog */}
            <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Add New Document</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Specify the name of the document you want to request from the candidate.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Document Name"
                        fullWidth
                        variant="outlined"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenAddModal(false)} color="inherit" sx={{ textTransform: 'none' }}>Cancel</Button>
                    <Button onClick={handleAddItem} variant="contained" disabled={!newItemName} sx={{ textTransform: 'none' }}>
                        Add Item
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PreOfferVerificationPage;
