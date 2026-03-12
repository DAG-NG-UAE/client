"use client";

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Container, Stack,
    IconButton, Button, alpha, useTheme, Paper, Divider
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    ArrowForwardIos as NextIcon,
    ArrowBackIos as PrevIcon,
    Lightbulb as TipIcon,
    Warning as WarningIcon,
    Star as CriticalIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

const STEPS = [
    {
        id: "step-1",
        label: "Library",
        title: "Step 1: The Library Check",
        subtitle: "HR Team Only",
        color: "#d32f2f",
        theory: (
            <Stack spacing={3}>
                <Typography variant="body1">
                    Before any hiring begins, ensure the <strong>Preference Library</strong> is updated.
                </Typography>
                <Box sx={{ borderLeft: '4px solid #d32f2f', pl: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Action:</Typography>
                    <Typography variant="body2">Add skills, qualifications, and the rank levels needed.</Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#d32f2f' }}>The Linear Secret 🤫</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        When creating a preference, choosing <strong>Is Linear</strong> is a high-stakes decision!
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, bgcolor: alpha("#d32f2f", 0.05), p: 2, borderRadius: 2 }}>
                        If a preference is linear, it means it's a <strong>hard requirement</strong>. If the candidate's answer doesn't match the Hiring Manager's desired answer, they score <strong>Zero immediately</strong>.
                        No middle ground!
                    </Typography>
                </Box>
            </Stack>
        ),
        illustration: "/assets/manual/library_check.png"
    },
    {
        id: "step-2",
        label: "Requisition",
        title: "Chapter 2: The Requisition Quest",
        subtitle: "HOD & HR",
        color: "#e64a19",
        theory: (
            <Box sx={{ maxHeight: '420px', overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: alpha("#e64a19", 0.2), borderRadius: 2 } }}>
                <Stack spacing={2.5}>
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#e64a19" }}>The Goal</Typography>
                        <Typography variant="body2">
                            To move from "We need a person" to a <strong>Verified Hiring Request</strong>. This form kicks off the approval flow and candidates hiring process once approved.
                        </Typography>
                    </Box>

                    <Box sx={{ bgcolor: alpha("#e64a19", 0.05), p: 2, borderRadius: 2 }}>
                        <Typography variant="button" sx={{ fontWeight: 900, display: 'block', mb: 1 }}>Section A: General & Position Details</Typography>
                        <Stack spacing={1.5}>
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 800 }}>Field: Requisition Internal Name</Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}><strong>The Logic:</strong> This is your Project Code (e.g., "Sales_Executive_Q1_Lagos").</Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}><strong>Why:</strong> Helps you find this specific request in your 35-table history a year from now.</Typography>
                            </Box>

                        </Stack>
                    </Box>

                    <Box>
                        <Typography variant="button" sx={{ fontWeight: 900, display: 'block', mb: 1 }}>Section B: Locations & Headcount</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}><strong>Field: Headcount</strong></Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}><strong>The Logic:</strong> How many "copies" of this person do you need?</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}><strong>Why:</strong> System treats 1 Requisition with 5 Headcount as 5 separate "slots" that close as you hire.</Typography>
                    </Box>

                    <Box sx={{ borderLeft: '3px solid #e64a19', pl: 2 }}>
                        <Typography variant="button" sx={{ fontWeight: 900, display: 'block', mb: 1 }}>Section C: Compensation & Reason</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}><strong>Field: Proposed Monthly Salary ₦</strong></Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}><strong>The Logic:</strong> This is the "Anchor Value" (Gross Monthly Budget).</Typography>
                        {/* <Typography variant="body2" sx={{ fontSize: '0.8rem' }}><strong>Why:</strong> System flags it during Salary Proposal (FR-12) if the offer is way higher than original budget.</Typography> */}
                    </Box>

                    <Box>
                        <Typography variant="button" sx={{ fontWeight: 900, display: 'block', mb: 1 }}>Section D: Reporting & Approvals</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}><strong>Field: Require HOD Approval?</strong></Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}><strong>The Logic:</strong> Toggling this ON sends an email to the HOD to approve the requisition.</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 700 }}><strong>The Rule:</strong> Requisition stays "Pending" until HOD clicks Approve in their email.</Typography>
                    </Box>

                    <Box sx={{ bgcolor: alpha("#e64a19", 0.05), p: 2, borderRadius: 2 }}>
                        <Typography variant="button" sx={{ fontWeight: 900, display: 'block', mb: 1 }}>Section E: Justification & JD</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}><strong>Field: Justification</strong> (You can state the reason you want someone if you feel like giving HR more detail ).</Typography>
                        <br />
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}><strong>Field: Job Description</strong> (The candidates see this when applying for the role. Use AI to write it if you may but please remove the "Do you want me to xyz")</Typography>
                    </Box>
                </Stack>
            </Box>
        ),
        illustration: "/assets/manual/requisition_magic.png"
    },
    {
        id: "step-3",
        label: "Interview",
        title: "Step 3: Vetting & Interviewing",
        subtitle: "The Human Element",
        color: "#388e3c",
        theory: (
            <Stack spacing={2}>
                <Typography variant="body1">
                    <strong>Candidate Match:</strong> Look at the Match Score %. The higher the score, the better they fit your specific weights.
                </Typography>
                <Typography variant="body2">
                    <strong>Scheduling:</strong> The system handles the emails and Teams links for you. Just pick a time and fly! 🚀
                </Typography>
                <Box sx={{ p: 2, bgcolor: alpha("#388e3c", 0.05), borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>The Feedback Loop</Typography>
                    <Typography variant="body2">
                        Go to "Pending Feedback" after the interview.
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 700, mt: 1, display: 'block' }}>
                        ⚠️ You cannot change your rating once you hit submit! Permanent record!
                    </Typography>
                </Box>
            </Stack>
        ),
        illustration: "/assets/manual/vetting_candidates.png"
    },
    {
        id: "step-4",
        label: "Offers",
        title: "Step 4: The Money & The Offer",
        subtitle: "Finalizing the Deal",
        color: "#1976d2",
        theory: (
            <Stack spacing={2}>
                <Typography variant="body1">
                    <strong>The Proposal:</strong> Set the BHA, Annual, and Monthly pay.
                </Typography>
                <Typography variant="body2">
                    <strong>The Veto Rule:</strong> If one approver rejects, the proposal dies! 💀
                    You'll need a "New Version" with updated figures to try again.
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Generating the Offer</Typography>
                    <Typography variant="body2">
                        Select the entity (DAG/DTS). The system crafts the PDF and emails it to our future star immediately.
                    </Typography>
                </Box>
            </Stack>
        ),
        illustration: "/assets/manual/evaluation.png"
    },
    {
        id: "step-5",
        label: "Onboarding",
        title: "Step 5: Onboarding Audit",
        subtitle: "Welcome to the Family",
        color: "#00796b",
        theory: (
            <Stack spacing={2}>
                <Typography variant="body1">
                    <strong>Document Audit:</strong> When files come in, be the eagle eye! 🦅
                </Typography>
                <Typography variant="body2">
                    If a file is blurry or wrong, hit <strong>Reject</strong>. The system wipes it and asks the candidate for a fresh one automatically.
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'primary.main' }}>
                    "A clean file system is a happy system!"
                </Typography>
            </Stack>
        ),
        illustration: "/assets/manual/welcome.png"
    }
];

