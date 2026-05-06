"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    Alert, Box, CircularProgress, Dialog, DialogActions, DialogContent,
    DialogTitle, Divider, InputAdornment, List, ListItemButton, ListItemText,
    Radio, TextField, Typography, Button, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { CandidateProfile } from '@/interface/candidate';
import { Requisition } from '@/interface/requisition';
import { getRequisitions } from '@/api/requisitionApi';

const BLOCKED_STATUSES = ['offer_accepted', 'offer_rejected', 'offer_extended'];
const RESET_STATUSES = ['rejected'];

interface CandidateMoveRequisitionModalProps {
    open: boolean;
    onClose: () => void;
    selectedCandidates: Map<string, Partial<CandidateProfile>>;
    onMove: (targetRequisitionId: string, eligibleCandidates: Array<{ candidate_id: string; old_status: string; new_status: string; requisition_id: string }>) => Promise<void>;
}

export default function CandidateMoveRequisitionModal({
    open,
    onClose,
    selectedCandidates,
    onMove,
}: CandidateMoveRequisitionModalProps) {
    const [requisitions, setRequisitions] = useState<Partial<Requisition>[]>([]);
    const [fetching, setFetching] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedReqId, setSelectedReqId] = useState('');
    const [moving, setMoving] = useState(false);

    useEffect(() => {
        if (!open) return;
        setSearch('');
        setSelectedReqId('');
        const load = async () => {
            setFetching(true);
            try {
                const res = await getRequisitions(undefined, 1, 100);
                // Exclude closed requisitions
                setRequisitions((res.data || []).filter((r: Partial<Requisition>) => r.status !== 'closed'));
            } catch {
                setRequisitions([]);
            } finally {
                setFetching(false);
            }
        };
        load();
    }, [open]);

    const allCandidates = useMemo(() => Array.from(selectedCandidates.values()), [selectedCandidates]);

    const blocked = useMemo(
        () => allCandidates.filter(c => BLOCKED_STATUSES.includes(c.current_status?.toLowerCase() ?? '')),
        [allCandidates]
    );

    const eligible = useMemo(
        () => allCandidates.filter(c => !BLOCKED_STATUSES.includes(c.current_status?.toLowerCase() ?? '')),
        [allCandidates]
    );

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return requisitions.filter(r =>
            r.position?.toLowerCase().includes(q) ||
            r.department?.toLowerCase().includes(q)
        );
    }, [requisitions, search]);

    const buildPayload = (targetRequisitionId: string) =>
        eligible.map(c => {
            const currentStatus = c.current_status?.toLowerCase() ?? 'applied';
            const newStatus = RESET_STATUSES.includes(currentStatus) ? 'applied' : currentStatus;
            return {
                candidate_id: c.candidate_id!,
                old_status: currentStatus,
                new_status: newStatus,
                requisition_id: targetRequisitionId,
            };
        });

    const handleConfirm = async () => {
        if (!selectedReqId || eligible.length === 0) return;
        setMoving(true);
        try {
            await onMove(selectedReqId, buildPayload(selectedReqId));
            onClose();
        } finally {
            setMoving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Move to Requisition</DialogTitle>

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>

                {/* Blocked warning */}
                {blocked.length > 0 && (
                    <Alert severity="warning" sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                            {blocked.length} candidate(s) will be skipped — their status cannot be transferred:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {blocked.map(c => (
                                <Chip key={c.candidate_id} label={`${c.candidate_name} (${c.current_status})`} size="small" />
                            ))}
                        </Box>
                    </Alert>
                )}

                {/* Eligible count */}
                <Typography variant="body2" color="text.secondary">
                    {eligible.length} candidate(s) will be moved. Rejected candidates will be reset to <strong>Applied</strong> in the new requisition.
                </Typography>

                <Divider />

                {/* Search */}
                <TextField
                    size="small"
                    placeholder="Search by position or department..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        )
                    }}
                />

                {/* Requisition list */}
                {fetching ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                        <CircularProgress size={28} />
                    </Box>
                ) : (
                    <List dense disablePadding sx={{ maxHeight: 320, overflowY: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        {filtered.length === 0 ? (
                            <Box sx={{ py: 3, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">No requisitions found</Typography>
                            </Box>
                        ) : filtered.map(r => (
                            <ListItemButton
                                key={r.requisition_id}
                                selected={selectedReqId === r.requisition_id}
                                onClick={() => setSelectedReqId(r.requisition_id!)}
                                divider
                            >
                                <Radio
                                    checked={selectedReqId === r.requisition_id}
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                                <ListItemText
                                    primary={r.position}
                                    secondary={`${r.department ?? '—'}  ·  ${r.status}`}
                                    primaryTypographyProps={{ fontWeight: 500 }}
                                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit" disabled={moving}>Cancel</Button>
                <Button
                    variant="contained"
                    disabled={!selectedReqId || eligible.length === 0 || moving}
                    onClick={handleConfirm}
                >
                    {moving ? <CircularProgress size={18} color="inherit" /> : `Move ${eligible.length} Candidate(s)`}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
