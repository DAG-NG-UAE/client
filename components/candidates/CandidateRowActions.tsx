import { CandidateProfile } from "@/interface/candidate";
import { Button, IconButton, Tooltip, Box } from "@mui/material";
import { Email, Assignment, Description, Visibility, MoveDown, Delete } from "@mui/icons-material";
import React from "react";
import Link from 'next/link';
import { fetchSingleCandidate } from "@/redux/slices/candidates";


export const PingHiringManagersButton = ({ candidate }: { candidate: Partial<CandidateProfile> }) => {
    return (
        <Button
            variant="outlined"
            size="small"
            startIcon={<Email fontSize="small" />}
            component={Link}
            href={`/candidates/ping/${candidate.candidate_id}`}
            onClick={(e) => e.stopPropagation()}
            sx={{ mr: 1, textTransform: 'none' }}
        >
            Ping Hiring Managers
        </Button>
    );
};

export const FillInterviewFormButton = ({ candidate }: { candidate: Partial<CandidateProfile> }) => {
    return (
        <Button
            variant="outlined"
            size="small"
            startIcon={<Assignment fontSize="small" />}
            component={Link}
            href={`/candidates/evaluate/${candidate.candidate_id}`}
            onClick={(e) => e.stopPropagation()} // Keep this to prevent the table's row click
            sx={{ textTransform: 'none' }}
        >
            Fill Interview Form
        </Button>
    );
};

export const GenerateOfferLetterButton = ({ candidate }: { candidate: Partial<CandidateProfile> }) => {
    return (
        <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<Description fontSize="small" />}
            component={Link}
            href={`/candidates/offer/${candidate.candidate_id}`}
            onClick={(e) => e.stopPropagation()}
            sx={{ textTransform: 'none' }}
        >
            Generate Offer Letter
        </Button>
    );
};


// New Actions for Applied Status
interface AppliedActionsProps {
    candidate: Partial<CandidateProfile>;
    onView?: (candidate: Partial<CandidateProfile>) => void;
    onMove?: (candidate: Partial<CandidateProfile>) => void;
    onDelete?: (candidate: Partial<CandidateProfile>) => void;
}

export const AppliedActionsStub = ({ candidate, onView, onMove, onDelete }: AppliedActionsProps) => {
    return (
        <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="View Profile">
                <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); onView && onView(candidate); }}
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                    <Visibility fontSize="small" />
                </IconButton>
            </Tooltip>
            
            <Tooltip title="Move Candidate">
                <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); onMove && onMove(candidate); }}
                   sx={{ color: 'text.secondary', '&:hover': { color: 'info.main' } }}
                >
                    <MoveDown fontSize="small" />
                </IconButton>
            </Tooltip>

             <Tooltip title="Delete Candidate">
                <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); onDelete && onDelete(candidate); }}
                    sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                >
                    <Delete fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );
};