const GrainyPaper = ({ children, sx = {} }: { children: React.ReactNode, sx?: any }) => (
    <Box sx={{
        position: 'relative',
        bgcolor: '#fdfbf7',
        backgroundImage: `url("https://www.transparenttextures.com/patterns/paper.png")`,
        ...sx
    }}>
        {children}
    </Box>
);

export default function HowToUsePage() {
    const router = useRouter();
    const [pageIndex, setPageIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isCoverOpen, setIsCoverOpen] = useState(false);

    // Handle hash navigation
    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const index = STEPS.findIndex(s => s.id === hash);
            if (index !== -1) {
                setPageIndex(index);
                setIsCoverOpen(true);
            }
        }
    }, []);

    const paginate = (newDirection: number) => {
        const newIndex = pageIndex + newDirection;
        if (newIndex >= 0 && newIndex < STEPS.length) {
            setDirection(newDirection);
            setPageIndex(newIndex);
        }
    };

    const bookVariants = {
        closed: { rotateY: 0 },
        open: { rotateY: 0 }
    };

    const coverVariants = {
        closed: { rotateY: 0, zIndex: 10 },
        open: { rotateY: -110, zIndex: 0 }
    };

    const pageVariants = {
        enter: (direction: number) => ({
            rotateY: direction > 0 ? 90 : -90,
            opacity: 0,
        }),
        center: {
            rotateY: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            rotateY: direction < 0 ? 90 : -90,
            opacity: 0,
        })
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#1a1a1a', // Darker background for focus
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            perspective: '2500px',
            overflow: 'hidden'
        }}>
            {/* Back Button */}
            <IconButton
                onClick={() => router.back()}
                sx={{ position: 'fixed', top: 30, left: 30, bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
            >
                <BackIcon />
            </IconButton>

            {/* The Book Container */}
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', transformStyle: 'preserve-3d' }}>

                {/* Physical Tabs (Only visible when book is open) */}
                <AnimatePresence>
                    {isCoverOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                position: 'absolute',
                                right: -45,
                                top: 50,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                zIndex: 0
                            }}
                        >
                            {STEPS.map((step, idx) => (
                                <Box
                                    key={step.id}
                                    onClick={() => {
                                        setDirection(idx > pageIndex ? 1 : -1);
                                        setPageIndex(idx);
                                    }}
                                    sx={{
                                        width: 60,
                                        height: 50,
                                        bgcolor: step.color,
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '0 8px 8px 0',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        transform: pageIndex === idx ? 'translateX(10px)' : 'none',
                                        boxShadow: pageIndex === idx ? '5px 5px 15px rgba(0,0,0,0.2)' : '2px 2px 5px rgba(0,0,0,0.1)',
                                        '&:hover': { transform: 'translateX(5px)' }
                                    }}
                                >
                                    <Typography variant="caption" sx={{ fontWeight: 900, fontSize: '0.6rem', transform: 'rotate(-90deg)' }}>
                                        {step.label}
                                    </Typography>
                                </Box>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hardcover Outer */}
                <motion.div
                    animate={isCoverOpen ? "open" : "closed"}
                    variants={bookVariants}
                    style={{
                        position: 'relative',
                        transformStyle: 'preserve-3d',
                        zIndex: 1
                    }}
                >
                    {/* The Cover Overlay */}
                    <AnimatePresence>
                        {!isCoverOpen && (
                            <motion.div
                                variants={coverVariants}
                                initial="closed"
                                animate="closed"
                                exit="open"
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                                onClick={() => setIsCoverOpen(true)}
                                style={{
                                    width: 508, // Approx half of 1000 + spine
                                    height: 650,
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    zIndex: 20,
                                    cursor: 'pointer',
                                    transformOrigin: 'left',
                                    backfaceVisibility: 'hidden',
                                }}
                            >
                                <Paper elevation={24} sx={{
                                    width: '100%',
                                    height: '100%',
                                    bgcolor: '#4b2e1a', // Deep leather mahogany
                                    border: '10px solid #3a2314',
                                    borderRadius: '4px 20px 20px 4px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 4,
                                    backgroundImage: `url("https://www.transparenttextures.com/patterns/leather.png")`,
                                    position: 'relative'
                                }}>
                                    {/* Gold Frame */}
                                    <Box sx={{
                                        position: 'absolute',
                                        inset: 30,
                                        border: '2px solid #d4af37',
                                        borderRadius: 2,
                                        opacity: 0.6
                                    }} />

                                    <Typography variant="h5" sx={{ color: '#d4af37', fontWeight: 900, mb: 1, letterSpacing: 4 }}>
                                        DAG PORTAL
                                    </Typography>

                                    <Divider sx={{ width: 100, bgcolor: '#d4af37', mb: 4, height: 2 }} />

                                    <Typography variant="h1" sx={{
                                        color: '#fdfbf7',
                                        fontWeight: 900,
                                        textAlign: 'center',
                                        fontSize: '3.5rem',
                                        lineHeight: 1,
                                        textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
                                        fontFamily: 'serif',
                                        mb: 2
                                    }}>
                                        THE HOLY GRAIL
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: '#d4af37', fontWeight: 600, fontStyle: 'italic', textAlign: 'center' }}>
                                        Of Recruitment & Onboarding
                                    </Typography>

                                    <Box sx={{ mt: 'auto', textAlign: 'center' }}>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: 2 }}>
                                            EST. 2026 • THE ULTIMATE GUIDE
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#d4af37', mt: 1, fontWeight: 900 }}>
                                            [ CLICK TO UNVEIL THE SECRETS ]
                                        </Typography>
                                    </Box>
                                </Paper>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* The Inside Face (Pages) */}
                    <Paper elevation={24} sx={{
                        width: { xs: '95vw', md: 1000 },
                        height: 650,
                        borderRadius: 4,
                        display: 'flex',
                        overflow: 'hidden',
                        bgcolor: '#4b3621',
                        position: 'relative',
                        border: '8px solid #3a2a1a',
                        visibility: isCoverOpen ? 'visible' : 'hidden'
                    }}>

                        <AnimatePresence mode="wait" custom={direction}>
                            {isCoverOpen && (
                                <motion.div
                                    key={pageIndex}
                                    custom={direction}
                                    variants={pageVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                    style={{ width: '100%', height: '100%', display: 'flex' }}
                                >
                                    {/* Left Page (Theory) */}
                                    <GrainyPaper sx={{ flex: 1, p: 6, borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                                        <Typography variant="overline" sx={{ color: STEPS[pageIndex].color, fontWeight: 900, mb: 1, display: 'block' }}>
                                            {STEPS[pageIndex].subtitle}
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, color: '#2d1b0d' }}>
                                            {STEPS[pageIndex].title}
                                        </Typography>
                                        <Box sx={{ fontSize: '1.1rem', color: '#4a3728' }}>
                                            {STEPS[pageIndex].theory}
                                        </Box>

                                        <Box sx={{
                                            position: 'absolute', right: 0, top: 0, bottom: 0, width: 20,
                                            background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.05))',
                                            zIndex: 2
                                        }} />
                                    </GrainyPaper>

                                    {/* Right Page (Illustration) */}
                                    <GrainyPaper sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                                        <Box sx={{
                                            position: 'absolute', left: 0, top: 0, bottom: 0, width: 20,
                                            background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.05))',
                                            zIndex: 2
                                        }} />

                                        <Box sx={{
                                            width: '100%',
                                            height: '80%',
                                            borderRadius: 4,
                                            overflow: 'hidden',
                                            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            bgcolor: 'white'
                                        }}>
                                            <img
                                                src={STEPS[pageIndex].illustration}
                                                alt="illustration"
                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                            />
                                        </Box>
                                    </GrainyPaper>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Central Binding Line */}
                        <Box sx={{
                            position: 'absolute',
                            left: '50%',
                            top: 0,
                            bottom: 0,
                            width: '2px',
                            bgcolor: 'rgba(0,0,0,0.1)',
                            zIndex: 10,
                            transform: 'translateX(-50%)',
                            boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                        }} />
                    </Paper>
                </motion.div>

                {/* Navigation Buttons (Only visible when book is open) */}
                {isCoverOpen && (
                    <>
                        <IconButton
                            onClick={() => paginate(-1)}
                            disabled={pageIndex === 0}
                            sx={{
                                position: 'absolute', left: -70,
                                bgcolor: 'white', '&:hover': { bgcolor: '#f3f4f6' },
                                boxShadow: 3, zIndex: 10
                            }}
                        >
                            <PrevIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => paginate(1)}
                            disabled={pageIndex === STEPS.length - 1}
                            sx={{
                                position: 'absolute', right: -70,
                                bgcolor: 'white', '&:hover': { bgcolor: '#f3f4f6' },
                                boxShadow: 3, zIndex: 10
                            }}
                        >
                            <NextIcon />
                        </IconButton>
                    </>
                )}
            </Box>

            {/* Help text */}
            <Typography variant="caption" sx={{ position: 'fixed', bottom: 20, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                {isCoverOpen ? "Use the colored tabs or arrows to flip through the manual." : "Click the cover to reveal the secrets of the portal."}
            </Typography>
        </Box>
    );
}

