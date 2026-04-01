"use client";
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, TextField,
    ToggleButton, ToggleButtonGroup, IconButton, Stack, Divider,
    Switch, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Chip,
    Autocomplete, CircularProgress, alpha,
    ListItemAvatar, ListItemText
} from '@mui/material';
import {
    DeleteOutline as DeleteIcon,
    Add as AddIcon,
    CheckCircle as CheckCircleIcon,
    Visibility as VisibilityIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    CheckCircleOutline as CheckCircleOutlineIcon
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchSingleCandidate } from '@/redux/slices/candidates';
import { callFetchInternalSalaryOffer, callSendInternalSalaryOffer } from '@/redux/slices/offer';
import { searchInterviewers } from '@/api/interview';

interface Interviewer {
    id: string;
    displayName: string;
    mail: string;
    jobTitle: string;
}

const EditPackagePage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const dispatch = useDispatch<any>();

    const { selectedCandidate } = useSelector((state: RootState) => state.candidates);
    const { internalOffer } = useSelector((state: RootState) => state.offers);

    useEffect(() => {
        if (id) {
            if (!selectedCandidate || selectedCandidate.candidate_id !== id) {
                fetchSingleCandidate(id);
            }
            if (!internalOffer) {
                callFetchInternalSalaryOffer(id);
            }
        }
    }, [id, dispatch, selectedCandidate, internalOffer]);

    // State
    const [currency, setCurrency] = useState('Naira');
    const [components, setComponents] = useState({
        basic: 0,
        housing: 0,
        transport: 0,
        variable: 0
    });
    const [benefits, setBenefits] = useState([
        { id: 1, name: "Health Insurance (HMO) - Family", active: true },
        { id: 2, name: "Pension Scheme (Employer Contribution)", active: true },
        { id: 3, name: "13th Month Salary", active: false },
        { id: 4, name: "Performance Based Bonus", active: false },
        { id: 5, name: "Remote / Hybrid Work Option", active: true },
        { id: 6, name: "Gym & Wellness Subscription", active: false },
        { id: 7, name: "Professional Development Budget", active: true },
        { id: 8, name: "Group Life Insurance", active: true },
        { id: 9, name: "Official Car / Driver", active: false },
        { id: 10, name: "Annual Flight Tickets (Expat)", active: false },
        { id: 11, name: "Upfront Housing Payment", active: false },
        { id: 12, name: "Visa & Residency Support", active: false },
        { id: 13, name: "Relocation Allowance", active: false },
        { id: 14, name: "Social Club Membership", active: false },
    ]);
    const [openModal, setOpenModal] = useState(false);
    const [newBenefitName, setNewBenefitName] = useState('');

    const [totals, setTotals] = useState({
        annualGross: 0,
        monthlyNet: 0
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Interviewer[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedApprovers, setSelectedApprovers] = useState<Interviewer[]>([]);

    // Simple debounce implementation for search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!searchQuery || searchQuery.length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const results = await searchInterviewers(searchQuery);
                setSearchResults(results || []);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Populate state from internalOffer if available
    useEffect(() => {
        if (internalOffer) {
            setCurrency(internalOffer.currency || 'Naira');
            setComponents({
                basic: internalOffer.bha_breakdown?.basic || 0,
                housing: internalOffer.bha_breakdown?.housing || 0,
                transport: internalOffer.bha_breakdown?.transport || 0,
                variable: internalOffer.bha_breakdown?.other_allowances || 0
            });
            setTotals({
                annualGross: Number(internalOffer.annual_gross) || 0,
                monthlyNet: Number(internalOffer.monthly_net) || 0
            });

            if (internalOffer.benefits) {
                const offerBenefitNames = internalOffer.benefits.map(b => b.name);
                setBenefits(prev => prev.map(b => ({
                    ...b,
                    active: offerBenefitNames.includes(b.name)
                })));
            }

            if (internalOffer.approvals) {
                // Map existing approvals to Interviewer format if possible
                const existing = internalOffer.approvals.map(a => ({
                    id: a.id,
                    displayName: a.email.split('@')[0], // Fallback name
                    mail: a.email,
                    jobTitle: 'Approver'
                }));
                setSelectedApprovers(existing as any);
            }
        }
    }, [internalOffer]);

    const handleComponentChange = (field: string, value: string) => {
        const numValue = parseFloat(value.replace(/,/g, '')) || 0;
        setComponents({ ...components, [field]: numValue });
    };

    const handleTotalChange = (field: string, value: string) => {
        const numValue = parseFloat(value.replace(/,/g, '')) || 0;
        setTotals({ ...totals, [field]: numValue });
    };

    const handleToggleBenefit = (id: number) => {
        setBenefits(benefits.map(b => b.id === id ? { ...b, active: !b.active } : b));
    };

    const handleAddBenefit = () => {
        if (!newBenefitName.trim()) return;
        const newBenefit = { id: Date.now(), name: newBenefitName, active: true };
        setBenefits([...benefits, newBenefit]);
        setNewBenefitName('');
        setOpenModal(false);
    };

    const handleSaveAndProceed = async () => {
        const emailList = selectedApprovers.map(a => a.mail).filter(e => e);
        const payload = {
            candidateId: id,
            requisitionId: selectedCandidate?.requisition_id || 'REQ_DEFAULT',
            emails: emailList.length > 0 ? emailList : ["isabellakpai@gmail.com", "okorofth@gmail.com"],
            internalSalaryOffer: {
                annual_salary: totals.annualGross,
                monthly_net: totals.monthlyNet,
                currency,
                bha_breakdown: {
                    basic: components.basic,
                    housing: components.housing,
                    transport: components.transport,
                    other_allowances: components.variable
                },
                benefits: benefits.filter(b => b.active).map(b => ({ name: b.name }))
            }
        };
        await callSendInternalSalaryOffer(payload);
        router.push(`/candidates/internal-salary-proposal/${id}`);
    };

    return (
        <Box sx={{ bgcolor: '#F5F6F8', minHeight: '100vh', p: { xs: 2, md: 4 }, pb: 10 }}>
            {/* Header */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" fontWeight={700}>Editing Salary Package</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Candidate: <span style={{ fontWeight: 600, color: 'black' }}>{selectedCandidate?.candidate_name}</span> • {selectedCandidate?.role_applied_for}
                    </Typography>
                </Box>
                <Button variant="contained" color="inherit" onClick={() => router.push(`/candidates/view/${id}`)} sx={{ textTransform: 'none', bgcolor: '#F5F5F5', color: 'text.primary', boxShadow: 'none' }}>
                    View Profile
                </Button>
            </Paper>

            {/* Currency Selection */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700}>Currency Selection</Typography>
                <ToggleButtonGroup
                    value={currency}
                    exclusive
                    onChange={(e, val) => val && setCurrency(val)}
                    size="small"
                >
                    <ToggleButton value="Naira" sx={{ px: 3 }}>Naira (₦)</ToggleButton>
                    <ToggleButton value="USD" sx={{ px: 3 }}>USD ($)</ToggleButton>
                    <ToggleButton value="INR" sx={{ px: 3 }}>INR (₹)</ToggleButton>
                </ToggleButtonGroup>
            </Paper>

            {/* Financial Overview */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>Financials Overview</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <Box>
                        <Typography variant="caption" fontWeight={700} color="text.secondary">Annual Gross Salary</Typography>
                        <TextField
                            fullWidth
                            placeholder="0.00"
                            value={totals.annualGross ? totals.annualGross.toLocaleString() : ''}
                            onChange={(e) => handleTotalChange('annualGross', e.target.value)}
                            type="text"
                            InputProps={{
                                startAdornment: <Typography color="text.secondary" fontWeight={600} sx={{ mr: 1 }}>{currency === 'Naira' ? '₦' : currency === 'USD' ? '$' : '₹'}</Typography>
                            }}
                            sx={{ mt: 1 }}
                        />
                    </Box>
                    <Box>
                        <Typography variant="caption" fontWeight={700} color="text.secondary">Monthly Net (Estimate)</Typography>
                        <TextField
                            fullWidth
                            placeholder="0.00"
                            value={totals.monthlyNet ? totals.monthlyNet.toLocaleString() : ''}
                            onChange={(e) => handleTotalChange('monthlyNet', e.target.value)}
                            type="text"
                            InputProps={{
                                startAdornment: <Typography color="text.secondary" fontWeight={600} sx={{ mr: 1 }}>{currency === 'Naira' ? '₦' : currency === 'USD' ? '$' : '₹'}</Typography>
                            }}
                            sx={{ mt: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.5, display: 'block' }}>Manually entered</Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Core Breakdown */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>Core Component Breakdown (BHA)</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <Box>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: 'block' }}>Basic Pay</Typography>
                        <TextField fullWidth placeholder="0.00" value={components.basic ? components.basic.toLocaleString() : ''} onChange={(e) => handleComponentChange('basic', e.target.value)} type="text" />
                    </Box>
                    <Box>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: 'block' }}>Housing Allowance</Typography>
                        <TextField fullWidth placeholder="0.00" value={components.housing ? components.housing.toLocaleString() : ''} onChange={(e) => handleComponentChange('housing', e.target.value)} type="text" />
                    </Box>
                    <Box>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: 'block' }}>Transport Allowance</Typography>
                        <TextField fullWidth placeholder="0.00" value={components.transport ? components.transport.toLocaleString() : ''} onChange={(e) => handleComponentChange('transport', e.target.value)} type="text" />
                    </Box>
                    <Box>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: 'block' }}>Other Allowances (Variable/Utilities)</Typography>
                        <TextField fullWidth placeholder="0.00" value={components.variable ? components.variable.toLocaleString() : ''} onChange={(e) => handleComponentChange('variable', e.target.value)} type="text" />
                    </Box>
                </Box>
            </Paper>

            {/* Non-Cash Benefits */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700}>Non-Cash Benefits & Perks</Typography>
                    <Button
                        startIcon={<AddIcon />}
                        size="small"
                        onClick={() => setOpenModal(true)}
                        sx={{ textTransform: 'none' }}
                    >
                        Add Benefit
                    </Button>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    {benefits.map(benefit => (
                        <Box key={benefit.id} sx={{ p: 2, border: '1px solid', borderColor: benefit.active ? 'primary.light' : 'divider', borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: benefit.active ? '#E3F2FD' : 'background.paper' }}>
                            <Typography variant="body2" fontWeight={benefit.active ? 600 : 400} color={benefit.active ? 'text.primary' : 'text.secondary'}>{benefit.name}</Typography>
                            <Switch
                                checked={benefit.active}
                                onChange={() => handleToggleBenefit(benefit.id)}
                                size="small"
                            />
                        </Box>
                    ))}
                </Box>
            </Paper>

            {/* Approvers Section */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Approver List</Typography>
                <Autocomplete
                    multiple
                    options={searchResults}
                    getOptionLabel={(option) => `${option.displayName} (${option.mail})`}
                    value={selectedApprovers}
                    onChange={(e, newValue) => setSelectedApprovers(newValue)}
                    onInputChange={(e, newInputValue) => setSearchQuery(newInputValue)}
                    loading={isSearching}
                    filterSelectedOptions
                    isOptionEqualToValue={(option, value) => option.mail === value.mail}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search Approvers"
                            placeholder="Type name or email..."
                            helperText="These users will receive an email to approve this offer."
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <>
                                        <SearchIcon sx={{ color: 'text.disabled', ml: 1, mr: -0.5 }} />
                                        {params.InputProps.startAdornment}
                                    </>
                                ),
                                endAdornment: (
                                    <React.Fragment>
                                        {isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
                    renderOption={(props, option) => {
                        const { key, ...optionProps } = props as any;
                        return (
                            <Box
                                key={key}
                                component="li"
                                {...optionProps}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    py: 1.5,
                                    px: 2,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&:last-child': { borderBottom: 0 }
                                }}
                            >
                                <ListItemAvatar sx={{ minWidth: 48 }}>
                                    <Box sx={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        bgcolor: alpha('#155dfc', 0.1), color: 'primary.main',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700, fontSize: '0.75rem'
                                    }}>
                                        {option.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </Box>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={option.displayName}
                                    secondary={
                                        <Typography variant="caption" color="text.secondary" component="span">
                                            {option.jobTitle} • {option.mail}
                                        </Typography>
                                    }
                                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                                />
                                {selectedApprovers.find(i => i.mail === option.mail) && (
                                    <CheckCircleOutlineIcon color="success" fontSize="small" />
                                )}
                            </Box>
                        );
                    }}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                label={option.displayName}
                                {...getTagProps({ index })}
                                key={option.mail}
                                size="small"
                                sx={{ borderRadius: 1 }}
                            />
                        ))
                    }
                />
            </Paper>

            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 700 }}>Add New Benefit</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Benefit Name"
                        fullWidth
                        variant="outlined"
                        value={newBenefitName}
                        onChange={(e) => setNewBenefitName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleAddBenefit} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>

            {/* Footer Actions */}
            <Paper elevation={0} sx={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10,
                p: 2, borderTop: '1px solid #E0E0E0', display: 'flex', justifyContent: 'flex-end', gap: 2,
                bgcolor: 'white' // Make sure it's opaque
            }}>
                <Button onClick={() => router.back()} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
                <Button
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    sx={{ textTransform: 'none', fontWeight: 700, px: 4 }}
                    onClick={handleSaveAndProceed}
                >
                    Save & Proceed to Approval
                </Button>
            </Paper>
        </Box>
    );
};

export default EditPackagePage;
