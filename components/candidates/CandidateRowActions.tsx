import { CandidateProfile } from "@/interface/candidate";
import { Button, IconButton, Tooltip, Box } from "@mui/material";
import { Email, Assignment, Description, Visibility, MoveDown, Delete } from "@mui/icons-material";
import React from "react";
import Link from 'next/link';
import { fetchSingleCandidate } from "@/redux/slices/candidates";
import { User } from "@/interface/user";
import { AppRole } from "@/utils/constants";


export const PingHiringManagersButton = ({ candidate }: { candidate: Partial<CandidateProfile> }) => {
    return (
        <Tooltip title="Ping Hiring Manager">
            <IconButton
                size="small"
                component={Link}
                href={`/candidates/ping/${candidate.candidate_id}`}
                onClick={(e) => e.stopPropagation()}
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
                <Email fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

export const FillInterviewFormButton = ({ candidate }: { candidate: Partial<CandidateProfile> }) => {
    return (
        <Tooltip title="Fill Interview Form">
            <IconButton
                size="small"
                component={Link}
                href={`/candidates/evaluate/${candidate.candidate_id}`}
                onClick={(e) => e.stopPropagation()}
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
                <Assignment fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

export const GenerateOfferLetterButton = ({ candidate }: { candidate: Partial<CandidateProfile> }) => {
    return (
        <Tooltip title="Generate Offer Letter">
            <IconButton
                size="small"
                component={Link}
                href={`/candidates/offer/${candidate.candidate_id}`}
                onClick={(e) => e.stopPropagation()}
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
                <Description fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};


// New Actions for Applied Status
interface AppliedActionsProps {
    candidate: Partial<CandidateProfile>;
    onView?: (candidate: Partial<CandidateProfile>) => void;
    onMove?: (candidate: Partial<CandidateProfile>) => void;
    onDelete?: (candidate: Partial<CandidateProfile>) => void;
    children?: React.ReactNode;
    user: User | null;
}

export const AppliedActionsStub = ({ candidate, onView, onMove, onDelete, children, user }: AppliedActionsProps) => {
    return (
        <Box sx={{ display: 'flex', gap: 1 }}>
            {children}
            <Tooltip title="View Profile">
                <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); onView && onView(candidate); }}
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                    <Visibility fontSize="small" />
                </IconButton>
            </Tooltip>
            
            {(user?.role_name == AppRole.Recruiter || user?.role_name == AppRole.HeadOfHr || user?.role_name == AppRole.HrManager) && (
                <>
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
                </>

            )}
        </Box>
    );
};
