import { CandidateProfile } from "@/interface/candidate";
import { Button } from "@mui/material";
import { Email, Assignment, Description } from "@mui/icons-material";
import React from "react";
import Link from 'next/link';
import { fetchSingleCandidate } from "@/redux/slices/candidates";

export const PingHiringManagersButton = ({ candidate }: { candidate: Partial<CandidateProfile> }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // In a real app, you'd dispatch an action or call an API
        console.log(`Pinging hiring managers for candidate: ${candidate.candidate_id}`);
        alert(`Pinging hiring managers for ${candidate.candidate_name}`);
    };

    return (
        <Button
            variant="outlined"
            size="small"
            startIcon={<Email fontSize="small" />}
            onClick={handleClick}
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
            variant="outlined"
            color="success"
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

