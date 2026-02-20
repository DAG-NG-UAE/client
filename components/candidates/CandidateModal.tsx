import { CandidateProfile } from "@/interface/candidate";
import { getFirstAndLastInitials } from "@/utils/transform";
import { getStatusChipProps } from "@/utils/statusColorMapping";
import {
    Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Avatar,
    Button, Chip, Paper, Divider, TextField, Stack, useTheme,
    DialogActions, CircularProgress
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CurrencyExchangeOutlined from '@mui/icons-material/CurrencyExchangeOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StarIcon from '@mui/icons-material/Star';
import { getCandidateResume, getSingleCandidate, updateCandidateStatus } from "@/api/candidate";
import { useEffect, useState } from "react";
import { determineActions } from "@/utils/determineActions";
import { CandidateActions, CandidateActionButton } from "@/interface/candidate";
import ScheduleInterviewModal from "./ScheduleInterviewModal"; // Import the new modal
import { callUpdateCandidateStatus } from "@/redux/slices/candidates";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CandidateStatus } from "@/utils/constants";
import { CandidateRejectionModal } from "./CandidateRejectionModal";
import { CandidateStatusType } from "@/types/candidate";
import { useRouter } from "next/navigation";

interface CandidateModalProps {
    open: boolean;
    onClose: () => void;
    candidate: Partial<CandidateProfile> | null;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
        {children}
    </Typography>
);

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label?: string, value: string | undefined }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box sx={{ color: 'text.secondary', display: 'flex' }}>
            {icon}
        </Box>
        <Box>
            {label && <Typography variant="caption" display="block" color="text.secondary">{label}</Typography>}
            <Typography variant="body2">{value || '---'}</Typography>
        </Box>
    </Box>
);

