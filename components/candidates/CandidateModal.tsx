import { CandidateProfile } from "@/interface/candidate";
import { getFirstAndLastInitials } from "@/utils/transform";
import { getStatusChipProps } from "@/utils/statusColorMapping";
import { 
    Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Avatar, 
    Button, Chip, Paper, Divider, TextField, Stack, useTheme
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StarIcon from '@mui/icons-material/Star';
import { getSingleCandidate } from "@/api/candidate";
import { useEffect, useState } from "react";

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

    if (!candidate) return null;
   
    const allStatuses = ['Screening', 'Interview', 'Offer', 'Hired', 'Reject'];
    const [candidateDetail, setCandidateDetail] = useState<Partial<CandidateProfile>>({})

    const fetchCandidateDetail = async() => { 
        try{ 
            const response = await getSingleCandidate(candidate.candidate_id!)
            setCandidateDetail(response)
        }catch(error){ 
            throw error
        }
    }

    useEffect(() => { 
        if(candidate.candidate_id){ 
            fetchCandidateDetail()
        }
    }, [])

    return (
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
            <DialogTitle sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}`}}>
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
                            {candidate.current_status && (
                                <Chip 
                                    {...getStatusChipProps(candidate.current_status)} 
                                    label={candidate.current_status}
                                />
                            )}
                        </Box>
                        <Button variant="contained" color="primary" sx={{ textTransform: 'none', borderRadius: 2 }}>
                            Move to Offer
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {allStatuses.map((status) => {
                            const statusProps = getStatusChipProps(status);
                            return (
                                <Chip 
                                    key={status} 
                                    {...statusProps}
                                    variant={candidate.current_status === status ? "filled" : "outlined"}
                                    onClick={() => {}} 
                                    sx={{ borderRadius: 1, ...(statusProps as any).sx }}
                                />
                            );
                        })}
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
                                icon={<AttachMoneyIcon fontSize="small" />} 
                                value={candidate.salary_target_min ? `$${candidate.salary_target_min}` : undefined} 
                                label="Expected Salary"
                            />
                            <DetailItem 
                                icon={<CalendarTodayIcon fontSize="small" />} 
                                value={candidateDetail.notice_period} 
                                label="Notice Period"
                            />
                        </Paper>
                    </Box>

                    {/* Application Details */}
                    <Box sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                        <Paper elevation={0} sx={{ p: 2, height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                            <SectionTitle>Application Details</SectionTitle>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'start' , gap: 1}}>
                                    <Typography variant="body2" color="text.secondary">Applied:</Typography>
                                    <Typography variant="body2">{candidate.submitted_date?.split('T')[0]}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'start' , gap: 1 }}>
                                    <Typography variant="body2" color="text.secondary">Source:</Typography>
                                    <Typography variant="body2">{candidate.source}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'start' , gap: 1 }}>
                                    <Typography variant="body2" color="text.secondary">Experience:</Typography>
                                    <Typography variant="body2">{candidateDetail.total_experience_years}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'start' , gap: 1 }}>
                                    <Typography variant="body2" color="text.secondary">Education:</Typography>
                                    <Typography variant="body2">{candidate.qualification}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'start' , gap: 1 }}>
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
                            <Button startIcon={<OpenInNewIcon />} sx={{ textTransform: 'none' }}>
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

                    {/* Interview History - Mocked */}
                    <Box sx={{ width: '100%' }}>
                        <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
                            <SectionTitle>Interview History</SectionTitle>
                            <Box sx={{ pl: 2, borderLeft: `3px solid ${theme.palette.primary.main}` }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="subtitle2">Sarah Chen</Typography>
                                    <Box sx={{ display: 'flex', color: '#ffb400' }}>
                                        {[1,2,3,4].map(i => <StarIcon key={i} fontSize="small" />)}
                                    </Box>
                                </Box>
                                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Dec 5, 2024</Typography>
                                <Typography variant="body2">Strong technical skills, good communication.</Typography>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Notes */}
                    <Box sx={{ width: '100%' }}>
                        <Paper elevation={0} sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
                            <SectionTitle>Notes</SectionTitle>
                            {candidate.notes && (
                                <Box sx={{ p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                                    <Typography variant="body2">{candidate.notes}</Typography>
                                </Box>
                            )}
                            <Stack direction="row" spacing={1}>
                                <TextField 
                                    fullWidth 
                                    placeholder="Add a note..." 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ bgcolor: 'white' }}
                                />
                                <Button variant="contained" sx={{ textTransform: 'none' }}>Add Note</Button>
                            </Stack>
                        </Paper>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default CandidateModal;
