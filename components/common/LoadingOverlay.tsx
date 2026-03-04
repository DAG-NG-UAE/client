"use client";

import React from 'react';
import { Box, Typography, Fade, CircularProgress } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

interface LoadingOverlayProps {
    open: boolean;
    message?: string;
    subtitle?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    open,
    message = "Please wait...",
    subtitle = "We're processing your request"
}) => {
    const theme = useTheme();

    return (
        <Fade in={open} timeout={500}>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: alpha(theme.palette.background.default, 0.8),
                    backdropFilter: 'blur(8px)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 3,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 5,
                        borderRadius: 4,
                        backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.9)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        maxWidth: 400,
                        width: '90%',
                    }}
                >
                    <CircularProgress
                        size={60}
                        thickness={4}
                        sx={{
                            mb: 3,
                            color: theme.palette.primary.main,
                            '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                            }
                        }}
                    />

                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: theme.palette.text.primary }}>
                        {message}
                    </Typography>

                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                        {subtitle}
                    </Typography>
                </Box>
            </Box>
        </Fade>
    );
};

export default LoadingOverlay;
