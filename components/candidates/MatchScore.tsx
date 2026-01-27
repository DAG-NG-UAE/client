import React from 'react';
import { Box, CircularProgress, Typography, Tooltip } from '@mui/material';
import { RequirementMatch } from '@/interface/candidate';

interface MatchScoreProps {
    score: number;
    requirements?: RequirementMatch[];
}

const MatchScore: React.FC<MatchScoreProps> = ({ score, requirements = [] }) => {
    // 1. Determine Logic
    const isCriticalFail = requirements?.some(
        (r) => r.weight_score === 100 && r.candidate_rank < r.required_rank
    );

    // Color definitions
    const COLORS = {
        emerald: '#006341', // 90-100
        sage: '#77A376',    // 70-89
        amber: '#FFA000',   // 50-69
        crimson: '#D32F2F', // 0-49
    };

    let color = COLORS.crimson;
    let statusLabel = 'Unqualified';

    if (score >= 90) {
        color = COLORS.emerald;
        statusLabel = 'Top Tier';
    } else if (score >= 70) {
        color = COLORS.sage;
        statusLabel = 'Solid Match';
    } else if (score >= 50) {
        color = COLORS.amber;
        statusLabel = 'Risky';
    } else {
        color = COLORS.crimson;
        statusLabel = 'Unqualified';
    }

    // Critical Fail Override
    if (isCriticalFail) {
        if (score >= 50) {
            color = COLORS.amber; 
            statusLabel = 'Risky (Critical Fail)';
        } else {
            color = COLORS.crimson;
            statusLabel = 'Unqualified (Critical Fail)';
        }
    }

    // Tooltip content: Show why they got this score? 
    // For now simple tooltip with status
    
    return (
        <Tooltip title={statusLabel} arrow>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                {/* Background Circle (Track) */}
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={40}
                    thickness={5}
                    sx={{
                        color: (theme) => theme.palette.grey[200],
                        position: 'absolute',
                        left: 0,
                    }}
                />
                {/* Foreground Circle (Value) */}
                <CircularProgress
                    variant="determinate"
                    value={score}
                    size={40}
                    thickness={5}
                    sx={{
                        color: color,
                        strokeLinecap: 'round', // Rounded ends for nicer look
                    }}
                />
                
                {/* Text in Center */}
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        variant="caption"
                        component="div"
                        sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.primary' }}
                    >
                        {Math.round(score)}%
                    </Typography>
                </Box>
            </Box>
        </Tooltip>
    );
};

export default MatchScore;
