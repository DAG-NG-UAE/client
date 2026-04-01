"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, Paper, Stack, Chip, Button, IconButton,
    Breadcrumbs, Link, useTheme, alpha, Tooltip, Skeleton, Divider,
    ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PublicIcon from '@mui/icons-material/Public';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/navigation';
import { getEvaluationCriteria, EvaluationCriteria } from '@/api/evaluation';
import { enqueueSnackbar } from '@/components/NotistackProvider';

// A palette of distinct accent colors — cycles through based on profile index
const PROFILE_COLORS = ['#673ab7', '#0369a1', '#7b1fa2', '#15803d', '#b45309', '#c2185b', '#00796b'];

function getProfileColor(profile: string, allProfiles: string[]): string {
    const idx = allProfiles.indexOf(profile);
    return PROFILE_COLORS[idx % PROFILE_COLORS.length];
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function CriteriaCardSkeleton() {
    return (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2, bgcolor: 'action.hover' }}>
                <Skeleton width="40%" height={24} />
            </Box>
            <Box sx={{ p: 3 }}>
                <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
                <Stack direction="row" spacing={1}>
                    <Skeleton variant="rounded" width={80} height={24} />
                    <Skeleton variant="rounded" width={100} height={24} />
                    <Skeleton variant="rounded" width={70} height={24} />
                </Stack>
            </Box>
        </Paper>
    );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
    const theme = useTheme();
    return (
        <Box sx={{
            textAlign: 'center', py: 10,
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.02),
        }}>
            <AssignmentIcon sx={{ fontSize: 56, color: alpha(theme.palette.primary.main, 0.25), mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>No evaluation criteria yet</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start building your grading framework so interviewers have clear guidance.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd} sx={{ borderRadius: 2, fontWeight: 600 }}>
                Add First Criterion
            </Button>
        </Box>
    );
}

// ─── Criteria card ────────────────────────────────────────────────────────────

