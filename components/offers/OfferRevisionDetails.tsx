import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchOfferById, fetchCandidateJoiningDetails, callResolveRequisition, fetchAllOffers } from '@/redux/slices/offer';
import { Box, Button, Card, CardContent, Stack, Typography, Avatar, Divider, Chip, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, CircularProgress } from '@mui/material';
import { Email, Phone, Edit, CheckCircle, Warning, Person, CalendarToday, AttachMoney, LocationOn } from '@mui/icons-material';
import { formatOfferDate } from '@/utils/transform';
import { useRouter } from 'next/navigation';

interface OfferRevisionDetailsProps {
    id: string;
}

const OfferRevisionDetails = ({ id }: OfferRevisionDetailsProps) => {
    const router = useRouter();
    const { currentOffer: offer, joiningDetails, loading } = useSelector((state: RootState) => state.offers);
    const [historyOpen, setHistoryOpen] = useState(false);
    
    // Safely retrieve negotiation history
    const negotiationHistory = joiningDetails?.negotiation_history || [];
    console.log(negotiationHistory);
    const latestMessage = negotiationHistory.length > 0 ? negotiationHistory[negotiationHistory.length - 1] : null;

    // Mock revision data - in a real app this might come from the offer object or a separate endpoint
    const actualRevisionData = { 
        message: latestMessage?.message || 'No message',
        revisionDate: latestMessage?.timestamp || 'No timestamp',
        urgency: "High",
        contact: {
            email: joiningDetails?.preferred_email || 'No email',
            phone: joiningDetails?.preferred_number || 'No phone'
        }
    }
 

    useEffect(() => {
        if (id) {
            fetchOfferById(id);
            fetchCandidateJoiningDetails(id);
        }
    }, [id]);

    const handleMarkAsResolved = async (offerId: string) => {
        await callResolveRequisition(offerId);
        window.history.back();
        await fetchAllOffers('revision_requested');
    }

    if (loading && !offer) {
        return <Typography sx={{ p: 4 }}>Loading details...</Typography>;
    }

    if (!offer) return <Typography sx={{ p: 4 }}>No offer data found.</Typography>;

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Offer Revision Request
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Chip label="Revision Requested" color="error" size="small" icon={<Warning />} />
                        
                    </Stack>
                </Box>
                <Button variant="outlined" onClick={() => router.back()}>
                    Back to List
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                
                {/* Left Column: Revision Request & Candidate Info */}
                <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    
                    {/* Revision Request Card */}
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Warning color="warning" /> Candidate's Request
                            </Typography>
                            <Box sx={{ p: 3, borderRadius: 2, bgcolor: '#fff5f5', border: '1px dashed #ffcdd2', mt: 2 }}>
                                <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.primary', mb: 2 }}>
                                    "{actualRevisionData.message}"
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Received on: {actualRevisionData.revisionDate !== 'No timestamp' ? new Date(actualRevisionData.revisionDate).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                </Typography>
                                {negotiationHistory.length > 1 && (
                                    <Button 
                                        size="small" 
                                        sx={{ mt: 1, textTransform: 'none', p: 0, justifyContent: 'flex-start' }} 
                                        onClick={() => setHistoryOpen(true)}
                                    >
                                        View all {negotiationHistory.length} messages
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Candidate Contact Info */}
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person color="primary" /> Candidate Contact
                            </Typography>
                            
                            <Stack spacing={2} sx={{ mt: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                                        {joiningDetails?.first_name?.charAt(0) || 'C'}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {joiningDetails?.first_name} {joiningDetails?.last_name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Candidate
                                        </Typography>
                                    </Box>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Email color="action" fontSize="small" />
                                        <Typography variant="body2">
                                            {joiningDetails?.personal_email || actualRevisionData.contact?.email || 'No email provided'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Phone color="action" fontSize="small" />
                                        <Typography variant="body2">
                                            {joiningDetails?.mobile_nigeria || actualRevisionData.contact?.phone || 'No phone provided'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>

                {/* Right Column: Current Offer Snapshot & Actions */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    
                    {/* Actions Card */}
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold"> Actions </Typography>
                            <Stack spacing={2} sx={{ mt: 2 }}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    startIcon={<Edit />}
                                    fullWidth
                                    size="large"
                                    onClick={() => router.push(`/offers/revise/${id}`)}
                                >
                                    Generate Revised Offer
                                </Button>
                                {loading ? (
                                    <CircularProgress/>
                                ): (
                                    <Button
                                        variant="outlined" 
                                        color="success" 
                                        startIcon={<CheckCircle />}
                                        fullWidth
                                    size="large"
                                    onClick={() => handleMarkAsResolved(id)}
                                >
                                    Mark as Resolved
                                </Button>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Current Offer Top-Level Details */}
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.default' }}>
                        <CardContent sx={{ p: 3 }}>
                             <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="text.secondary">
                                Current Offer Snapshot
                            </Typography>
                            <Stack spacing={2} sx={{ mt: 2 }}>
                                <DetailRow label="Position" value={offer.position} icon={<Person fontSize="small"/>} />
                                <DetailRow label="Salary" value={offer.salary_net?.toLocaleString()} icon={<AttachMoney fontSize="small"/>} />
                                <DetailRow label="Start Date" value={formatOfferDate(offer.commencement_date!)} icon={<CalendarToday fontSize="small"/>} />
                                <DetailRow label="Location" value={offer.location} icon={<LocationOn fontSize="small"/>} />
                            </Stack>
                            <Button variant="text" size="small" sx={{ mt: 2 }} onClick={() => router.push(`/offers/view/${id}`)}>
                                View Full Offer Details
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
            {/* History Dialog */}
            <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Negotiation History</DialogTitle>
                <DialogContent dividers>
                    <List disablePadding>
                        {negotiationHistory && negotiationHistory.length > 0 ? negotiationHistory.map((msg, index) => (
                           <ListItem key={index} alignItems="flex-start" sx={{ 
                               flexDirection: 'column', 
                               py: 2,
                               borderBottom: '1px solid', 
                               borderColor: 'divider',
                               '&:last-child': { borderBottom: 'none' }
                           }}>
                               <Typography variant="caption" fontWeight="bold" color="primary.main">
                                   {msg.sender} • {new Date(msg.timestamp).toLocaleString()}
                               </Typography>
                               <Typography variant="body2" sx={{ mt: 0.5 }}>
                                   {msg.message}
                               </Typography>
                           </ListItem>
                        )) : <ListItem><Typography variant="body2">No negotiation history found.</Typography></ListItem>}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setHistoryOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const DetailRow = ({ label, value, icon }: { label: string, value?: string, icon?: React.ReactNode }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            {icon}
            <Typography variant="body2">{label}</Typography>
        </Box>
        <Typography variant="body2" fontWeight="bold">{value || '---'}</Typography>
    </Box>
);

export default OfferRevisionDetails;
