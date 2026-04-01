"use client";

import React, { useState } from 'react';
import {
    Box, Typography, Paper, TextField, Button, Stack, Chip,
    Switch, FormControlLabel, IconButton, Divider, Breadcrumbs,
    Link, useTheme, alpha, Tooltip, Autocomplete, CircularProgress,
    ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PublicIcon from '@mui/icons-material/Public';
import BusinessIcon from '@mui/icons-material/Business';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from '@/components/NotistackProvider';
import { createEvaluationCriteria, EvaluationCriteriaPayload } from '@/api/evaluation';

const DEPARTMENT_OPTIONS = [
    'HR & Admin', 'IT', 'Finance', 'Logistics', 'Treasury',
    'Sales 2wh', 'Sales 3wh', 'Marketing (Ground & BTL)', 'Tyre',
    'Service: Lubricant & Customer Service', 'Spare Part',
    'Pulsar: Service & Sales Pulsar', 'Production: 2wh Production',
    'Production: 3wh Production & Dispatch', 'A2Z', 'Digital',
];

const FieldLabel = ({ label, hint }: { label: string; hint: string }) => {
    const theme = useTheme();
    return (
        <Box sx={{ mb: 0.75 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.secondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.disabled, mt: 0.25 }}>
                {hint}
            </Typography>
        </Box>
    );
};

const emptyItem = (): EvaluationCriteriaPayload => ({
    competence_profile: '',
    parameter_name: '',
    guidance_points: [],
    is_global: true,
    departments: [],
});

export default function NewEvaluationPage() {
    const theme = useTheme();
    const router = useRouter();
    const [items, setItems] = useState<EvaluationCriteriaPayload[]>([emptyItem()]);
    const [guidanceInputs, setGuidanceInputs] = useState<string[]>(['']);
    const [loading, setLoading] = useState(false);

    const updateItem = (index: number, patch: Partial<EvaluationCriteriaPayload>) => {
        setItems(prev => prev.map((item, i) => i === index ? { ...item, ...patch } : item));
    };

    const addItem = () => {
        setItems(prev => [...prev, emptyItem()]);
        setGuidanceInputs(prev => [...prev, '']);
    };

    const removeItem = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
        setGuidanceInputs(prev => prev.filter((_, i) => i !== index));
    };

    const addGuidancePoint = (index: number) => {
        const point = guidanceInputs[index]?.trim();
        if (!point) return;
        updateItem(index, { guidance_points: [...(items[index].guidance_points || []), point] });
        setGuidanceInputs(prev => prev.map((v, i) => i === index ? '' : v));
    };

    const removeGuidancePoint = (itemIndex: number, pointIndex: number) => {
        updateItem(itemIndex, {
            guidance_points: items[itemIndex].guidance_points.filter((_, i) => i !== pointIndex),
        });
    };

    const handleSubmit = async () => {
        const valid = items.every(i => i.competence_profile.trim() && i.parameter_name.trim() && i.guidance_points.length > 0);
        if (!valid) {
            enqueueSnackbar('Please fill in all fields and add at least one guidance point per criterion.', { variant: 'error' });
            return;
        }
        try {
            setLoading(true);
            await createEvaluationCriteria(items);
            enqueueSnackbar('Evaluation criteria saved successfully.', { variant: 'success' });
            router.push('/library/evaluations');
        } catch (error: any) {
            enqueueSnackbar(error?.response?.data?.message || 'Failed to save. Please try again.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const borderColor = theme.palette.divider;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs sx={{ mb: 1, fontSize: '0.8rem' }}>
                    <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
                    <Link underline="hover" color="inherit" href="/library">Library</Link>
                    <Link underline="hover" color="inherit" href="/library/evaluations">Evaluations</Link>
                    <Typography color="text.primary" sx={{ fontSize: '0.8rem' }}>New Criteria</Typography>
                </Breadcrumbs>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>New Evaluation Criteria</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                            Build the grading framework interviewers will use to assess candidates.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{ px: 3, py: 1.2, fontWeight: 600, borderRadius: 2 }}
                    >
                        Save All Criteria
                    </Button>
                </Box>
            </Box>

            {/* Top-level legend */}
            <Paper elevation={0} sx={{ p: 2.5, mb: 4, borderRadius: 2, border: `1px solid ${borderColor}`, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <LightbulbOutlinedIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>How this works</Typography>
                </Stack>
                <Stack spacing={1}>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <PsychologyIcon sx={{ fontSize: 16, color: theme.palette.text.secondary, mt: 0.2 }} />
                        <Typography variant="caption" color="text.secondary">
                            <strong>Behavioral</strong> — Soft skills and attitudes: how a person thinks, communicates, leads, and collaborates. e.g. Teamwork, Adaptability, Communication.
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <EngineeringIcon sx={{ fontSize: 16, color: theme.palette.text.secondary, mt: 0.2 }} />
                        <Typography variant="caption" color="text.secondary">
                            <strong>Functional</strong> — Job-specific skills and technical knowledge required to perform the role. e.g. Financial Reporting, Product Knowledge, Route Planning.
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <PublicIcon sx={{ fontSize: 16, color: theme.palette.text.secondary, mt: 0.2 }} />
                        <Typography variant="caption" color="text.secondary">
                            <strong>Global</strong> criteria apply to all departments. <strong>Departmental</strong> criteria only appear when evaluating candidates for the selected departments.
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>

            {/* Criteria Cards */}
            <Stack spacing={3}>
                {items.map((item, index) => {
                    const profileAccent = item.competence_profile === 'Behavioral'
                        ? '#7b1fa2'
                        : theme.palette.primary.main;

                    return (
                        <Paper
                            key={index}
                            elevation={0}
                            sx={{ border: `1px solid ${borderColor}`, borderRadius: 3, overflow: 'hidden' }}
                        >
                            {/* Card Header */}
                            <Box sx={{
                                px: 3, py: 2,
                                bgcolor: alpha(profileAccent, 0.06),
                                borderBottom: `1px solid ${borderColor}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box sx={{
                                        width: 28, height: 28, borderRadius: '50%',
                                        bgcolor: profileAccent, color: '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700, fontSize: '0.8rem',
                                    }}>
                                        {index + 1}
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: profileAccent, lineHeight: 1.2 }}>
                                            {item.parameter_name || 'New Criterion'}
                                        </Typography>
                                        {item.competence_profile && (
                                            <Typography variant="caption" sx={{ color: alpha(profileAccent, 0.7) }}>
                                                {item.competence_profile}
                                            </Typography>
                                        )}
                                    </Box>
                                </Stack>
                                {items.length > 1 && (
                                    <Tooltip title="Remove this criterion">
                                        <IconButton
                                            size="small"
                                            onClick={() => removeItem(index)}
                                            sx={{ color: theme.palette.error.main, '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08) } }}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>

                            {/* Card Body */}
                            <Box sx={{ p: 3 }}>
                                <Stack spacing={3}>
                                    {/* Row 1: Competence Profile */}
                                    <Box>
                                        <FieldLabel
                                            label="Competence Profile"
                                            hint="The class this parameter belongs to — Behavioral (soft skills) or Functional (technical/role-specific)."
                                        />
                                        <ToggleButtonGroup
                                            exclusive
                                            value={item.competence_profile}
                                            onChange={(_, value) => { if (value) updateItem(index, { competence_profile: value }); }}
                                            size="small"
                                            sx={{ '& .MuiToggleButton-root': { borderRadius: '8px !important', px: 2.5, fontWeight: 600, textTransform: 'none', fontSize: '0.8rem' } }}
                                        >
                                            <ToggleButton value="Behavioral" sx={{
                                                '&.Mui-selected': { bgcolor: alpha('#7b1fa2', 0.1), color: '#7b1fa2', borderColor: alpha('#7b1fa2', 0.3) },
                                            }}>
                                                <PsychologyIcon sx={{ fontSize: 16, mr: 0.75 }} /> Behavioral
                                            </ToggleButton>
                                            <ToggleButton value="Functional" sx={{
                                                '&.Mui-selected': { bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, borderColor: alpha(theme.palette.primary.main, 0.3) },
                                            }}>
                                                <EngineeringIcon sx={{ fontSize: 16, mr: 0.75 }} /> Functional
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                    </Box>

                                    {/* Row 2: Parameter Name */}
                                    <Box>
                                        <FieldLabel
                                            label="Parameter Name"
                                            hint="The specific skill or trait being assessed. Keep it short and clear — it will appear as a heading on the scorecard. e.g. Problem Solving, Route Planning, Presentation Skills."
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="e.g. Problem Solving"
                                            value={item.parameter_name}
                                            onChange={(e) => updateItem(index, { parameter_name: e.target.value })}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Box>

                                    {/* Row 3: Guidance Points */}
                                    <Box>
                                        <FieldLabel
                                            label="Guidance Points"
                                            hint="Write short cues that tell the interviewer what to look for when grading. Think observable behaviours or evidence, not definitions. e.g. 'Subject matter expertise', 'Practical application', 'Clarity under pressure'."
                                        />
                                        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Type a cue and press Enter or +"
                                                value={guidanceInputs[index] || ''}
                                                onChange={(e) => setGuidanceInputs(prev => prev.map((v, i) => i === index ? e.target.value : v))}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addGuidancePoint(index); } }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                            <IconButton
                                                onClick={() => addGuidancePoint(index)}
                                                size="small"
                                                sx={{
                                                    bgcolor: profileAccent, color: '#fff',
                                                    borderRadius: 2, width: 36, height: 36,
                                                    '&:hover': { bgcolor: alpha(profileAccent, 0.85) },
                                                }}
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                        {item.guidance_points.length > 0 ? (
                                            <Box sx={{ p: 2, bgcolor: alpha(profileAccent, 0.03), borderRadius: 2, border: `1px solid ${alpha(profileAccent, 0.15)}` }}>
                                                <Stack direction="row" flexWrap="wrap" gap={1}>
                                                    {item.guidance_points.map((point, pi) => (
                                                        <Chip
                                                            key={pi}
                                                            label={point}
                                                            onDelete={() => removeGuidancePoint(index, pi)}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: alpha(profileAccent, 0.08),
                                                                color: profileAccent,
                                                                borderRadius: 1.5,
                                                                fontWeight: 500,
                                                                '& .MuiChip-deleteIcon': { color: profileAccent },
                                                            }}
                                                        />
                                                    ))}
                                                </Stack>
                                            </Box>
                                        ) : (
                                            <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                                                No cues yet — add at least one.
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Row 4: Scope */}
                                    <Box>
                                        <Divider sx={{ mb: 2 }} />
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
                                            <Box>
                                                <FieldLabel
                                                    label="Scope"
                                                    hint="Global applies this criterion to every department. Departmental restricts it."
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={item.is_global}
                                                            onChange={(e) => updateItem(index, {
                                                                is_global: e.target.checked,
                                                                departments: e.target.checked ? [] : item.departments,
                                                            })}
                                                            color="primary"
                                                            size="small"
                                                        />
                                                    }
                                                    label={
                                                        <Stack direction="row" spacing={0.75} alignItems="center">
                                                            {item.is_global
                                                                ? <><PublicIcon sx={{ fontSize: 15, color: theme.palette.primary.main }} /><Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Global</Typography></>
                                                                : <><BusinessIcon sx={{ fontSize: 15 }} /><Typography variant="body2" sx={{ fontWeight: 600 }}>Departmental</Typography></>
                                                            }
                                                        </Stack>
                                                    }
                                                />
                                            </Box>

                                            {!item.is_global && (
                                                <Box sx={{ flex: 1, minWidth: 260 }}>
                                                    <FieldLabel
                                                        label="Departments"
                                                        hint="Select the teams this criterion applies to."
                                                    />
                                                    <Autocomplete
                                                        multiple
                                                        options={DEPARTMENT_OPTIONS}
                                                        value={item.departments || []}
                                                        onChange={(_, value) => updateItem(index, { departments: value })}
                                                        renderTags={(value, getTagProps) =>
                                                            value.map((option, i) => {
                                                                const { key, ...tagProps } = getTagProps({ index: i });
                                                                return (
                                                                    <Chip
                                                                        key={key}
                                                                        label={option}
                                                                        size="small"
                                                                        {...tagProps}
                                                                        sx={{ borderRadius: 1.5, fontWeight: 500 }}
                                                                    />
                                                                );
                                                            })
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                size="small"
                                                                placeholder="Select departments..."
                                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                            />
                                                        )}
                                                    />
                                                </Box>
                                            )}
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Box>
                        </Paper>
                    );
                })}
            </Stack>

            {/* Add Another */}
            <Button
                onClick={addItem}
                startIcon={<AddIcon />}
                variant="outlined"
                sx={{
                    mt: 3, borderRadius: 2, borderStyle: 'dashed',
                    fontWeight: 600, color: theme.palette.primary.main,
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                    '&:hover': { borderStyle: 'dashed', bgcolor: alpha(theme.palette.primary.main, 0.04) },
                    width: '100%', py: 1.5,
                }}
            >
                Add Another Criterion
            </Button>

            {/* Bottom Save */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="outlined"
                    onClick={() => router.push('/library/evaluations')}
                    sx={{ px: 3, fontWeight: 600, borderRadius: 2 }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ px: 5, fontWeight: 600, borderRadius: 2 }}
                >
                    Save All Criteria
                </Button>
            </Box>
        </Box>
    );
}
