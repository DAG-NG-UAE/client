"use client";

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    InputAdornment,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Button,
    Divider,
    Chip,
    Grid,
    Stack,
    useTheme,
    alpha,
    Breadcrumbs,
    Link,
    CircularProgress,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import TranslateIcon from '@mui/icons-material/Translate';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { useSelector } from '@/redux/store';
import { useSearchParams } from 'next/navigation';
import {
    fetchAdminPreferences,
    fetchSinglePreference,
    deleteSkillAction,
    addSkillAction,
    updateSkillAction,
    addOptionValueAction,
    updateOptionValueAction,
    createPreferenceAction
} from '@/redux/slices/preferences';

const PreferencePage = () => {
    const theme = useTheme();
    const searchParams = useSearchParams();
    const urlPrefKey = searchParams.get('prefKey');

    // Redux State
    const { preferences, selectedPreferenceDetail, rankingOptions, meta, loading, error } = useSelector((state) => state.preferences);

    // Local UI State
    const [page, setPage] = useState(1);
    const [searchTier1, setSearchTier1] = useState('');
    const [searchTier3, setSearchTier3] = useState('');
    const [selectedPrefKey, setSelectedPrefKey] = useState<string | null>(null);

    // Modal State
    const [deleteModal, setDeleteModal] = useState<{ open: boolean, skillId: number | string | null }>({ open: false, skillId: null });
    const [skillModal, setSkillModal] = useState<{ open: boolean, mode: 'add' | 'edit', skillId: number | string | null, skillName: string }>({
        open: false,
        mode: 'add',
        skillId: null,
        skillName: ''
    });
    const [optionModal, setOptionModal] = useState<{ open: boolean, mode: 'add' | 'edit', optionId: number | string | null, optionName: string }>({
        open: false,
        mode: 'add',
        optionId: null,
        optionName: ''
    });
    const [categoryModal, setCategoryModal] = useState({
        open: false,
        label: '',
        field_type: 'dropdown',
        category: 'both',
        is_linear: true
    });

    // Initial Fetch for Categories (Tier 1)
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAdminPreferences(page, 10, searchTier1);
        }, 500);
        return () => clearTimeout(timer);
    }, [page, searchTier1]);

    // Auto-select first item or item from URL
    useEffect(() => {
        if (!loading && preferences.length > 0) {
            if (!selectedPrefKey) {
                const targetKey = urlPrefKey || preferences[0].pref_key;
                handlePreferenceSelect(targetKey);
            }
        }
    }, [preferences, loading, urlPrefKey]);

    // Handle Selection of a Category/Preference
    const handlePreferenceSelect = (prefKey: string) => {
        setSelectedPrefKey(prefKey);
        fetchSinglePreference(prefKey);
    };

    // Modal Action Handlers
    const openDeleteModal = (skillId: number | string) => {
        setDeleteModal({ open: true, skillId });
    };

    const confirmDelete = async () => {
        if (selectedPrefKey && deleteModal.skillId) {
            await deleteSkillAction(deleteModal.skillId, selectedPrefKey);
            setDeleteModal({ open: false, skillId: null });
        }
    };

    const openSkillModal = (mode: 'add' | 'edit', skillId: number | string | null = null, currentName: string = '') => {
        setSkillModal({ open: true, mode, skillId, skillName: currentName });
    };

    const handleSkillSubmit = async () => {
        if (!selectedPrefKey) return;

        try {
            if (skillModal.mode === 'add') {
                await addSkillAction(selectedPrefKey, skillModal.skillName);
            } else if (skillModal.mode === 'edit' && skillModal.skillId) {
                await updateSkillAction(selectedPrefKey, skillModal.skillId, skillModal.skillName);
            }
            setSkillModal({ ...skillModal, open: false });
        } catch (err) { }
    };

    const openOptionModal = (mode: 'add' | 'edit', optionId: number | string | null = null, currentName: string = '') => {
        setOptionModal({ open: true, mode, optionId, optionName: currentName });
    };

    const handleOptionSubmit = async () => {
        if (!selectedPrefKey) return;

        try {
            if (optionModal.mode === 'add') {
                await addOptionValueAction(selectedPrefKey, optionModal.optionName);
            } else if (optionModal.mode === 'edit' && optionModal.optionId) {
                await updateOptionValueAction(selectedPrefKey, optionModal.optionId, optionModal.optionName);
            }
            setOptionModal({ ...optionModal, open: false });
        } catch (err) { }
    };

    const handleCategorySubmit = async () => {
        try {
            await createPreferenceAction({
                label: categoryModal.label,
                field_type: categoryModal.field_type,
                category: categoryModal.category,
                is_linear: categoryModal.is_linear
            });
            setCategoryModal({ open: false, label: '', field_type: 'dropdown', category: 'both', is_linear: true });
        } catch (err) { }
    };

    // Derived Data for Tier 2 and Tier 3
    const firstItem = selectedPreferenceDetail?.[0];
    const items = selectedPreferenceDetail || [];

    // Tier 2: Sort ranking options descending by rank as requested
    const sortedOptions = [...rankingOptions].sort((a, b) => b.rank - a.rank);

    return (
        <Box sx={{ p: 4, bgcolor: theme.palette.background.default, minHeight: '100vh', pb: 10 }}>
            {/* Header section */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                        Preference Master Setup
                    </Typography>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 1 }}>
                        <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
                        <Link underline="hover" color="inherit" href="/library">Library</Link>
                        <Typography color="text.primary">Preferences</Typography>
                    </Breadcrumbs>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* TIER 1: CATEGORIES */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper elevation={0} sx={{ p: 0, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, height: '80vh', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <FolderIcon sx={{ color: theme.palette.primary.main }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>Tier 1: Categories</Typography>
                            </Stack>
                            <IconButton
                                size="small"
                                sx={{ color: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                                onClick={() => setCategoryModal({ ...categoryModal, open: true })}
                            >
                                <AddIcon />
                            </IconButton>
                        </Box>

                        {/* <Box sx={{ px: 2, pb: 2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Filter categories..."
                                value={searchTier1}
                                onChange={(e) => setSearchTier1(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" color="disabled" />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 2, bgcolor: alpha(theme.palette.text.primary, 0.03) }
                                }}
                            />
                        </Box> */}

                        <List sx={{ flexGrow: 1, overflow: 'auto', px: 1 }}>
                            {loading && page === 1 && preferences.length === 0 ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress size={24} /></Box>
                            ) : (
                                preferences.map((pref) => (
                                    <ListItemButton
                                        key={pref.pref_key}
                                        selected={selectedPrefKey === pref.pref_key}
                                        onClick={() => handlePreferenceSelect(pref.pref_key)}
                                        sx={{
                                            mb: 0.5,
                                            borderRadius: 2,
                                            '&.Mui-selected': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: theme.palette.primary.main,
                                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) },
                                                '& .MuiListItemIcon-root': { color: theme.palette.primary.main }
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            {pref.pref_key.includes('lang') ? <TranslateIcon fontSize="small" /> : <SettingsIcon fontSize="small" />}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={pref.label}
                                            primaryTypographyProps={{ variant: 'body2', fontWeight: selectedPrefKey === pref.pref_key ? 600 : 500 }}
                                        />
                                        <ChevronRightIcon fontSize="small" sx={{ opacity: selectedPrefKey === pref.pref_key ? 1 : 0.3 }} />
                                    </ListItemButton>
                                ))
                            )}
                        </List>

                        <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                size="small"
                                count={meta?.totalPages || 1}
                                page={page}
                                onChange={(e, v) => setPage(v)}
                                color="primary"
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* TIER 2: SCALE CONFIGURATOR */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 0, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, height: '80vh', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <FilterListIcon sx={{ color: theme.palette.primary.main }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>Tier 2: Scale Configurator</Typography>
                            </Stack>
                            <Button
                                size="small"
                                variant="text"
                                sx={{ fontWeight: 600 }}
                                onClick={() => openOptionModal('add')}
                                disabled={!selectedPrefKey}
                            >
                                + Add Scale
                            </Button>
                        </Box>

                        {firstItem ? (
                            <>
                                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), mx: 2, mb: 2, borderRadius: 2, border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}` }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box sx={{ p: 1, bgcolor: '#fff', borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex' }}>
                                            <SettingsIcon sx={{ color: theme.palette.primary.main }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: theme.palette.primary.main }}>Active Category</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 700 }}>{firstItem.category_label}</Typography>
                                        </Box>
                                    </Stack>
                                </Box>

                                <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
                                    <Box sx={{ p: 2, mb: 3, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2, borderLeft: `4px solid ${theme.palette.info.main}` }}>
                                        <Typography variant="caption" sx={{ color: theme.palette.info.main, fontWeight: 700, display: 'block', mb: 0.5 }}>DISPLAY ONLY</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Ranks are fixed and displayed in descending order. Use 'Add Scale' to append new levels.
                                        </Typography>
                                    </Box>

                                    <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: theme.palette.text.secondary, mb: 3, display: 'block' }}>
                                        Current Hierarchy (High to Low)
                                    </Typography>

                                    <Stack spacing={1}>
                                        {sortedOptions.map((opt) => (
                                            <Box
                                                key={opt.id}
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: alpha(theme.palette.text.primary, 0.03),
                                                    border: `1px solid ${theme.palette.divider}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    position: 'relative',
                                                    '&:hover .edit-btn': { opacity: 1 }
                                                }}
                                            >
                                                <Box sx={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: '50%',
                                                    bgcolor: theme.palette.primary.main,
                                                    color: '#fff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 700,
                                                    fontSize: '0.8rem'
                                                }}>
                                                    {opt.rank}
                                                </Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, flexGrow: 1 }}>{opt.option_value}</Typography>
                                                <IconButton
                                                    className="edit-btn"
                                                    size="small"
                                                    sx={{ opacity: 0.3, transition: '0.2s' }}
                                                    onClick={() => openOptionModal('edit', opt.id, opt.option_value)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">Select a category to view scales</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* TIER 3: ITEM REPOSITORY */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper elevation={0} sx={{ p: 0, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, height: '80vh', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box sx={{ bgcolor: theme.palette.primary.main, p: 0.5, borderRadius: 1, display: 'flex' }}>
                                    <FileUploadIcon sx={{ color: '#fff', fontSize: 18 }} />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>Tier 3: Skill Set (optional)</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    variant="contained"
                                    
                                    onClick={() => openSkillModal('add')}
                                    disabled={!selectedPrefKey}
                                >
                                    Add Item
                                </Button>
                            </Stack>
                        </Box>

                        {/* <Box sx={{ px: 2, pb: 2, display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder={`Search items...`}
                                value={searchTier3}
                                onChange={(e) => setSearchTier3(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" color="disabled" />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 2, bgcolor: alpha(theme.palette.text.primary, 0.03) }
                                }}
                            />
                        </Box> */}

                        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: alpha(theme.palette.text.primary, 0.02), borderBottom: `1px solid ${theme.palette.divider}` }}>
                                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: theme.palette.text.secondary }}>Item Label</th>
                                        <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: theme.palette.text.secondary }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.filter(item => !searchTier3 || item.skill_name?.toLowerCase().includes(searchTier3.toLowerCase())).map((item, idx) => (
                                        <tr key={item.skill_id || idx} style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                                            <td style={{ padding: '16px' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.skill_name || firstItem?.category_label}</Typography>
                                                <Typography variant="caption" color="text.secondary">Type: {item.field_type}</Typography>
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'right' }}>
                                                <IconButton size="small" onClick={() => openSkillModal('edit', item.skill_id, item.skill_name || '')}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {items.length === 0 && (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">No items available. Select a category in Tier 1.</Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Category Addition Modal */}
            <Dialog open={categoryModal.open} onClose={() => setCategoryModal({ ...categoryModal, open: false })} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Add New Preference Category</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {error && <Alert severity="error">{error}</Alert>}

                        <TextField
                            fullWidth
                            label="Preference Label"
                            placeholder="e.g. Are you willing to work weekends?"
                            value={categoryModal.label}
                            onChange={(e) => setCategoryModal({ ...categoryModal, label: e.target.value })}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Field Type</InputLabel>
                            <Select
                                value={categoryModal.field_type}
                                label="Field Type"
                                onChange={(e) => setCategoryModal({ ...categoryModal, field_type: e.target.value })}
                            >
                                <MenuItem value="dropdown">Dropdown</MenuItem>
                                <MenuItem value="radio_group">Radio Group</MenuItem>
                                <MenuItem value="boolean">Boolean</MenuItem>
                                <MenuItem value="linear_scale">Linear Scale</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Category Scope</InputLabel>
                            <Select
                                value={categoryModal.category}
                                label="Category Scope"
                                onChange={(e) => setCategoryModal({ ...categoryModal, category: e.target.value })}
                            >
                                <MenuItem value="both">Both</MenuItem>
                                <MenuItem value="local">Local Candidate Only</MenuItem>
                                <MenuItem value="expat">Expat Candidate Only</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Matching Logic</InputLabel>
                            <Select
                                value={categoryModal.is_linear ? 'linear' : 'exact'}
                                label="Matching Logic"
                                onChange={(e) => setCategoryModal({ ...categoryModal, is_linear: e.target.value === 'linear' })}
                                renderValue={(value) => value === 'linear' ? 'Progressive (Linear)' : 'Exact Match (Non-Linear)'}
                            >
                                <MenuItem value="linear">
                                    <Box sx={{ py: 0.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Option A: Progressive (Linear)</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', whiteSpace: 'normal', maxWidth: 400 }}>
                                            "Higher answers are better. (e.g., If we ask for a Bachelors, a Masters is also a match)."
                                        </Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="exact">
                                    <Box sx={{ py: 0.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Option B: Exact Match (Non-Linear)</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', whiteSpace: 'normal', maxWidth: 400 }}>
                                            "Only the specific answer selected counts. (e.g., If we ask for 'Yes', then 'No' is a fail, regardless of rank)."
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setCategoryModal({ ...categoryModal, open: false })} color="inherit">Cancel</Button>
                    <Button
                        onClick={handleCategorySubmit}
                        variant="contained"
                        color="primary"
                        disabled={!categoryModal.label.trim() || loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Create Category'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModal.open} onClose={() => setDeleteModal({ open: false, skillId: null })} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningAmberIcon color="error" />
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this skill item? This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteModal({ open: false, skillId: null })} color="inherit">Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Add/Edit Skill Modal */}
            <Dialog open={skillModal.open} onClose={() => setSkillModal({ ...skillModal, open: false })} maxWidth="sm" fullWidth>
                <DialogTitle>{skillModal.mode === 'add' ? 'Add New Skill Item' : 'Edit Skill Item'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1 }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary }}>SKILL NAME</Typography>
                        <TextField
                            fullWidth
                            autoFocus
                            placeholder="Enter skill name (e.g. Hausa, Python, Masters)"
                            value={skillModal.skillName}
                            onChange={(e) => setSkillModal({ ...skillModal, skillName: e.target.value })}
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setSkillModal({ ...skillModal, open: false })} color="inherit">Cancel</Button>
                    <Button
                        onClick={handleSkillSubmit}
                        color="primary"
                        variant="contained"
                        disabled={!skillModal.skillName.trim() || loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Item'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Option Value Modal */}
            <Dialog open={optionModal.open} onClose={() => setOptionModal({ ...optionModal, open: false })} maxWidth="sm" fullWidth>
                <DialogTitle>{optionModal.mode === 'add' ? 'Add New Scale Option' : 'Edit Scale Option'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1 }}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary }}>OPTION NAME</Typography>
                        <TextField
                            fullWidth
                            autoFocus
                            placeholder="Enter scale level (e.g. MBA, Expert, Native)"
                            value={optionModal.optionName}
                            onChange={(e) => setOptionModal({ ...optionModal, optionName: e.target.value })}
                            sx={{ mt: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            New options are automatically assigned the next available rank.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOptionModal({ ...optionModal, open: false })} color="inherit">Cancel</Button>
                    <Button
                        onClick={handleOptionSubmit}
                        color="primary"
                        variant="contained"
                        disabled={!optionModal.optionName.trim() || loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Option'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PreferencePage;
