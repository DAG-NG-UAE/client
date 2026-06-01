"use client"

import React, { useEffect } from 'react';
import { Box, CircularProgress, Chip, Typography, Stack } from '@mui/material';
import { Requisition } from '@/interface/requisition';
import { ZONE_COLORS } from '@/utils/requisitionStatsGrouping';
import { getStatusChipProps } from '@/utils/statusColorMapping';
import { fetchRequisitionStats } from '@/redux/slices/summary';
import { useSelector } from '@/redux/store';
import { RootState } from '@/redux/store';

interface Props {
    requisition: Partial<Requisition>;
}

const RequisitionInlineStats = ({ requisition }: Props) => {
    const id = requisition.requisition_id ?? '';

    const grouped = useSelector((state: RootState) => state.summary.statsByRequisitionId[id]);
    const isLoading = useSelector((state: RootState) => state.summary.loadingIds.includes(id));
    const hasError = useSelector((state: RootState) => state.summary.errorIds.includes(id));

    useEffect(() => {
        if (!id) return;
        fetchRequisitionStats(id);
    }, [id]);

    if (isLoading) {
        return (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={20} />
            </Box>
        );
    }

    if (hasError) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="error" variant="body2">Failed to load stats.</Typography>
            </Box>
        );
    }

    if (!grouped) return null;

    return (
        <Box sx={{ p: 2, backgroundColor: 'background.default', display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            {/* Total candidates anchor */}
            {/* <Box
                sx={{
                    minWidth: 80,
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center',
                    flexShrink: 0,
                    backgroundColor: 'background.paper',
                }}
            >
                <Typography variant="h5" fontWeight={700} lineHeight={1}>
                    {grouped.totalCandidates}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Total Candidates
                </Typography>
            </Box> */}

            {/* Zone cards — white bg, colored left border */}
            <Stack direction="row" flexWrap="wrap" gap={1.5} flex={1}>
                {grouped.zones.map((zone) => {
                    const colors = ZONE_COLORS[zone.label];
                    return (
                        <Box
                            key={zone.label}
                            sx={{
                                minWidth: 160,
                                flex: '1 1 160px',
                                p: 1.5,
                                borderRadius: 2,
                                borderLeft: `4px solid ${colors.border}`,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderLeftColor: colors.border,
                                backgroundColor: 'background.paper',
                            }}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                <Typography
                                    variant="caption"
                                    fontWeight={700}
                                    sx={{ color: colors.text, textTransform: 'uppercase', letterSpacing: 0.5 }}
                                >
                                    {zone.label}
                                </Typography>
                                <Typography variant="h6" fontWeight={700} sx={{ color: colors.text, lineHeight: 1 }}>
                                    {zone.total}
                                </Typography>
                            </Stack>

                            {zone.stages.length === 0 ? (
                                <Typography variant="caption" color="text.disabled">
                                    No candidates
                                </Typography>
                            ) : (
                                <Stack gap={0.75}>
                                    {zone.stages.map((stage) => (
                                        <Stack key={stage.status} direction="row" justifyContent="space-between" alignItems="center">
                                            <Chip
                                                {...getStatusChipProps(stage.status)}
                                                size="small"
                                                sx={{
                                                    borderRadius: '6px',
                                                    fontWeight: 500,
                                                    fontSize: '0.65rem',
                                                    height: 20,
                                                    ...(getStatusChipProps(stage.status).sx || {}),
                                                }}
                                            />
                                            <Typography variant="caption" fontWeight={600} color="text.primary">
                                                {stage.count}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default RequisitionInlineStats;
