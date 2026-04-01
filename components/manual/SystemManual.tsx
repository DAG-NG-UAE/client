"use client";

import React, { useState } from 'react';
import {
    Box, Typography, IconButton, Modal, Button,
    Paper, Stack, alpha, useTheme
} from '@mui/material';
import {
    Close as CloseIcon,
    ArrowForward as NextIcon,
    ArrowBack as PrevIcon,
    HelpOutline as HelpIcon,
    EmojiObjects as TipIcon,
    AutoStories as BookIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ROLE_STORIES, DEFAULT_STORY } from './manualContent';

interface PageProps {
    title: string;
    content: React.ReactNode;
    image?: string;
    color: string;
}

const STATIC_PAGES: PageProps[] = [
    {
        title: "Welcome aboard!",
        color: "#6366f1",
        content: null, // Dynamic content handled in component
    },
    // The Role Discovery page will be inserted here dynamically
    {
        title: "The Requisition Quest",
        color: "#f59e0b",
        content: (
            <Stack spacing={2}>
                <Box sx={{ width: '100%', height: 180, overflow: 'hidden', borderRadius: 2, bgcolor: alpha("#f59e0b", 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="/assets/manual/workflow.png" alt="Workflow" style={{ height: '100%', objectFit: 'contain' }} />
                </Box>
                <Typography variant="body1">
                    Filling the <strong>Requisition Form</strong> is your first step! 📝
                </Typography>
                <Typography variant="body2" component="div">
                    <ul>
                        <li><strong>Requisition Name:</strong> Give it a catchy internal title!</li>
                        <li><strong>Expected Resumption:</strong> When do you need them on their desk?</li>
                        <li><strong>Headcount:</strong> Use for tracking how many people we're looking for.</li>
                    </ul>
                </Typography>
                <Typography variant="body1">
                    Once submitted, it goes through a smooth approval flow. No more chasing bosses for signatures! 🏃💨
                </Typography>
            </Stack>
        )
    },
    {
        title: "Vetting the Stars",
        color: "#10b981",
        content: (
            <Stack spacing={2}>
                <Typography variant="body1">
                    Now for the fun part: <strong>Candidate Sourcing</strong>! ✨
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    As CVs roll in, you don't just see names—you see potential! You can view resumes, track their status, and even <strong>vet them yourself</strong>.
                </Typography>
                <Typography variant="body1">
                    🎯 <strong>Match Scores:</strong> Let the system do the heavy lifting! We rank candidates based on how well they fit your specific needs.
                </Typography>
                <Box sx={{ p: 2, bgcolor: alpha("#10b981", 0.05), borderRadius: 2, border: "1px dashed #10b981" }}>
                    <Typography variant="body2">
                        "If you like a candidate, give them a thumbs up! Your feedback is the heartbeat of our hiring process."
                    </Typography>
                </Box>
            </Stack>
        )
    },
    {
        title: "The Final Score",
        color: "#ec4899",
        content: (
            <Stack spacing={2}>
                <Box sx={{ width: '100%', height: 180, overflow: 'hidden', borderRadius: 2, bgcolor: alpha("#ec4899", 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="/assets/manual/evaluation.png" alt="Evaluation" style={{ height: '100%', objectFit: 'contain' }} />
                </Box>
                <Typography variant="body1">
                    The interview is done! Now what? 🎤
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    Time to fill the <strong>Candidate Performance Form</strong>. This is where you tell the story of their interview performance.
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    How was their technical depth? Did they fit the culture? Be honest, be detailed! ✍️
                </Typography>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h6" sx={{ color: "#ec4899", fontWeight: 800 }}>⭐ Scoring helps us pick the best! ⭐</Typography>
                </Box>
            </Stack>
        )
    },
    {
        title: "Happy Hiring!",
        color: "#06b6d4",
        content: (
            <Stack spacing={3} alignItems="center">
                <Box sx={{ fontSize: '5rem' }}>🎯</Box>
                <Typography variant="h6" textAlign="center">
                    You're now ready to build a world-class team! 🚀
                </Typography>
                <Typography variant="body1" textAlign="center">
                    Check your dashboard for updates on your requisitions and candidates.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => window.dispatchEvent(new Event('close-manual'))}
                    sx={{
                        bgcolor: "#06b6d4",
                        borderRadius: 10,
                        px: 4,
                        '&:hover': { bgcolor: "#0891b2" }
                    }}
                >
                    Let's Get Started!
                </Button>
            </Stack>
        )
    }
];

export default function SystemManual() {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const { user } = useSelector((state: RootState) => state.auth);

    // Compute dynamic pages
    const PAGES = React.useMemo(() => {
        const pages = [...STATIC_PAGES];
        if (user?.role_name) {
            const story = ROLE_STORIES[user.role_name] || DEFAULT_STORY;
            const rolePage: PageProps = {
                title: story.title,
                color: story.color,
                content: story.description
            };
            // Insert after welcome page
            pages.splice(1, 0, rolePage);
        }
        return pages;
    }, [user?.role_name]);

    const handleOpen = () => {
        setOpen(true);
        setPageIndex(0);
    };
    const handleClose = () => setOpen(false);

    // Listen for custom close event from the last page
    React.useEffect(() => {
        const handleCloseEvent = () => handleClose();
        window.addEventListener('close-manual', handleCloseEvent);
        return () => window.removeEventListener('close-manual', handleCloseEvent);
    }, []);

    const paginate = (newDirection: number) => {
        if (pageIndex + newDirection >= 0 && pageIndex + newDirection < PAGES.length) {
            setDirection(newDirection);
            setPageIndex(prev => prev + newDirection);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            rotateY: direction > 0 ? 45 : -45,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            rotateY: 0,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            rotateY: direction < 0 ? 45 : -45,
        })
    };

    return (
        <>
            <Button
                startIcon={<BookIcon />}
                onClick={handleOpen}
                sx={{
                    color: "white",
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    mx: 2,
                    // bgcolor: alpha("#fff", 0.1),
                    '&:hover': { bgcolor: alpha("#fff", 0.2) }
                }}
            >
                How it Works
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
            >
                <Box sx={{
                    maxWidth: 900,
                    width: '100%',
                    position: 'relative',
                    perspective: '1500px'
                }}>
                    <Paper
                        elevation={24}
                        sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            minHeight: 550,
                            position: 'relative',
                            bgcolor: '#fff',
                            border: '1px solid',
                            borderColor: alpha(PAGES[pageIndex].color, 0.2)
                        }}
                    >
                        {/* Side Branding / Progress */}
                        <Box sx={{
                            width: { md: 300 },
                            bgcolor: PAGES[pageIndex].color,
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            color: 'white',
                            transition: 'background-color 0.5s ease',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Decorative elements */}
                            <Box sx={{
                                position: 'absolute', top: -50, right: -50,
                                width: 200, height: 200, borderRadius: '50%',
                                bgcolor: alpha("#fff", 0.1)
                            }} />

                            <Typography variant="h4" fontWeight={900} sx={{ mb: 4, zIndex: 1 }}>
                                The Story of Your Journey
                            </Typography>

                            <Box sx={{ mt: 'auto', zIndex: 1 }}>
                                <Typography variant="caption" sx={{ opacity: 0.8, letterSpacing: 2, fontWeight: 700 }}>
                                    CHAPTER {pageIndex + 1} OF {PAGES.length}
                                </Typography>
                                <Box sx={{ width: '100%', height: 6, bgcolor: alpha("#fff", 0.2), borderRadius: 3, mt: 1 }}>
                                    <Box sx={{
                                        width: `${((pageIndex + 1) / PAGES.length) * 100}%`,
                                        height: '100%',
                                        bgcolor: '#fff',
                                        borderRadius: 3,
                                        transition: 'width 0.3s ease'
                                    }} />
                                </Box>
                            </Box>
                        </Box>

                        {/* Content Area */}
                        <Box sx={{ flex: 1, p: { xs: 3, md: 6 }, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <IconButton
                                onClick={handleClose}
                                sx={{ position: 'absolute', right: 16, top: 16, zIndex: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>

                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                <motion.div
                                    key={pageIndex}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 },
                                        rotateY: { duration: 0.4 }
                                    }}
                                    style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                                >
                                    <Typography
                                        variant="h3"
                                        fontWeight={900}
                                        sx={{
                                            color: PAGES[pageIndex].color,
                                            mb: 4,
                                            fontSize: { xs: '2rem', md: '3rem' }
                                        }}
                                    >
                                        {PAGES[pageIndex].title}
                                    </Typography>

                                    <Box sx={{ color: 'text.primary', fontSize: '1.1rem' }}>
                                        {/* Direct text replacements for a more personal feel */}
                                        {pageIndex === 0 ? (
                                            <Stack spacing={2}>
                                                <Box sx={{ width: '100%', height: 180, overflow: 'hidden', borderRadius: 2, bgcolor: alpha("#6366f1", 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <img src="/assets/manual/welcome.png" alt="Welcome" style={{ height: '100%', objectFit: 'contain' }} />
                                                </Box>
                                                <Typography variant="body1">
                                                    Hi there, <strong>{user?.full_name || 'Adventurer'}</strong>! 👋
                                                </Typography>
                                                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                                                    Ever wondered how to make hiring feel like a breeze? 🕊️
                                                    This book is your magical guide to mastering the <strong>DAG-NG Recruitment System</strong>.
                                                </Typography>
                                                <Typography variant="body1">
                                                    Let's imagine you need a new <strong>System Analyst</strong> for your team.
                                                    Gone are the days of messy email threads!
                                                </Typography>
                                                <Box sx={{ p: 2, bgcolor: alpha("#6366f1", 0.05), borderRadius: 2, border: "1px dashed #6366f1" }}>
                                                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, mb: 0.5 }}>PRO TIP</Typography>
                                                    <Typography variant="caption">The system handles everything from request to offer letter!</Typography>
                                                </Box>
                                            </Stack>
                                        ) : PAGES[pageIndex].content}
                                    </Box>
                                </motion.div>
                            </AnimatePresence>

                            {/* Controls */}
                            <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
                                <Button
                                    startIcon={<PrevIcon />}
                                    disabled={pageIndex === 0}
                                    onClick={() => paginate(-1)}
                                    sx={{ textTransform: 'none', fontWeight: 700 }}
                                >
                                    Previous
                                </Button>
                                <Button
                                    endIcon={pageIndex === PAGES.length - 1 ? null : <NextIcon />}
                                    disabled={pageIndex === PAGES.length - 1}
                                    onClick={() => paginate(1)}
                                    variant="contained"
                                    sx={{
                                        bgcolor: PAGES[pageIndex].color,
                                        borderRadius: 2,
                                        px: 3,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        '&:hover': { bgcolor: alpha(PAGES[pageIndex].color, 0.8) }
                                    }}
                                >
                                    {pageIndex === PAGES.length - 1 ? "End of Journey" : "Next Page"}
                                </Button>
                            </Stack>
                        </Box>
                    </Paper>

                    {/* Fun decorative elements outside the book */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            position: 'absolute', bottom: -20, left: -20,
                            zIndex: -1, width: 80, height: 80, borderRadius: '20%',
                            backgroundColor: '#ffd700', transform: 'rotate(15deg)'
                        }}
                    />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 }}
                        style={{
                            position: 'absolute', top: -30, right: 30,
                            zIndex: -1, width: 100, height: 100, borderRadius: '50%',
                            backgroundColor: '#ff6b6b', opacity: 0.6
                        }}
                    />
                </Box>
            </Modal>
        </>
    );
}
