"use client";

import React, { useEffect } from 'react';
import { 
    Box, Typography, Button, Paper, Divider, 
    IconButton, TextField, Chip, Stack, Tooltip, Avatar, CircularProgress 
} from '@mui/material';
import { 
    CheckCircle as CheckCircleIcon,
    Visibility as VisibilityIcon,
    HourglassEmpty as PendingIcon,
    Lock as LockIcon,
    ContentCopy as ContentCopyIcon,
    Send as SendIcon,
    FlashOn as FlashOnIcon,
    ArrowBack as ArrowBackIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchSingleCandidate } from '@/redux/slices/candidates';
import { InternalApproval } from '@/interface/offer';
import { callFetchInternalSalaryOffer } from '@/redux/slices/offer';

const InternalApprovalPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const dispatch = useDispatch<AppDispatch>();

    const { selectedCandidate } = useSelector((state: RootState) => state.candidates);
    const { internalOffer, loading } = useSelector((state: RootState) => state.offers);

    useEffect(() => {
        if (id) {
            if (!selectedCandidate || selectedCandidate.candidate_id !== id) {
                fetchSingleCandidate(id);
            }
            callFetchInternalSalaryOffer(id);
        }
    }, [id, dispatch, selectedCandidate]);

    if (loading && !internalOffer) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    // Derived Data from Internal Offer
    const hasApprovals = internalOffer?.approvals && internalOffer.approvals.length > 0;
    
    const salaryData = internalOffer ? {
        annualGross: Number(internalOffer.annual_gross),
        monthlyNet: Number(internalOffer.monthly_net),
        currency: internalOffer.currency === 'Naira' ? '₦' : internalOffer.currency === 'INR' ? 'INR' : 'USD',
        breakdown: [
            { label: "Basic Salary", value: internalOffer.bha_breakdown?.basic },
            { label: "Housing Allowance", value: internalOffer.bha_breakdown?.housing },
            { label: "Transport Allowance", value: internalOffer.bha_breakdown?.transport },
            { label: "Other Allowances", value: internalOffer.bha_breakdown?.other_allowances },
        ].filter(item => item.value !== undefined),
        nonCashBenefits: internalOffer.benefits?.map(b => b.name) || []
    } : {
        annualGross: 0,
        monthlyNet: 0,
        currency: 'USD',
        breakdown: [],
        nonCashBenefits: []
    };

    const handleEditPackage = () => {
        if (!hasApprovals) {
            router.push(`/candidates/internal-approval/edit/${id}`);
        }
    };

    return (
        <Box sx={{ bgcolor: '#F5F6F8', minHeight: '100vh', p: { xs: 2, md: 4 } }}>
            {/* Header */}
             <Box sx={{ mb: 4 }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => router.back()}
                    sx={{ textTransform: 'none', color: 'text.secondary', mb: 1, fontWeight: 600 }}
                >
                    Back
                </Button>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar 
                            // src={selectedCandidate?.profile_picture || ""}
                            sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.5rem' }}
                        >
                            {selectedCandidate?.candidate_name?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h5" fontWeight={700}>{selectedCandidate?.candidate_name || internalOffer?.candidate_name || "Loading..."}</Typography>
                                <Chip label="EXTERNAL CANDIDATE" size="small" sx={{ bgcolor: '#E3F2FD', color: '#1976D2', fontWeight: 600, borderRadius: 1, fontSize: '0.7rem' }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {selectedCandidate?.role_applied_for} • Req ID: {selectedCandidate?.requisition_id} • Grade: L4
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 4, textAlign: 'right' }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block' }}>PROPOSED START DATE</Typography>
                            <Typography variant="body2" fontWeight={600}>Nov 12, 2024</Typography>
                        </Box>
                         <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block' }}>HIRING MANAGER</Typography>
                            <Typography variant="body2" fontWeight={600}>Marcus Chen</Typography>
                        </Box>
                         <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block' }}>LOCATION</Typography>
                            <Typography variant="body2" fontWeight={600}>San Francisco, CA</Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
                {/* Left Column: Package Details */}
                <Box sx={{ flex: 2 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span style={{ fontSize: '1.2rem' }}>💵</span> Compensation Breakdown
                            </Typography>
                             <Tooltip title={hasApprovals ? "Proposal sent for review. Cannot be edited." : ""}>
                                <span>
                                    <Button 
                                        size="small" 
                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                        onClick={handleEditPackage}
                                        disabled={hasApprovals}
                                    >
                                        Edit Package
                                    </Button>
                                </span>
                            </Tooltip>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
                            <Box sx={{ flex: 1, p: 3, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>ANNUAL GROSS SALARY</Typography>
                                <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>
                                    {salaryData.annualGross.toLocaleString()} <span style={{ fontSize: '1rem', color: '#666', fontWeight: 400 }}>{salaryData.currency}</span>
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1, p: 3, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>MONTHLY NET (ESTIMATE)</Typography>
                                <Typography variant="h4" fontWeight={700} color="success.main" sx={{ mt: 1 }}>
                                    {salaryData.monthlyNet.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>Calculated based on current tax regulations</Typography>
                            </Box>
                        </Box>

                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 2 }}>BENEFIT BREAKDOWN</Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 4 }}>
                            {salaryData.breakdown.map((item, index) => (
                                <Box key={index}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: index % 2 === 0 ? 'primary.main' : 'secondary.main' }} />
                                            <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight={700}>{item?.value?.toLocaleString()}</Typography>
                                    </Box>
                                    <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ bgcolor: '#F0F9FF', p: 2, borderRadius: 2, border: '1px solid', borderColor: '#BAE6FD' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 1 }}>NON-CASH BENEFITS</Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1 }}>
                                {salaryData.nonCashBenefits.map((benefit, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircleIcon color="primary" fontSize="small" />
                                        <Typography variant="body2">{benefit}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Paper>

                    {/* Magic Link Section */}
                    {hasApprovals && (
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Approver Tokens & Links</Typography>
                            <Stack spacing={2}>
                                {internalOffer?.approvals?.map((approval: InternalApproval) => (
                                    <Box key={approval.id} sx={{ mb: 2, p: 2, border: '1px solid #E0E0E0', borderRadius: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="subtitle2" fontWeight={700}>{approval.email}</Typography>
                                            <Chip 
                                                label={approval.is_expired ? "EXPIRED" : "ACTIVE"} 
                                                size="small" 
                                                color={approval.is_expired ? "error" : "success"}
                                                variant="outlined"
                                                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F5F5F5', borderRadius: 1, border: '1px solid #E0E0E0', flexGrow: 1 }}>
                                                <Typography variant="body2" sx={{ p: 1, fontFamily: 'monospace', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    Token: {approval.token}
                                                </Typography>
                                                <IconButton size="small"><ContentCopyIcon fontSize="small" /></IconButton>
                                            </Box>
                                            <Tooltip title="Refresh Token">
                                                <IconButton color="primary" size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                                                    <RefreshIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    )}
                </Box>

                {/* Right Column: Approvals */}
                <Box sx={{ flex: 1 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Approval Chain</Typography>
                        
                        <Box sx={{ position: 'relative', pl: 2 }}>
                            {/* Vertical Line */}
                            <Box sx={{ position: 'absolute', left: 23, top: 15, bottom: 20, width: 2, bgcolor: '#E0E0E0' }} />

                             <Stack spacing={4}>
                                {internalOffer?.approvals && internalOffer.approvals.length > 0 ? (
                                    internalOffer.approvals.map((step) => (
                                        <Box key={step.id} sx={{ display: 'flex', gap: 2, position: 'relative' }}>
                                            <Box sx={{ 
                                                width: 48, height: 48, borderRadius: '50%', 
                                                bgcolor: step.status === 'approved' ? '#E6F4EA' : (step.status === 'viewed' ? '#E3F2FD' : '#F5F5F5'),
                                                color: step.status === 'approved' ? 'success.main' : (step.status === 'viewed' ? 'primary.main' : 'text.disabled'),
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                zIndex: 1, border: '4px solid white'
                                            }}>
                                                {step.status === 'approved' && <CheckCircleIcon />}
                                                {step.status === 'viewed' && <VisibilityIcon />}
                                                {step.status === 'pending' && <PendingIcon />}
                                                {step.status === 'sent' && <LockIcon fontSize="small" />}
                                            </Box>
                                            <Box sx={{ flexGrow: 1, pt: 0.5 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Typography variant="subtitle2" fontWeight={700} sx={{ wordBreak: 'break-all' }}>{step.email}</Typography>
                                                    
                                                    {step.status === 'pending' && <Chip label="PENDING" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#FFF8E1', color: '#F57C00' }} />}
                                                    {/* Add other status mappings as they come from API */}
                                                </Box>
                                                <Typography variant="caption" color="text.secondary" display="block">Approver</Typography>
                                                {step.responded_at && <Typography variant="caption" color="text.secondary">{new Date(step.responded_at).toLocaleDateString()}</Typography>}
                                            </Box>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                                        No approvals sent yet. Edit package and submit to start approval process.
                                    </Typography>
                                )}
                             </Stack>
                        </Box>

                        <Button 
                            variant="contained" 
                            fullWidth 
                            startIcon={<SendIcon />}
                            sx={{ mt: 4, mb: 2, bgcolor: '#0D47A1', textTransform: 'none', py: 1.5, fontWeight: 600 }}
                            disabled={!hasApprovals}
                        >
                            Resend Notifications
                        </Button>

                        <Divider sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">ADMIN OVERRIDES</Typography>
                        </Divider>

                        <Button 
                            variant="outlined" 
                            color="error"
                            fullWidth 
                            startIcon={<FlashOnIcon />}
                            sx={{ textTransform: 'none', fontWeight: 700, borderStyle: 'dashed' }}
                        >
                            FORCE APPROVE
                        </Button>
                        <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                            Bypasses entire approval chain. Requires HR Admin logging.
                        </Typography>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default InternalApprovalPage;