const CandidateModal = ({ open, onClose, candidate }: CandidateModalProps) => {
    const theme = useTheme();

    const router = useRouter();
    const [fetchedDetails, setFetchedDetails] = useState<Partial<CandidateProfile> | null>(null);
    const [notesModalOpen, setNotesModalOpen] = useState(false);
    const [note, setNote] = useState('');
    const [currentAction, setCurrentAction] = useState<CandidateActionButton | null>(null);
    const [updateCandidate, setUpdateCandidate] = useState(false);
    const { loading } = useSelector((state: RootState) => state.candidates)
    const [openRejectionModal, setOpenRejectionModal] = useState(false);

    const handleAction = (action: CandidateActionButton) => {
        setCurrentAction(action);
        if (action.triggersWorkflow === 'Scheduling') {
            router.push(`/candidates/schedule?id=${candidate?.candidate_id}&reqId=${candidate?.requisition_id}`);
        } else if (action.triggersWorkflow === 'Reject Candidate') {
            // we want to open the rejection modal here
            setOpenRejectionModal(true);
        } else if (action.requiresNotes) {
            setNotesModalOpen(true);
        } else {
            // For actions that don't require notes, we could call the API directly.
            console.log("Performing action directly:", action);
        }
    };

    const handleSchedulingComplete = () => {
        onClose(); // Close the main modal
        setUpdateCandidate(prev => !prev); // Trigger a re-fetch of data in the parent
    };

    const handleSubmitNote = async () => {
        if (!currentAction || !candidate?.candidate_id) return;

        console.log(`Submitting action: ${currentAction.actionType} for candidate: ${candidate.candidate_id} with status: ${currentAction.targetStatus} and note: ${note}`);

        const body: Partial<CandidateProfile> = {
            candidate_id: candidate.candidate_id,
            requisition_id: candidate.requisition_id,
            old_status: candidate.current_status?.toLowerCase(),
            new_status: currentAction.targetStatus?.toLowerCase(),
            current_status: currentAction.targetStatus?.toLowerCase(),
            notes: note
        }
        // Placeholder for API call:
        await callUpdateCandidateStatus(body)

        // Reset and close modals
        setNotesModalOpen(false);
        setNote('');
        setCurrentAction(null);
        setUpdateCandidate(prev => !prev); // Trigger re-fetch of candidate details
        onClose(); // Close the main modal
    };

    const NotesConfirmationModal = (
        <Dialog open={notesModalOpen} onClose={() => setNotesModalOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Reason for: {currentAction?.label}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="note"
                    label="Add a note"
                    type="text"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={`Provide a reason for moving this candidate to ${currentAction?.targetStatus}...`}
                />
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setNotesModalOpen(false)} disabled={loading}>Cancel</Button>
                {loading ? (
                    <CircularProgress size={24} sx={{ color: theme.palette.primary.main }} />
                ) : (
                    <Button onClick={handleSubmitNote} variant="contained" disabled={!note}>Submit</Button>
                )}
            </DialogActions>
        </Dialog>
    );

    const { progressionAction, rejectionAction } = fetchedDetails?.current_status
        ? determineActions(fetchedDetails.current_status as CandidateStatusType)
        : { progressionAction: null, rejectionAction: null };

    useEffect(() => {
        if (open && candidate?.candidate_id) {
            const fetchCandidateDetail = async () => {
                try {
                    const response = await getSingleCandidate(candidate.candidate_id!)
                    setFetchedDetails(response)
                } catch (error) {
                    throw error
                }
            }
            fetchCandidateDetail()
        }
    }, [open, candidate?.candidate_id, updateCandidate])

    if (!candidate) return null;

    const handleViewResume = async (candidateId: string) => {
        // This will hit your new API endpoint and the browser will display the PDF/file.
        const resumeUrl = await getCandidateResume(candidateId);
        window.open(resumeUrl, '_blank');
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                scroll="paper"
                PaperProps={{
                    sx: { borderRadius: 2, height: '90vh' }
                }}
            >
                <DialogTitle sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    bgcolor: 'primary.main',
                                    fontSize: '1.2rem'
                                }}
                            >
                                {candidate.candidate_name ? getFirstAndLastInitials(candidate.candidate_name) : '---'}
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    {candidate.candidate_name || 'Unknown Candidate'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {candidate.role_applied_for} • {candidate.department}
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ p: 3, mt: 2 }}>
                    {/* Status Section */}
                    <Paper elevation={0} sx={{ p: 2, mb: 3, border: `1px solid ${theme.palette.divider}` }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Current Status
                                </Typography>
                                {fetchedDetails?.current_status && (
                                    <Chip
                                        {...getStatusChipProps(fetchedDetails.current_status)}
                                        size="small"
                                        sx={{
                                            borderRadius: '6px',
                                            fontWeight: 500,
                                            ...(getStatusChipProps(fetchedDetails.current_status).sx || {})
                                        }}
                                    />
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {rejectionAction && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        sx={{ textTransform: 'none', borderRadius: 2 }}
                                        onClick={() => handleAction(rejectionAction)}
                                    >
                                        {rejectionAction.label}
                                    </Button>
                                )}
                                {progressionAction && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ textTransform: 'none', borderRadius: 2 }}
                                        onClick={() => handleAction(progressionAction)}
                                    >
                                        {progressionAction.label}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Paper>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {/* Contact Information */}
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <Paper elevation={0} sx={{ p: 2, height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                                <SectionTitle>Contact Information</SectionTitle>
                                <DetailItem
                                    icon={<EmailIcon fontSize="small" />}
                                    value={candidate.email}
                                />
                                <DetailItem
                                    icon={<PhoneIcon fontSize="small" />}
                                    value={candidate.mobile_number}
                                />
                                <DetailItem
                                    icon={<CurrencyExchangeOutlined fontSize="small" />}
                                    value={fetchedDetails?.salary_target_min ? `N${new Intl.NumberFormat().format(Number(fetchedDetails.salary_target_min))}` : undefined}
                                    label="Expected Salary"
                                />
                                <DetailItem
                                    icon={<CalendarTodayIcon fontSize="small" />}
                                    value={fetchedDetails?.notice_period}
                                    label="Notice Period"
                                />
                            </Paper>
                        </Box>

                        {/* Application Details */}
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <Paper elevation={0} sx={{ p: 2, height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                                <SectionTitle>Application Details</SectionTitle>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'start', gap: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Applied:</Typography>
                                        <Typography variant="body2">{candidate.submitted_date?.split('T')[0]}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'start', gap: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Source:</Typography>
                                        <Typography variant="body2">{candidate.source}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'start', gap: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Experience:</Typography>
                                        <Typography variant="body2">{fetchedDetails?.total_experience_years}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'start', gap: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Education:</Typography>
                                        <Typography variant="body2">{candidate.qualification}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'start', gap: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Current Company:</Typography>
                                        <Typography variant="body2">{candidate.current_place_of_work}</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>

                        {/* Resume & Cover Letter */}
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <Paper elevation={0} sx={{ p: 2, height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                                <SectionTitle>Resume</SectionTitle>
                                <Button onClick={() => handleViewResume(candidate.candidate_id!)} startIcon={<OpenInNewIcon />} sx={{ textTransform: 'none' }}>
                                    View Resume
                                </Button>
                            </Paper>
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                            <Paper elevation={0} sx={{ p: 2, height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                                <SectionTitle>Cover Letter</SectionTitle>
                                <Typography variant="body2" color="text.secondary" sx={{
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 3,
                                }}>
                                    {candidate.cover_letter || "No cover letter provided."}
                                </Typography>
                            </Paper>
                        </Box>


                    </Box>
                </DialogContent>
                {NotesConfirmationModal}
            </Dialog>

            <CandidateRejectionModal
                open={openRejectionModal}
                onClose={() => setOpenRejectionModal(false)}
                candidate={candidate}
            >

            </CandidateRejectionModal>
        </>
    );
};

export default CandidateModal;
