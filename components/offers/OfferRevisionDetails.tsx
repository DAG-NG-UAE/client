import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchOfferById, fetchCandidateJoiningDetails } from '@/redux/slices/offer';
import { Box, Button, Card, CardContent, Stack, Typography, Avatar, Divider, Chip } from '@mui/material';
import { Email, Phone, Edit, CheckCircle, Warning, Person, CalendarToday, AttachMoney, LocationOn } from '@mui/icons-material';
import { formatOfferDate } from '@/utils/transform';
import { useRouter } from 'next/navigation';

interface OfferRevisionDetailsProps {
    id: string;
}

const OfferRevisionDetails = ({ id }: OfferRevisionDetailsProps) => {
    const router = useRouter();
    const { currentOffer: offer, joiningDetails, loading } = useSelector((state: RootState) => state.offers);
    
    // Mock revision data - in a real app this might come from the offer object or a separate endpoint
    const revisionData = {
        message: "Thank you for the offer. However, I would like to request a revision regarding the base salary. Based on my experience and current market rates, I was expecting a package closer to $120,000. Additionally, I would like to discuss the possibility of remote work options for 2 days a week.",
        revisionDate: new Date().toISOString(),
        urgency: "High",
        contact: {
            email: "candidate@example.com",
            phone: "+234 800 123 4567"
        }
    };

    useEffect(() => {
        if (id) {
            fetchOfferById(id);
            fetchCandidateJoiningDetails(id);
        }
    }, [id]);

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
                                    "{revisionData.message}"
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Received on: {new Date(revisionData.revisionDate).toLocaleDateString()}
                                </Typography>
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
                                            {joiningDetails?.personal_email || revisionData.contact?.email || 'No email provided'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Phone color="action" fontSize="small" />
                                        <Typography variant="body2">
                                            {joiningDetails?.mobile_nigeria || revisionData.contact?.phone || 'No phone provided'}
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
                                <Button 
                                    variant="outlined" 
                                    color="success" 
                                    startIcon={<CheckCircle />}
                                    fullWidth
                                    size="large"
                                    onClick={() => alert("Mark as resolved")}
                                >
                                    Mark as Resolved
                                </Button>
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
