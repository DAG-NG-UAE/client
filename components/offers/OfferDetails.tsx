import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchOfferById, fetchCandidateJoiningDetails, fetchGuarantor, fetchOfferLetter } from '@/redux/slices/offer';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { ContentCopy, Edit, Visibility, Description, AssignmentInd } from '@mui/icons-material';
import { formatOfferDate } from '@/utils/transform';
import JoiningDetailsView from './JoiningDetailsView';
import GuarantorDetailsView from './GuarantorDetailsView';
import OfferLetterView from './OfferLetterView';

interface OfferDetailsProps {
    id: string;
}

const OfferDetails = ({ id }: OfferDetailsProps) => {
    const { currentOffer: offer, joiningDetails, guarantor, loading } = useSelector((state: RootState) => state.offers);
    const [viewMode, setViewMode] = useState<'offer' | 'joining' | 'guarantor' | 'letter'>('offer');

    useEffect(() => {
        if (id) {
            fetchOfferById(id);
            console.log('we are fetching order by id')
        }
    }, []);

    const handleViewJoiningDetails = () => {
        if (id) {
            fetchCandidateJoiningDetails(id);
            setViewMode('joining');
        }
    };

    const handleViewGuarantorDetails = () => {
        if (id) {
            fetchGuarantor(id);
            setViewMode('guarantor');
        }
    };

    const handleViewOfferLetter = () => {
        if (id) {
            fetchOfferLetter(id);
            setViewMode('letter');
        }
    };

    if (loading && !offer && viewMode === 'offer') {
        return <Typography>Loading...</Typography>;
    }

    if (viewMode === 'joining') {
        return <JoiningDetailsView details={joiningDetails} onBack={() => setViewMode('offer')} />;
    }

    if (viewMode === 'guarantor') {
        return <GuarantorDetailsView details={guarantor} onBack={() => setViewMode('offer')} />;
    }

    if (viewMode === 'letter') {
        return <OfferLetterView offer={offer} onBack={() => setViewMode('offer')} />;
    }

    if (!offer) return <Typography>No offer data found.</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    { 'Candidate Name'}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {offer.position || 'Role'} • {offer.position || 'Department'}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    {/* Offer Details */}
                    <Box sx={{ flex: 1 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">Offer Details</Typography>
                                    {/* <Button startIcon={<Edit />} variant="text">Edit Offer</Button> */}
                                </Box>
                                <Stack spacing={2}>
                                    <DetailRow label="Position" value={offer.position || 'Role'} />
                                    <DetailRow label="Salary" value={offer.salary_net?.toString() || 'Salary'} />
                                    <DetailRow label="Joining Date" value={formatOfferDate(offer.commencement_date!) || 'Joining Date'} />
                                    <DetailRow label="Location" value={offer.location || 'Location'} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Candidate Progress */}
                    <Box sx={{ flex: 1 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Candidate Progress</Typography>
                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    <DetailRow label="Link Sent" value={offer.sent_date || 'Not sent'} />
                                    <DetailRow label="Link Expires" value={formatOfferDate(offer.expiry_date!) || '---'} />
                                    <DetailRow 
                                        label="Days Remaining" 
                                        value={
                                            offer.expiry_date 
                                                ? (() => {
                                                    const diff = new Date(offer.expiry_date).getTime() - new Date().getTime();
                                                    if (diff < 0) return 'Expired';
                                                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                                    if (days === 0) {
                                                        const hours = Math.floor(diff / (1000 * 60 * 60));
                                                        return `${hours} Hours`;
                                                    }
                                                    return `${days} Days`;
                                                })()
                                                : '---'
                                        } 
                                    />
                                    <DetailRow label="Access Count" value={offer.access_count?.toString() || '0'} />
                                    <Button startIcon={<ContentCopy />} variant="outlined" fullWidth sx={{ mt: 2 }}>
                                        Copy Link
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>

                {/* Signature and Actions */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    {/* Signature */}
                    <Box sx={{ flex: 1 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Signature</Typography>
                                {offer.digital_signature ? (
                                    <Box sx={{ textAlign: 'center', my: 2 }}>
                                        <img src={offer.digital_signature} alt="Signature" style={{ maxWidth: '100%', maxHeight: '100px' }} />
                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                                            Signed on 
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Typography color="text.secondary">Not signed yet.</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                    
                    {/* Actions */}
                    <Box sx={{ flex: 1 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Actions</Typography>
                                <Stack spacing={2}>
                                    <ActionButton 
                                        icon={<Description />} 
                                        label="Preview Offer Letter" 
                                        onClick={handleViewOfferLetter}
                                    />
                                    <ActionButton 
                                        icon={<AssignmentInd />} 
                                        label="View Joining Form Details" 
                                        onClick={handleViewJoiningDetails} 
                                    />
                                    <ActionButton 
                                        icon={<Visibility />} 
                                        label="View Guarantor Details" 
                                        onClick={handleViewGuarantorDetails}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const DetailRow = ({ label, value }: { label: string, value?: string }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: 1 }}>
        <Typography color="text.secondary">{label}</Typography>
        <Typography fontWeight="medium">{value || '---'}</Typography>
    </Box>
);

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}

const ActionButton = ({ icon, label, onClick }: ActionButtonProps) => (
    <Button 
        variant="outlined" 
        startIcon={icon} 
        fullWidth 
        onClick={onClick}
        sx={{ justifyContent: 'flex-start', color: 'text.primary', borderColor: 'divider' }}
    >
        {label}
    </Button>
);

export default OfferDetails;
