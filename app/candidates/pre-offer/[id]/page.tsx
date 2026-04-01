"use client";

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Divider, Stack, Checkbox,
    FormControlLabel, IconButton, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { callFetchPreOfferDocs, callSavePreOfferDocs, callSendPreOfferDocs, callUpdatePreOfferDocStatus } from '@/redux/slices/offer';
import { callUpdateCandidateStatus, fetchSingleCandidate } from '@/redux/slices/candidates';
import { getCandidateDocuments } from '@/api/candidate';
import { enqueueSnackbar } from 'notistack';

const STANDARD_DOCUMENTS = [
    {
        id: 'employment_record_proof',
        displayName: "Employment Record Proof",
        status: 'awaiting_upload',
        type: 'standard',
        url: null
    }
];

const PreOfferVerificationPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const dispatch = useDispatch<any>();

    const { selectedCandidate } = useSelector((state: RootState) => state.candidates);
    const { preOfferDocs, preOfferToken } = useSelector((state: RootState) => state.offers);

    // Determine which docs to show/use
    const currentDocs = preOfferDocs && preOfferDocs.length > 0 ? preOfferDocs : STANDARD_DOCUMENTS;

    const verificationLink = preOfferToken ? `${process.env.NEXT_PUBLIC_CANDIDATE_FRONTEND_DEV}/?token=${preOfferToken}` : '';

    // UI State
    const [copied, setCopied] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [commChannel, setCommChannel] = useState('email');


    useEffect(() => {
        if (id) {
            if (!selectedCandidate || selectedCandidate.candidate_id !== id) {
                fetchSingleCandidate(id);
            }
            callFetchPreOfferDocs(id);
        }
    }, [id]);

    const handleAddItem = async () => {
        if (!newItemName || !selectedCandidate) return;

        const newDocId = newItemName.trim().toLowerCase().replace(/\s+/g, '_');

        const newDoc = {
            id: newDocId,
            displayName: newItemName,
            status: 'awaiting_upload',
            type: 'standard',
            url: null
        };

        // Use currentDocs as base so we include standard docs if this is the first add
        const updatedDocs = [...currentDocs, newDoc];

        const payload = {
            candidateId: id,
            requisitionId: selectedCandidate.requisition_id || '',
            requestedDocs: updatedDocs as any
        };

        await dispatch(callSavePreOfferDocs(payload));
        setNewItemName('');
        setOpenAddModal(false);
    };

    const handleGenerateLink = async () => {
        if (!selectedCandidate) return;
        const payload = {
            candidateId: id,
            requisitionId: selectedCandidate.requisition_id || '',
            requestedDocs: currentDocs as any
        };
        await callSavePreOfferDocs(payload);
    };

    const handleCopyLink = () => {
        if (!verificationLink) return;
        navigator.clipboard.writeText(verificationLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUpdateStatus = async (docId: string, status: string, docUrl: string) => {
        await callUpdatePreOfferDocStatus(docId, status, id, docUrl);
    };

    const allApproved = currentDocs.length > 0 && currentDocs.every((d: any) => d.status === 'approved');

    const handleBeginInternalSalaryProposal = async () => {
        // we want to update the user status to internal_salary_proposal before we push them to the page 
        const payload = {
            candidate_id: id,
            requisition_id: selectedCandidate?.requisition_id,
            current_status: 'internal_salary_proposal',
            old_status: 'pre_offer',
            new_status: 'internal_salary_proposal'
        };
        await callUpdateCandidateStatus(payload);
        router.push(`/candidates/internal-salary-proposal/${id}`);
    };

    const handleSendRequest = async () => {
        if (commChannel === 'email') {
            await callSendPreOfferDocs({
                candidateId: id,
                requisitionId: selectedCandidate?.requisition_id,
                requestedDocs: currentDocs as any,
                link: verificationLink
            });
        } else {
            enqueueSnackbar(
                'Copy the portal link above and share it with the candidate on WhatsApp. Their contact details are on their profile.',
                { variant: 'info', autoHideDuration: 6000 }
            );
        }
    }

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
                    <Typography variant="body2" color="text.secondary">{selectedCandidate?.candidate_name} • {selectedCandidate?.role_applied_for}  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        sx={{ textTransform: 'none', fontWeight: 600, bgcolor: 'white' }}
                        onClick={handleGenerateLink}
                    >
                        Generate Pre Offer Link
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                        onClick={handleBeginInternalSalaryProposal}
                        disabled={!allApproved}
                    >
                        All Documents Verified - Begin Internal Salary Proposal Process
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
                            {currentDocs.map((doc: any) => (
                                <FormControlLabel
                                    key={doc.id}
                                    control={<Checkbox defaultChecked={true} size="small" />}
                                    label={<Typography variant="body2">{doc.displayName}</Typography>}
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
                                    Dear {selectedCandidate?.candidate_name},<br /><br />
                                    To proceed with your offer for the {selectedCandidate?.role_applied_for} position, please upload the following documents using the secure portal link below:
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#F0F9FF', p: 1.5, borderRadius: 1, border: '1px solid', borderColor: '#BAE6FD', mb: 2 }}>
                                    <Typography variant="caption" sx={{ flex: 1, fontFamily: 'monospace', color: 'primary.main', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {verificationLink || 'Generate link to see URL...'}
                                    </Typography>
                                    <IconButton size="small" onClick={handleCopyLink} color={copied ? "success" : "default"} disabled={!verificationLink}>
                                        {copied ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                                    </IconButton>
                                </Box>

                                <Typography variant="caption" color="text.secondary">
                                    Please complete this by EOD {dayjs().add(3, 'days').format('dddd')}.
                                </Typography>
                            </Box>
                            {preOfferToken && (
                                <Button variant="contained" onClick={handleSendRequest} fullWidth sx={{ mt: 2, textTransform: 'none' }} disabled={!preOfferToken}>
                                    {commChannel === 'email' ? 'Send Email Request' : 'Send WhatsApp Message'}
                                </Button>
                            )}
                        </Box>
                    </Paper>
                </Box>

                {/* Right Column: Status & Preview */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Paper elevation={0} sx={{ flex: 1, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary">Total Requested</Typography>
                            <Typography variant="h4" fontWeight={700}>{currentDocs.length}</Typography>
                        </Paper>
                        <Paper elevation={0} sx={{ flex: 1, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary">Uploaded</Typography>
                            <Typography variant="h4" fontWeight={700}>{currentDocs.filter((d: any) => d.url || (d.status !== 'awaiting_upload' && d.status !== 'missing')).length}</Typography>
                        </Paper>
                        <Paper elevation={0} sx={{
                            flex: 1, p: 2, border: '1px solid',
                            borderColor: allApproved ? 'success.light' : 'warning.light',
                            bgcolor: allApproved ? '#E6F4EA' : '#FFF8E1',
                            borderRadius: 2
                        }}>
                            <Typography variant="caption" color={allApproved ? "success.main" : "warning.dark"} fontWeight={700}>Verification Status</Typography>
                            <Typography variant="h5" fontWeight={700} color={allApproved ? "success.dark" : "warning.dark"}>{allApproved ? "Ready for Internal Approval" : "Pending Verification"}</Typography>
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
                            {currentDocs.map((doc: any, index: number) => (
                                <Box key={doc.id} sx={{
                                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                                    gap: 2, alignItems: 'center',
                                    px: 2, py: 2.5,
                                    borderBottom: index !== currentDocs.length - 1 ? '1px solid' : 'none',
                                    borderColor: 'divider'
                                }}>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Box sx={{ p: 1, bgcolor: '#F0F2F5', borderRadius: 1, color: 'text.secondary' }}>
                                            <PictureAsPdfIcon />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>{doc.url ? 'Document Uploaded' : 'Pending Upload...'}</Typography>
                                            <Typography variant="caption" color="text.secondary">{doc.displayName}</Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary">
                                        {doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString() : "-"}
                                    </Typography>

                                    <Box>
                                        {doc.status === 'approved' && <Chip label="Approved" size="small" color="success" icon={<CheckCircleIcon />} sx={{ fontWeight: 600, bgcolor: '#E6F4EA', color: '#1E4620' }} />}
                                        {doc.status === 'pending_review' && <Chip label="Pending Review" size="small" color="primary" icon={<PendingIcon />} sx={{ fontWeight: 600, bgcolor: '#E3F2FD', color: '#0D47A1' }} />}
                                        {(doc.status === 'missing' || doc.status === 'awaiting_upload') && <Chip label="Awaiting Upload" size="small" color="default" sx={{ fontWeight: 600 }} />}
                                        {doc.status === 'rejected' && <Chip label="Rejected" size="small" color="error" icon={<CancelIcon />} sx={{ fontWeight: 600 }} />}
                                    </Box>

                                    <Box sx={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => getCandidateDocuments(doc.url)}
                                            // onClick={() => doc.url && window.open(doc.url, '_blank')}
                                            disabled={!doc.url}
                                        >
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="success"
                                            onClick={() => handleUpdateStatus(doc.id, 'approved', doc.url)}
                                            disabled={!doc.url || doc.status === 'approved'}
                                        >
                                            <CheckCircleIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleUpdateStatus(doc.id, 'rejected', doc.url)}
                                            disabled={!doc.url || doc.status === 'rejected'}
                                        >
                                            <CancelIcon fontSize="small" />
                                        </IconButton>
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
