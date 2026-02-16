
import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { 
    fetchOfferById, 
    fetchCandidateJoiningDetails, 
    fetchGuarantor, 
    callFetchPreOfferDocs,
    callSavePreOfferDocs,
    callUpdateJoiningDocsStatus
} from '@/redux/slices/offer';
import { 
    Box, 
    Button, 
    Card, 
    Typography, 
    Accordion, 
    AccordionSummary, 
    AccordionDetails, 
    Avatar, 
    LinearProgress, 
    Stack,
    IconButton,
    Chip,
    Tooltip,
    useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HistoryIcon from '@mui/icons-material/History';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import JoiningDetailsView from './JoiningDetailsView';
import GuarantorDetailsView from './GuarantorDetailsView';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { JoiningDocuments, JoiningDocumentItem } from '@/interface/offer';

interface OfferDetailsProps {
    id: string;
}

const OfferDetails = ({ id }: OfferDetailsProps) => {
    const theme = useTheme();
    const { 
        currentOffer: offer, 
        joiningDetails, 
        guarantor, 
        preOfferDocs,
        loading 
    } = useSelector((state: RootState) => state.offers);
    const {selectedCandidate} = useSelector((state: RootState) => state.candidates);

    const [expanded, setExpanded] = useState<string | false>('panel1');
    const [joiningDocs, setJoiningDocs] = useState<(JoiningDocumentItem & { title: string, docType: string })[]>([]);

    useEffect(() => {
        if (id) {
            fetchOfferById(id);
            fetchCandidateJoiningDetails(id);
            fetchGuarantor(id);
        }
    }, [id]);

    useEffect(() => {
        if (joiningDetails?.documents) {
            try {
                const docs: JoiningDocuments = typeof joiningDetails.documents === 'string' 
                    ? JSON.parse(joiningDetails.documents) 
                    : joiningDetails.documents;
                
                const list: (JoiningDocumentItem & { title: string, docType: string })[] = [];
                
                if (docs.passport) {
                    list.push({ 
                        ...docs.passport, 
                        title: 'Passport', 
                        docType: 'passport' 
                    });
                }
                
                if (docs.certificates && Array.isArray(docs.certificates)) {
                    docs.certificates.forEach((cert, index) => {
                        list.push({ 
                            ...cert, 
                            title: cert.fileName || `Certificate ${index + 1}`,
                            docType: 'certificates'
                        });
                    });
                }

                if (docs.proof && Array.isArray(docs.proof)) {
                    docs.proof.forEach((cert, index) => {
                        list.push({ 
                            ...cert, 
                            title: cert.fileName || `Proof ${index + 1}`,
                            docType: 'proof'
                        });
                    });
                }
                
                setJoiningDocs(list);
            } catch (error) {
                console.error("Error parsing joining documents:", error);
                setJoiningDocs([]);
            }
        }
    }, [joiningDetails]);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleVerifyDoc = async (doc: JoiningDocumentItem & { docType: string }) => {
        console.log("Verify doc", doc);
        callUpdateJoiningDocsStatus(doc._id, 'APPROVED', '', id, doc.docType);
    };

    const handleRejectDoc = async (doc: JoiningDocumentItem & { docType: string }) => {
        console.log("Reject doc", doc);
        callUpdateJoiningDocsStatus(doc._id, 'REJECTED', '', id, doc.docType);
    };

    const handleCreateEmployee = () => {
        // TODO: Implement Create Employee logic
        console.log("Creating employee for offer:", id);
        alert("Employee created successfully!");
    };

    const groupedDocs = useMemo(() => {
        return joiningDocs.reduce((acc, doc) => {
            const key = doc.docType;
            if (!acc[key]) acc[key] = [];
            acc[key].push(doc);
            return acc;
        }, {} as Record<string, typeof joiningDocs>);
    }, [joiningDocs]);

    const progress = useMemo(() => {
        if (!joiningDocs || joiningDocs.length === 0) return 0;
        const verifiedCount = joiningDocs.filter(d => d.status === 'approved' || d.status === 'APPROVED' || d.status === 'Verified').length;
        return Math.round((verifiedCount / joiningDocs.length) * 100);
    }, [joiningDocs]);

    const getDocIcon = (type: string) => {
        if (type.toLowerCase().includes('pdf')) return <PictureAsPdfIcon color="error" />;
        if (type.toLowerCase().includes('image') || type.toLowerCase().includes('jpg') || type.toLowerCase().includes('png')) return <ImageIcon color="primary" />;
        return <ArticleIcon />;
    };

    const getStatusChip = (status: string) => {
        const s = status.toUpperCase();
        switch (s) {
            case 'APPROVED':
            case 'VERIFIED':
                return <Chip label="Verified" color="success" size="small" icon={<VerifiedIcon />} />;
            case 'REJECTED':
                return <Chip label="Rejected" color="error" size="small" />;
            case 'PENDING':
            case 'PENDING_REVIEW':
                return <Chip label="Pending Review" color="warning" size="small" />;
            case 'AWAITING_UPLOAD':
                return <Chip label="Awaiting Upload" color="default" size="small" />;
            default:
                return <Chip label={status} size="small" />;
        }
    };

    if (!offer) return <Box p={3}><Typography>Loading offer details...</Typography></Box>;

    const fullName = selectedCandidate? `${selectedCandidate.candidate_name}` : 'Associate';
    
    const renderDocList = (docs: typeof joiningDocs) => (
        <Stack spacing={2}>
            {docs.map((doc, index) => (
                <Card key={doc._id || index} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'grey.100' }}>
                            {getDocIcon(doc.url || '')}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="medium">{doc.title}</Typography>
                            <Typography variant="caption" color="text.secondary">{doc.fileName}</Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {getStatusChip(doc.status)}
                        
                        {doc.url && (
                            <Tooltip title="View Document">
                                <IconButton href={`http://localhost:5000${doc.url}`} target="_blank" size="small">
                                    <Box component="span" sx={{ fontSize: 20 }}>👁️</Box>
                                </IconButton>
                            </Tooltip>
                        )}

                        <Stack direction="row" spacing={1}>
                            <IconButton 
                                size="small" 
                                color="success" 
                                onClick={() => handleVerifyDoc(doc)}
                                disabled={doc.status === 'approved' || doc.status === 'APPROVED'}
                                sx={{ 
                                    bgcolor: (doc.status === 'approved' || doc.status === 'APPROVED') ? 'success.main' : 'success.light', 
                                    color: (doc.status === 'approved' || doc.status === 'APPROVED') ? 'white' : 'success.dark',
                                    '&:hover': { bgcolor: 'success.main', color: 'white' }
                                }}
                            >
                                <CheckIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleRejectDoc(doc)}
                                disabled={doc.status === 'rejected' || doc.status === 'REJECTED'}
                                sx={{ 
                                    bgcolor: (doc.status === 'rejected' || doc.status === 'REJECTED') ? 'error.main' : 'error.light', 
                                    color: (doc.status === 'rejected' || doc.status === 'REJECTED') ? 'white' : 'error.dark',
                                    '&:hover': { bgcolor: 'error.main', color: 'white' }
                                }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Box>
                </Card>
            ))}
        </Stack>
    );

    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
            {/* Header Card */}
            <Card sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 3 }}>
                    <Avatar 
                        sx={{ width: 80, height: 80, bgcolor: theme.palette.primary.main, fontSize: '2rem' }}
                        src={joiningDetails?.passport_number ? undefined : undefined} // TODO: Add passport photo url if available
                    >
                        {fullName.charAt(0)}
                    </Avatar>
                    
                    <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <Typography variant="h5" fontWeight="bold">{fullName}</Typography>
                            {offer.status === 'accepted' && (
                                <Chip label="OFFER ACCEPTED" color="primary" size="small" sx={{ fontWeight: 'bold', borderRadius: 1 }} />
                            )}
                        </Box>
                        <Typography color="text.secondary" variant="body2">
                            Position: {offer.position}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={2}>
                        {joiningDocs.length > 0 && progress === 100 && (
                            <Button 
                                variant="contained" 
                                color="success" 
                                startIcon={<PersonAddIcon />}
                                onClick={handleCreateEmployee}
                                sx={{ 
                                    fontWeight: 'bold', 
                                    borderRadius: 2,
                                    px: 3,
                                    boxShadow: '0px 4px 14px rgba(76, 175, 80, 0.4)'
                                }}
                            >
                                Create Employee
                            </Button>
                        )}
                        {/* <Button variant="outlined" startIcon={<DownloadIcon />}>
                            Export Report
                        </Button> */}
                    </Stack>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">VERIFICATION PROGRESS</Typography>
                        <Typography variant="subtitle2" fontWeight="bold" color="primary">{progress}%</Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                            }
                        }} 
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {joiningDocs.filter(d => d.status !== 'approved' && d.status !== 'APPROVED').length} items require review
                    </Typography>
                </Box>
            </Card>

            {/* Accordions */}
            <Stack spacing={2}>
                {/* Joining Details */}
                <Accordion 
                    expanded={expanded === 'panel1'} 
                    onChange={handleChange('panel1')}
                    sx={{ borderRadius: '12px !important', boxShadow: '0px 2px 8px rgba(0,0,0,0.05)', '&:before': { display: 'none' } }}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                                <AccountBoxIcon sx={{ color: 'primary.main' }} />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">Joining Details</Typography>
                                <Typography variant="caption" color="text.secondary">Personal, Financial, and Family data</Typography>
                            </Box>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <JoiningDetailsView details={joiningDetails} mode="full" embedded />
                    </AccordionDetails>
                </Accordion>

                {/* History & Background */}
                <Accordion 
                    expanded={expanded === 'panel2'} 
                    onChange={handleChange('panel2')}
                    sx={{ borderRadius: '12px !important', boxShadow: '0px 2px 8px rgba(0,0,0,0.05)', '&:before': { display: 'none' } }}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'secondary.light', width: 40, height: 40 }}>
                                <HistoryIcon sx={{ color: 'secondary.main' }} />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">History & Background</Typography>
                                <Typography variant="caption" color="text.secondary">Employment, Education, and Certifications</Typography>
                            </Box>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <JoiningDetailsView details={joiningDetails} mode="history" embedded />
                    </AccordionDetails>
                </Accordion>

                {/* Guarantor Details */}
                <Accordion 
                    expanded={expanded === 'panel3'} 
                    onChange={handleChange('panel3')}
                    sx={{ borderRadius: '12px !important', boxShadow: '0px 2px 8px rgba(0,0,0,0.05)', '&:before': { display: 'none' } }}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'warning.light', width: 40, height: 40 }}>
                                <VerifiedUserIcon sx={{ color: 'warning.main' }} />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">Guarantor Details</Typography>
                                <Typography variant="caption" color="text.secondary">Reference verification and signatures</Typography>
                            </Box>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <GuarantorDetailsView details={guarantor} embedded />
                    </AccordionDetails>
                </Accordion>

                {/* Document & Image Gallery */}
                <Accordion 
                    expanded={expanded === 'panel4'} 
                    onChange={handleChange('panel4')}
                    sx={{ borderRadius: '12px !important', boxShadow: '0px 2px 8px rgba(0,0,0,0.05)', '&:before': { display: 'none' } }}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'success.light', width: 40, height: 40 }}>
                                <AssignmentIcon sx={{ color: 'success.main' }} />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">Document & Image Gallery</Typography>
                                <Typography variant="caption" color="text.secondary">Identity proof and educational certificates</Typography>
                            </Box>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={4}>
                            {['passport', 'certificates', 'proof'].map((type) => {
                                const docs = groupedDocs[type];
                                if (!docs || docs.length === 0) return null;
                                return (
                                    <Box key={type}>
                                        <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase' }}>
                                            {type === 'passport' ? 'Passport' : type === 'certificates' ? 'Certificates' : 'Proof of Identity'}
                                        </Typography>
                                        {renderDocList(docs)}
                                    </Box>
                                );
                            })}
                            {joiningDocs.length === 0 && (
                                <Typography color="text.secondary" textAlign="center" py={4}>No documents uploaded yet.</Typography>
                            )}
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            </Stack>
        </Box>
    );
};

export default OfferDetails;
