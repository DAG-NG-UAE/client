"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, Container, CircularProgress, Paper } from '@mui/material';
import { getCvByShareToken } from '@/api/candidate';
import { useSnackbar } from 'notistack';
import Image from 'next/image';

export default function ShareTokenPage() {
    const params = useParams();
    const token = params?.token;
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (token) {
            const fetchCv = async () => {
                try {
                    // Start a timer to ensure the animation is seen for at least 2 seconds
                    const animationTimer = new Promise(resolve => setTimeout(resolve, 2500));

                    const fetchPromise = await getCvByShareToken(token as string);
                    console.log(fetchPromise)


                    if (fetchPromise) {
                        window.location.href = fetchPromise;
                    } else {
                        enqueueSnackbar("CV link not found or expired", { variant: "error" });
                        setError(true);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error("Error fetching CV:", error);
                    enqueueSnackbar("Failed to load CV link", { variant: "error" });
                    setError(true);
                    setLoading(false);
                }
            };
            fetchCv();
        }
    }, [token, enqueueSnackbar]);

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3
        }}>
            <Paper elevation={0} sx={{
                p: 6,
                borderRadius: 4,
                bgcolor: 'white',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
                maxWidth: 450,
                width: '100%',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{ position: 'relative', width: '100%', mb: 6, height: 120 }}>
                    {/* Road */}
                    <Box sx={{
                        position: 'absolute',
                        bottom: 20,
                        left: -50,
                        right: -50,
                        height: 4,
                        bgcolor: '#f1f5f9',
                        borderRadius: 2,
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: 'linear-gradient(90deg, #cbd5e1 50%, transparent 50%)',
                            backgroundSize: '40px 100%',
                            animation: 'moveRoad 0.5s infinite linear'
                        }
                    }} />

                    {/* Keke Animation */}
                    <Box sx={{
                        position: 'absolute',
                        bottom: 24,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '4rem',
                        animation: 'bounceKeke 0.6s infinite ease-in-out',
                        zIndex: 2,
                        filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.1))'
                    }}>
                        🛺
                    </Box>

                    {/* Speed Lines */}
                    <Box sx={{
                        position: 'absolute',
                        top: '40%',
                        left: '20%',
                        width: 40,
                        height: 2,
                        bgcolor: '#e2e8f0',
                        borderRadius: 1,
                        animation: 'speedLine 0.4s infinite linear'
                    }} />
                    <Box sx={{
                        position: 'absolute',
                        top: '60%',
                        left: '15%',
                        width: 30,
                        height: 2,
                        bgcolor: '#e2e8f0',
                        borderRadius: 1,
                        animation: 'speedLine 0.4s infinite linear',
                        animationDelay: '0.1s'
                    }} />
                </Box>

                {!error ? (
                    <>
                        <Typography variant="h5" sx={{ fontWeight: 900, mb: 1.5, color: '#0f172a', letterSpacing: -0.5 }}>
                            Almost There!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, px: 2, lineHeight: 1.6 }}>
                            We're fetching the candidate's CV from our secure vault. You'll be redirected in just a moment.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={20} thickness={6} sx={{ color: '#3b82f6' }} />
                            <Typography variant="overline" sx={{ fontWeight: 800, color: '#3b82f6' }}>
                                SECURELY REDIRECTING...
                            </Typography>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box sx={{ fontSize: '4rem', mb: 2 }}>⚠️</Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, mb: 1.5, color: '#e11d48' }}>
                            Link Expired
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            This screening link is no longer active or may have been revoked. Please contact HR for a fresh link.
                        </Typography>
                    </>
                )}
            </Paper>

            <Typography variant="caption" sx={{ mt: 4, color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>🛡️</span> End-to-end encrypted document access
            </Typography>

            <style jsx global>{`
                @keyframes moveRoad {
                    from { background-position: 0 0; }
                    to { background-position: -40px 0; }
                }
                @keyframes bounceKeke {
                    0%, 100% { transform: translate(-50%, 0) rotate(0deg); }
                    25% { transform: translate(-50%, -4px) rotate(-1deg); }
                    75% { transform: translate(-50%, -2px) rotate(1deg); }
                }
                @keyframes speedLine {
                    from { transform: translateX(0); opacity: 0; }
                    50% { opacity: 1; }
                    to { transform: translateX(-100px); opacity: 0; }
                }
            `}</style>
        </Box>
    );
}
