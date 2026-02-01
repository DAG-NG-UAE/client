"use client";

import React, { useEffect, useState } from 'react';
import { 
    Box, Typography, Button, Paper, Divider, 
    IconButton, Chip, Stack, Tooltip, Avatar, CircularProgress,
    List, ListItem, ListItemText, ListItemAvatar, ListItemButton
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
    Refresh as RefreshIcon,
    History as HistoryIcon,
    Block as BlockIcon,
    Cancel as CancelIcon
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
    const { internalOffer, internalOffersHistory, loading } = useSelector((state: RootState) => state.offers);
    const [activeIndex, setActiveIndex] = useState(0);

    const offers = internalOffersHistory && internalOffersHistory.length > 0 
        ? internalOffersHistory 
        : (internalOffer ? [internalOffer] : []);
    
    // Ensure activeIndex is valid
    const safeActiveIndex = activeIndex < offers.length ? activeIndex : 0;
    const activeOffer = offers[safeActiveIndex];
    const isArchived = safeActiveIndex > 0;

    const archiveTheme = {
        primary: "#ec1313",
        bgLight: "#fcf8f8",
        bgDark: "#221010",
        border: "#ffcdd2"
    };

    useEffect(() => {
        if (id) {
            if (!selectedCandidate || selectedCandidate.candidate_id !== id) {
                fetchSingleCandidate(id);
            }
            callFetchInternalSalaryOffer(id);
        }
    }, [id, dispatch, selectedCandidate]);

    if (loading && !activeOffer) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    // Derived Data from Internal Offer
    const hasApprovals = activeOffer?.approvals && activeOffer.approvals.length > 0;
    
    const salaryData = activeOffer ? {
        annualGross: Number(activeOffer.annual_gross),
        monthlyNet: Number(activeOffer.monthly_net),
        currency: activeOffer.currency === 'Naira' ? '₦' : activeOffer.currency === 'INR' ? 'INR' : 'USD',
        breakdown: [
            { label: "Basic Salary", value: activeOffer.bha_breakdown?.basic },
            { label: "Housing Allowance", value: activeOffer.bha_breakdown?.housing },
            { label: "Transport Allowance", value: activeOffer.bha_breakdown?.transport },
            { label: "Other Allowances", value: activeOffer.bha_breakdown?.other_allowances },
        ].filter(item => item.value !== undefined),
        nonCashBenefits: activeOffer.benefits?.map(b => b.name) || []
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
        <Box sx={{ bgcolor: isArchived ? archiveTheme.bgLight : '#F5F6F8', minHeight: '100vh', p: { xs: 2, md: 4 } }}>
            {/* Header */}
             <Box sx={{ mb: 4 }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => router.back()}
                    sx={{ textTransform: 'none', color: 'text.secondary', mb: 1, fontWeight: 600 }}
                >
                    Back
                </Button>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: isArchived ? `1px solid ${archiveTheme.border}` : 'none' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar 
                            // src={selectedCandidate?.profile_picture || ""}
                            sx={{ width: 56, height: 56, bgcolor: isArchived ? archiveTheme.primary : 'primary.main', fontSize: '1.5rem' }}
                        >
                            {selectedCandidate?.candidate_name?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h5" fontWeight={700}>{selectedCandidate?.candidate_name || activeOffer?.candidate_name || "Loading..."}</Typography>
                                {isArchived && <Chip label="ARCHIVED VERSION" size="small" sx={{ bgcolor: archiveTheme.primary, color: 'white', fontWeight: 600, borderRadius: 1, fontSize: '0.7rem' }} />}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {selectedCandidate?.role_applied_for}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 4, textAlign: 'right' }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block' }}>PROPOSED START DATE</Typography>
                            <Typography variant="body2" fontWeight={600}>Nov 12, 2024</Typography>
                        </Box>
                        
                         <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block' }}>LOCATION</Typography>
                            <Typography variant="body2" fontWeight={600}>Lagos</Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
                
                {/* Left Column: Version History */}
                <Box sx={{ width: { lg: 280 }, flexShrink: 0 }}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, mb: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <HistoryIcon color="action" />
                            <Typography variant="subtitle1" fontWeight={700}>Version History</Typography>
                        </Box>
                        <List dense>
                            {offers.map((offer, index) => {
                                const isSelected = index === safeActiveIndex;
                                const isRejected = index > 0; // Assuming all older are rejected/archived per req
                                return (
                                    <React.Fragment key={index}>
                                        <ListItem disablePadding sx={{ mb: 1 }}>
                                            <ListItemButton 
                                                onClick={() => setActiveIndex(index)}
                                                sx={{ 
                                                    borderRadius: 2, 
                                                    bgcolor: isSelected ? (isArchived ? '#ffebee' : '#E3F2FD') : 'transparent',
                                                    border: isSelected ? `1px solid ${isArchived ? archiveTheme.primary : '#1976D2'}` : '1px solid transparent'
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: isRejected ? '#ffebee' : '#E8F5E9', color: isRejected ? 'error.main' : 'success.main' }}>
                                                        {isRejected ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={
                                                        <Typography variant="body2" fontWeight={700}>
                                                            {index === 0 ? 'Current Version' : `Version ${offers.length - index}`}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="caption" color="text.secondary">
                                                            {index === 0 ? 'Active' : 'Rejected'}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                        {index < offers.length - 1 && <Divider component="li" variant="inset" sx={{ mb: 1 }} />}
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    </Paper>
                </Box>

                {/* Middle Column: Package Details */}
                <Box sx={{ flex: 1 }}>
                    {isArchived && (
                        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: '#FFEBEE', border: `1px solid ${archiveTheme.primary}`, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CancelIcon sx={{ color: archiveTheme.primary }} />
                            <Box>
                                <Typography variant="subtitle2" fontWeight={700} color={archiveTheme.primary}>Offer Rejected</Typography>
                                <Typography variant="body2" color="#B71C1C">Reason: Candidate requested higher base salary matching market rates.</Typography>
                            </Box>
                        </Paper>
                    )}

                    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 4, opacity: isArchived ? 0.8 : 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span style={{ fontSize: '1.2rem' }}>💵</span> Compensation Breakdown
                            </Typography>
                             <Tooltip title={hasApprovals || isArchived ? "Proposal locked. Cannot be edited." : ""}>
                                <span>
                                    <Button 
                                        size="small" 
                                        sx={{ textTransform: 'none', fontWeight: 600, color: isArchived ? 'text.disabled' : 'primary.main' }}
                                        onClick={handleEditPackage}
                                        disabled={hasApprovals || isArchived}
                                    >
                                        Edit Package
                                    </Button>
                                </span>
                            </Tooltip>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
                            <Box sx={{ flex: 1, p: 3, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>ANNUAL GROSS SALARY</Typography>
                                <Typography variant="h3" fontWeight={700} sx={{ mt: 1, color: isArchived ? '#424242' : 'inherit' }}>
                                    {salaryData.annualGross.toLocaleString()} <span style={{ fontSize: '1rem', color: '#666', fontWeight: 400 }}>{salaryData.currency}</span>
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1, p: 3, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>MONTHLY NET (ESTIMATE)</Typography>
                                <Typography variant="h4" fontWeight={700} color={isArchived ? 'text.primary' : "success.main"} sx={{ mt: 1 }}>
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
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: index % 2 === 0 ? (isArchived ? '#9e9e9e' : 'primary.main') : (isArchived ? '#bdbdbd' : 'secondary.main') }} />
                                            <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight={700}>{item?.value?.toLocaleString()}</Typography>
                                    </Box>
                                    <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ bgcolor: isArchived ? '#F5F5F5' : '#F0F9FF', p: 2, borderRadius: 2, border: '1px solid', borderColor: isArchived ? '#E0E0E0' : '#BAE6FD' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 1 }}>NON-CASH BENEFITS</Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1 }}>
                                {salaryData.nonCashBenefits.map((benefit, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircleIcon color={isArchived ? 'disabled' : "primary"} fontSize="small" />
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
                                {activeOffer?.approvals?.map((approval: InternalApproval) => (
                                    <Box key={approval.id} sx={{ mb: 2, p: 2, border: '1px solid #E0E0E0', borderRadius: 2, bgcolor: isArchived ? '#FAFAFA' : 'white' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="subtitle2" fontWeight={700} color={isArchived ? 'text.secondary' : 'text.primary'}>{approval.email}</Typography>
                                            <Chip 
                                                label={approval.is_expired ? "EXPIRED" : (isArchived ? "ARCHIVED" : "ACTIVE")} 
                                                size="small" 
                                                color={approval.is_expired ? "error" : (isArchived ? "default" : "success")}
                                                variant="outlined"
                                                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F5F5F5', borderRadius: 1, border: '1px solid #E0E0E0', flexGrow: 1 }}>
                                                <Typography variant="body2" sx={{ p: 1, fontFamily: 'monospace', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    Token: {approval.token}
                                                </Typography>
                                                {!isArchived && <IconButton size="small"><ContentCopyIcon fontSize="small" /></IconButton>}
                                            </Box>
                                            {!isArchived && (
                                                <Tooltip title="Refresh Token">
                                                    <IconButton color="primary" size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                                                        <RefreshIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    )}
                </Box>

                {/* Right Column: Approvals */}
                <Box sx={{ width: { lg: 320 }, flexShrink: 0 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Approval Chain</Typography>
                        
                        <Box sx={{ position: 'relative', pl: 2 }}>
                            {/* Vertical Line */}
                            <Box sx={{ position: 'absolute', left: 23, top: 15, bottom: 20, width: 2, bgcolor: '#E0E0E0' }} />

                             <Stack spacing={4}>
                                {activeOffer?.approvals && activeOffer.approvals.length > 0 ? (
                                    activeOffer.approvals.map((step) => (
                                        <Box key={step.id} sx={{ display: 'flex', gap: 2, position: 'relative' }}>
                                            <Box sx={{ 
                                                width: 48, height: 48, borderRadius: '50%', 
                                                bgcolor: step.status === 'approved' ? '#E6F4EA' : 
                                                         (step.status === 'rejected' ? '#ffebee' : 
                                                         (step.status === 'viewed' ? '#E3F2FD' : '#F5F5F5')),
                                                color: step.status === 'approved' ? 'success.main' : 
                                                       (step.status === 'rejected' ? 'error.main' :
                                                       (step.status === 'viewed' ? 'primary.main' : 'text.disabled')),
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                zIndex: 1, border: '4px solid white'
                                            }}>
                                                {step.status === 'approved' && <CheckCircleIcon />}
                                                {step.status === 'rejected' && <CancelIcon />}
                                                {(step.status === 'viewed' || step.status === 'bypassed') && <VisibilityIcon />}
                                                {step.status === 'pending' && <PendingIcon />}
                                                {step.status === 'sent' && <LockIcon fontSize="small" />}
                                            </Box>
                                            <Box sx={{ flexGrow: 1, pt: 0.5 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Typography variant="subtitle2" fontWeight={700} sx={{ wordBreak: 'break-all' }}>{step.email}</Typography>
                                                    
                                                    {step.status === 'pending' && <Chip label="PENDING" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#FFF8E1', color: '#F57C00' }} />}
                                                    {step.status === 'approved' && <Chip label="APPROVED" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#E6F4EA', color: 'success.main' }} />}
                                                    {step.status === 'rejected' && <Chip label="REJECTED" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: '#FFEBEE', color: 'error.main' }} />}
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

                        {!isArchived && (
                            <Button 
                                variant="contained" 
                                fullWidth 
                                startIcon={<SendIcon />}
                                sx={{ mt: 4, mb: 2, bgcolor: '#0D47A1', textTransform: 'none', py: 1.5, fontWeight: 600 }}
                                disabled={!hasApprovals}
                            >
                                Resend Notifications
                            </Button>
                        )}

                        {!isArchived && (
                            <>
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
                            </>
                        )}
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default InternalApprovalPage;