function CriteriaCard({ criterion, accent }: { criterion: EvaluationCriteria; accent: string }) {
    const theme = useTheme();
    return (
        <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{
                px: 3, py: 2,
                bgcolor: alpha(accent, 0.06),
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{
                        width: 10, height: 10, borderRadius: '50%',
                        bgcolor: accent, flexShrink: 0,
                    }} />
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: accent, lineHeight: 1.2 }}>
                            {criterion.parameter_name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: alpha(accent, 0.7) }}>
                            {criterion.competency_profile}
                        </Typography>
                    </Box>
                </Stack>

                {criterion.is_global ? (
                    <Chip
                        icon={<PublicIcon sx={{ fontSize: '14px !important' }} />}
                        label="Global"
                        size="small"
                        sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.main,
                            fontWeight: 600, fontSize: '0.72rem',
                            '& .MuiChip-icon': { color: theme.palette.primary.main },
                        }}
                    />
                ) : (
                    <Chip
                        icon={<BusinessIcon sx={{ fontSize: '14px !important' }} />}
                        label="Departmental"
                        size="small"
                        sx={{
                            bgcolor: alpha(theme.palette.warning.main, 0.08),
                            color: theme.palette.warning.dark,
                            fontWeight: 600, fontSize: '0.72rem',
                            '& .MuiChip-icon': { color: theme.palette.warning.dark },
                        }}
                    />
                )}
            </Box>

            {/* Body */}
            <Box sx={{ p: 3 }}>
                {criterion.guidance_points.length > 0 && (
                    <Box sx={{ mb: !criterion.is_global && criterion.departments.length > 0 ? 2 : 0 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                            Guidance Points
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={0.75}>
                            {criterion.guidance_points.map((point, i) => (
                                <Chip
                                    key={i}
                                    label={point}
                                    size="small"
                                    sx={{ bgcolor: alpha(accent, 0.07), color: accent, borderRadius: 1.5, fontWeight: 500, fontSize: '0.75rem' }}
                                />
                            ))}
                        </Stack>
                    </Box>
                )}

                {!criterion.is_global && criterion.departments.length > 0 && (
                    <>
                        <Divider sx={{ my: 1.5 }} />
                        <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                                Applies to
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" gap={0.75}>
                                {criterion.departments.map((dept, i) => (
                                    <Chip key={i} label={dept} size="small" variant="outlined" sx={{ borderRadius: 1.5, fontSize: '0.72rem' }} />
                                ))}
                            </Stack>
                        </Box>
                    </>
                )}
            </Box>
        </Paper>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EvaluationsListPage() {
    const theme = useTheme();
    const router = useRouter();
    const [criteria, setCriteria] = useState<EvaluationCriteria[]>([]);
    const [loading, setLoading] = useState(true);
    const [profileFilter, setProfileFilter] = useState<string>('all');
    const [scopeFilter, setScopeFilter] = useState<'all' | 'global' | 'departmental'>('all');

    const loadCriteria = async () => {
        try {
            setLoading(true);
            const data = await getEvaluationCriteria();
            setCriteria(data || []);
        } catch (error: any) {
            enqueueSnackbar(error?.response?.data?.message || 'Failed to load evaluation criteria.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadCriteria(); }, []);

    // All unique profiles, derived from data
    const allProfiles = useMemo(
        () => [...new Set(criteria.map(c => c.competency_profile))].sort(),
        [criteria]
    );

    const filtered = useMemo(() => criteria.filter(c => {
        if (profileFilter !== 'all' && c.competency_profile !== profileFilter) return false;
        if (scopeFilter === 'global' && !c.is_global) return false;
        if (scopeFilter === 'departmental' && c.is_global) return false;
        return true;
    }), [criteria, profileFilter, scopeFilter]);

    // Group filtered results by profile (preserving allProfiles order)
    const groupedByProfile = useMemo(() => {
        const profilesToShow = profileFilter === 'all' ? allProfiles : [profileFilter];
        return profilesToShow
            .map(profile => ({
                profile,
                accent: getProfileColor(profile, allProfiles),
                items: filtered.filter(c => c.competency_profile === profile),
            }))
            .filter(g => g.items.length > 0);
    }, [filtered, allProfiles, profileFilter]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs sx={{ mb: 1, fontSize: '0.8rem' }}>
                    <Link underline="hover" color="inherit" href="/dashboard">Dashboard</Link>
                    <Link underline="hover" color="inherit" href="/library">Library</Link>
                    <Typography color="text.primary" sx={{ fontSize: '0.8rem' }}>Evaluations</Typography>
                </Breadcrumbs>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>Evaluation Criteria</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                            Grading framework used by interviewers to assess candidates.
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Tooltip title="Refresh">
                            <IconButton onClick={loadCriteria} size="small" sx={{ color: 'text.secondary' }}>
                                <RefreshIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => router.push('/library/evaluations/new')}
                            sx={{ px: 3, py: 1.2, fontWeight: 600, borderRadius: 2 }}
                        >
                            Add Criteria
                        </Button>
                    </Stack>
                </Box>
            </Box>

            {/* Filters — only shown once data is loaded and non-empty */}
            {!loading && criteria.length > 0 && (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }} alignItems="flex-start" flexWrap="wrap">
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75, display: 'block' }}>
                            Profile
                        </Typography>
                        <ToggleButtonGroup
                            exclusive
                            value={profileFilter}
                            onChange={(_, v) => { if (v) setProfileFilter(v); }}
                            size="small"
                            sx={{ '& .MuiToggleButton-root': { px: 2, fontWeight: 600, textTransform: 'none', fontSize: '0.8rem', borderRadius: '8px !important' } }}
                        >
                            <ToggleButton value="all">All</ToggleButton>
                            {allProfiles.map(profile => {
                                const color = getProfileColor(profile, allProfiles);
                                return (
                                    <ToggleButton
                                        key={profile}
                                        value={profile}
                                        sx={{ '&.Mui-selected': { bgcolor: alpha(color, 0.1), color } }}
                                    >
                                        {profile}
                                    </ToggleButton>
                                );
                            })}
                        </ToggleButtonGroup>
                    </Box>

                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.75, display: 'block' }}>
                            Scope
                        </Typography>
                        <ToggleButtonGroup
                            exclusive
                            value={scopeFilter}
                            onChange={(_, v) => { if (v) setScopeFilter(v); }}
                            size="small"
                            sx={{ '& .MuiToggleButton-root': { px: 2, fontWeight: 600, textTransform: 'none', fontSize: '0.8rem', borderRadius: '8px !important' } }}
                        >
                            <ToggleButton value="all">All</ToggleButton>
                            <ToggleButton value="global">Global</ToggleButton>
                            <ToggleButton value="departmental">Departmental</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ ml: 'auto !important', display: 'flex', alignItems: 'flex-end', pb: 0.25 }}>
                        <Typography variant="body2" color="text.secondary">
                            Showing <strong>{filtered.length}</strong> of <strong>{criteria.length}</strong>
                        </Typography>
                    </Box>
                </Stack>
            )}

            {/* Loading */}
            {loading && (
                <Stack spacing={2}>
                    {[1, 2, 3].map(i => <CriteriaCardSkeleton key={i} />)}
                </Stack>
            )}

            {/* Empty state */}
            {!loading && criteria.length === 0 && (
                <EmptyState onAdd={() => router.push('/library/evaluations/new')} />
            )}

            {/* No results after filter */}
            {!loading && criteria.length > 0 && filtered.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary">No criteria match the selected filters.</Typography>
                    <Button size="small" sx={{ mt: 1 }} onClick={() => { setProfileFilter('all'); setScopeFilter('all'); }}>
                        Clear filters
                    </Button>
                </Box>
            )}

            {/* Grouped results */}
            {!loading && groupedByProfile.length > 0 && (
                <Stack spacing={5}>
                    {groupedByProfile.map(({ profile, accent, items }) => (
                        <Box key={profile}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: accent }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, color: accent }}>
                                    {profile}
                                </Typography>
                                <Chip
                                    label={items.length}
                                    size="small"
                                    sx={{ bgcolor: alpha(accent, 0.1), color: accent, fontWeight: 700, height: 20, fontSize: '0.72rem' }}
                                />
                            </Stack>
                            <Stack spacing={2}>
                                {items.map(c => (
                                    <CriteriaCard key={c.evaluation_criteria_id} criterion={c} accent={accent} />
                                ))}
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            )}
        </Box>
    );
}
