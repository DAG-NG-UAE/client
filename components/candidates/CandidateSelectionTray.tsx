"use client";

import React, { useState } from 'react';
import {
    Box, Button, Chip, MenuItem, Select, Slide, Typography, CircularProgress
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { CandidateProfile } from '@/interface/candidate';

const MOVE_STAGES = [
    { value: 'screened', label: 'Screened' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview_scheduled', label: 'Interview Scheduled' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'pre_offer', label: 'Pre-Offer' },
    { value: 'internal_salary_proposal', label: 'Internal Salary Proposal' },
    { value: 'approved_for_offer', label: 'Approved for Offer' },
    { value: 'rejected', label: 'Rejected' },
];

interface CandidateSelectionTrayProps {
    selectedCandidates: Map<string, Partial<CandidateProfile>>;
    onRemove: (candidateId: string) => void;
    onClear: () => void;
    onMove: (targetStage: string) => Promise<void>;
    onMoveToRequisition: () => void;
}

export default function CandidateSelectionTray({
    selectedCandidates,
    onRemove,
    onClear,
    onMove,
    onMoveToRequisition,
}: CandidateSelectionTrayProps) {
    const [targetStage, setTargetStage] = useState('');
    const [moving, setMoving] = useState(false);

    const count = selectedCandidates.size;
    const visible = count > 0;

    const handleMove = async () => {
        if (!targetStage || moving) return;
        setMoving(true);
        try {
            await onMove(targetStage);
            setTargetStage('');
        } finally {
            setMoving(false);
        }
    };

    return (
        <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: { xs: 0, sm: 240 },
                    right: 0,
                    zIndex: 1200,
                    bgcolor: 'background.paper',
                    borderTop: '2px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                }}
            >
                {/* Count badge */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                    <PeopleAltIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight={700}>
                        {count} selected
                    </Typography>
                </Box>

                {/* Candidate chips — scrollable row */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        flex: 1,
                        overflowX: 'auto',
                        py: 0.5,
                        '&::-webkit-scrollbar': { height: 4 },
                        '&::-webkit-scrollbar-thumb': { borderRadius: 2, bgcolor: 'divider' },
                    }}
                >
                    {Array.from(selectedCandidates.values()).map(c => (
                        <Chip
                            key={c.candidate_id}
                            label={c.candidate_name || c.candidate_id}
                            size="small"
                            onDelete={() => onRemove(c.candidate_id!)}
                            sx={{ flexShrink: 0 }}
                        />
                    ))}
                </Box>

                {/* Stage picker */}
                <Select
                    size="small"
                    displayEmpty
                    value={targetStage}
                    onChange={(e) => setTargetStage(e.target.value)}
                    sx={{ minWidth: 200, flexShrink: 0 }}
                    renderValue={(val) =>
                        val ? MOVE_STAGES.find(s => s.value === val)?.label : 'Move to stage...'
                    }
                >
                    {MOVE_STAGES.map(s => (
                        <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                    ))}
                </Select>

                {/* Actions */}
                <Button
                    variant="contained"
                    size="small"
                    disabled={!targetStage || moving}
                    onClick={handleMove}
                    sx={{ flexShrink: 0 }}
                >
                    {moving ? <CircularProgress size={16} color="inherit" /> : 'Move'}
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={onMoveToRequisition}
                    sx={{ flexShrink: 0 }}
                >
                    Move to Requisition
                </Button>
                <Button
                    variant="text"
                    size="small"
                    color="inherit"
                    onClick={onClear}
                    sx={{ flexShrink: 0, color: 'text.secondary' }}
                >
                    Clear
                </Button>
            </Box>
        </Slide>
    );
}
