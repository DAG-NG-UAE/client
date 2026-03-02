import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Select,
    FormControl, InputLabel, MenuItem, CircularProgress, Typography, Paper, Radio,
    RadioGroup, FormControlLabel, FormLabel, Chip
} from '@mui/material';
import { CandidateProfile } from '@/interface/candidate';
import { callUpdateCandidateStatus, fetchAllCandidates, fetchSingleCandidate } from '@/redux/slices/candidates';
import { getTemplateType } from '@/api/emailTemplate';

interface EmailTemplate {
    id: number;
    slug: string;
    name: string;
    description: string;
    subject: string;
    body: string;
    is_active: boolean;
    category: string;
}

interface CandidateRejectionModalProps {
    open: boolean;
    onClose: () => void;
    candidate: Partial<CandidateProfile> | null;
}

export const CandidateRejectionModal: React.FC<CandidateRejectionModalProps> = ({ open, onClose, candidate }) => {
    const [step, setStep] = useState(0); // 0: Reason, 1: Email Template
    const [reason, setReason] = useState('');
    const [comments, setComments] = useState('');

    // Step 2 State
    const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
    const [loadingTemplates, setLoadingTemplates] = useState(false);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (open) {
            setStep(0);
            setReason('');
            setComments('');
            setSelectedTemplate(null);
            setEmailTemplates([]);
        }
    }, [open]);

    const handleNext = async () => {
        if (step === 0) {
            setStep(1);
            fetchEmailTemplates();
        }
    };

    const handleBack = () => {
        setStep(0);
    };

    const fetchEmailTemplates = async () => {
        setLoadingTemplates(true);
        try {
            const response = await getTemplateType('reject_candidate');
            // response.data contains the array of templates based on user provided JSON
            const templates: EmailTemplate[] = response.data || [];
            setEmailTemplates(templates);

            // Logic to select recommended template
            // If status is applied or shortlisted -> rejection_early
            // Else -> rejection_interview
            const currentStatus = candidate?.current_status?.toLowerCase();
            const isEarlyStage = currentStatus === 'applied' || currentStatus === 'shortlisted';

            const recommendedSlug = isEarlyStage ? 'rejection_early' : 'rejection_interview';
            const recommended = templates.find(t => t.slug === recommendedSlug);

            if (recommended) {
                setSelectedTemplate(recommended);
            } else if (templates.length > 0) {
                setSelectedTemplate(templates[0]);
            }
        } catch (error) {
            console.error("Failed to fetch email templates", error);
        } finally {
            setLoadingTemplates(false);
        }
    };

    const handleReject = () => {
        // combine reason and comments if "Other" is selected, otherwise just use reason
        const actualReason = reason === 'Other' ? comments : reason;

        //get the parameters to send to the api
        const params = {
            candidate_id: candidate?.candidate_id,
            requisition_id: candidate?.requisition_id,
            email: candidate?.email,
            old_status: candidate?.current_status, 
            new_status: "rejected",
            current_status: "rejected",
            rejection_reason: actualReason,
            emailTemplateId: selectedTemplate?.id
        };

        //call the update candidate slice 
        callUpdateCandidateStatus(params);
        console.log(`Rejecting candidate ${candidate?.candidate_id} with reason: ${actualReason} and template: ${selectedTemplate?.name}`);
        if(candidate?.candidate_id){
            fetchSingleCandidate(candidate?.candidate_id);
        }
        // get the candidates who are in the stage the candidate was in previously 
        
        onClose();
    };

    const isStep1Valid = !!reason && (reason !== 'Other' || !!comments);
    const isStep2Valid = !!selectedTemplate;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {step === 0 ? "Reason for Rejection" : "Select Rejection Email"}
            </DialogTitle>
            <DialogContent>
                {step === 0 ? (
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel id="rejection-reason-label">Reason</InputLabel>
                            <Select
                                labelId="rejection-reason-label"
                                value={reason}
                                label="Reason"
                                onChange={(e) => setReason(e.target.value)}
                            >
                                <MenuItem value="technical misfit">Technical Misfit</MenuItem>
                                <MenuItem value="cultural fit">Cultural Fit</MenuItem>
                                <MenuItem value="salary expectations">Salary Expectations</MenuItem>
                                <MenuItem value="role closed">Role Closed</MenuItem>
                                <MenuItem value="better candidate found">Better Candidate Found</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>

                        {reason === 'Other' && (
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Rejection Reason"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Please provide a reason for rejecting this candidate..."
                            />
                        )}
                    </Box>
                ) : (
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {loadingTemplates ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {/* Template List */}
                                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Choose a template</FormLabel>
                                        <RadioGroup
                                            value={selectedTemplate?.slug || ''}
                                            onChange={(e) => {
                                                const selected = emailTemplates.find(t => t.slug === e.target.value);
                                                if (selected) setSelectedTemplate(selected);
                                            }}
                                        >
                                            {emailTemplates.map((template) => {
                                                const currentStatus = candidate?.current_status?.toLowerCase();
                                                const isEarlyStage = currentStatus === 'applied' || currentStatus === 'shortlisted';
                                                const isRecommended = (isEarlyStage && template.slug === 'rejection_early') ||
                                                    (!isEarlyStage && template.slug === 'rejection_interview');

                                                return (
                                                    <Paper
                                                        key={template.id}
                                                        variant="outlined"
                                                        sx={{
                                                            mb: 1,
                                                            p: 1,
                                                            border: isRecommended ? '2px solid #1976d2' : '1px solid rgba(0, 0, 0, 0.12)',
                                                            position: 'relative'
                                                        }}
                                                    >
                                                        <FormControlLabel
                                                            value={template.slug}
                                                            control={<Radio />}
                                                            label={
                                                                <Box>
                                                                    <Typography variant="subtitle2">{template.name}</Typography>
                                                                    {isRecommended && (
                                                                        <Chip
                                                                            label="Recommended"
                                                                            color="primary"
                                                                            size="small"
                                                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                            }
                                                        />
                                                    </Paper>
                                                );
                                            })}
                                        </RadioGroup>
                                    </FormControl>
                                </Box>

                                {/* Template Preview */}
                                <Box sx={{ width: '60%', p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                                    <Typography variant="h6" gutterBottom>Preview</Typography>
                                    {selectedTemplate ? (
                                        <>
                                            <Typography variant="subtitle2" color="text.secondary">Subject:</Typography>
                                            <Typography variant="body2" paragraph sx={{ fontWeight: 500 }}>
                                                {selectedTemplate.subject.replace('{{job_title}}', candidate?.role_applied_for || 'Role')}
                                            </Typography>

                                            <Typography variant="subtitle2" color="text.secondary">Body:</Typography>
                                            <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                                                {selectedTemplate.body
                                                    .replace('{{candidate_name}}', candidate?.candidate_name || 'Candidate')
                                                    .replace('{{job_title}}', candidate?.role_applied_for || 'Role')
                                                    .replace(/\\n/g, '\n')}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">Select a template to preview</Typography>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                {step === 0 ? (
                    <>
                        <Button onClick={onClose} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleNext}
                            variant="contained"
                            color="primary"
                            disabled={!isStep1Valid}
                        >
                            Next
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={handleBack} color="inherit">
                            Back
                        </Button>
                        <Button
                            onClick={handleReject}
                            variant="contained"
                            color="error"
                            disabled={!isStep2Valid}
                        >
                            Confirm Reject
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};