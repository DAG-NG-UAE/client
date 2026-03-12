import React from 'react';
import { Stack, Typography, Box, alpha } from '@mui/material';
import { AppRole } from '@/utils/constants';

export interface RoleStory {
    title: string;
    description: React.ReactNode;
    color: string;
    icon: string;
}

export const ROLE_STORIES: Record<string, RoleStory> = {
    [AppRole.HiringManager]: {
        title: "The Talent Architect",
        color: "#8b5cf6",
        icon: "🏗️",
        description: (
            <Stack spacing={2}>
                <Typography variant="body1">
                    As a <strong>Hiring Manager</strong>, you are the visionary behind your team's growth! 🚀
                </Typography>
                <Typography variant="body1">
                    Your mission:
                </Typography>
                <Box sx={{ pl: 2, borderLeft: '3px solid #8b5cf6' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Create <strong>Requisitions</strong> to signal a need for new talent.</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• <strong>Review CVs</strong> and vet candidates that catch your eye.</Typography>
                    <Typography variant="body2">• <strong>Provide Feedback</strong> after interviews to ensure we hire the best fit.</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                    "You define the 'Who' and 'Why'. We handle the 'How'!"
                </Typography>
            </Stack>
        )
    },
    [AppRole.Recruiter]: {
        title: "The Talent Scout",
        color: "#3b82f6",
        icon: "🔍",
        description: (
            <Stack spacing={2}>
                <Typography variant="body1">
                    As a <strong>Recruiter</strong>, you are the bridge between dreams and careers! 🌉
                </Typography>
                <Typography variant="body1">
                    Your mission:
                </Typography>
                <Box sx={{ pl: 2, borderLeft: '3px solid #3b82f6' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>• <strong>Source & Sort</strong> through candidates to find the hidden gems.</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• <strong>Manage Intervews</strong> and keep the recruitment machine humming.</Typography>
                    <Typography variant="body2">• <strong>Guide Stakeholders</strong> through the hiring process.</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                    "You're the engine room of our growth. Fast, efficient, and precise!"
                </Typography>
            </Stack>
        )
    },
    [AppRole.HeadOfHr]: {
        title: "The People Guardian",
        color: "#059669",
        icon: "🛡️",
        description: (
            <Stack spacing={2}>
                <Typography variant="body1">
                    As the <strong>Head of HR</strong>, you're the keeper of our cultural standard! 🏛️
                </Typography>
                <Typography variant="body1">
                    Your mission:
                </Typography>
                <Box sx={{ pl: 2, borderLeft: '3px solid #059669' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>• <strong>Approve & Oversee</strong> every hiring step to maintain quality.</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• <strong>Manage the Library</strong> of job titles and system preferences.</Typography>
                    <Typography variant="body2">• <strong>Analyze Trends</strong> to see how our team is evolving.</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                    "You ensure every new addition makes us stronger and better."
                </Typography>
            </Stack>
        )
    },
    [AppRole.HrManager]: {
        title: "The Culture Catalyst",
        color: "#0d9488",
        icon: "⚡",
        description: (
            <Stack spacing={2}>
                <Typography variant="body1">
                    As an <strong>HR Manager</strong>, you make sure the gears of people-ops turn perfectly! ⚙️
                </Typography>
                <Typography variant="body1">
                    Your mission:
                </Typography>
                <Box sx={{ pl: 2, borderLeft: '3px solid #0d9488' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>• <strong>Facilitate Approvals</strong> and keep communication lines open.</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• <strong>Vet Candidate Files</strong> for compliance and quality.</Typography>
                    <Typography variant="body2">• <strong>System Maintenance</strong> including signatures and preferences.</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                    "You turn policy into practice and potential into performance!"
                </Typography>
            </Stack>
        )
    },
    [AppRole.Admin]: {
        title: "The System Architect",
        color: "#4b5563",
        icon: "🏗️",
        description: (
            <Stack spacing={2}>
                <Typography variant="body1">
                    As an <strong>Administrator</strong>, you hold the keys to the entire recruitment ecosystem! 🔑
                </Typography>
                <Typography variant="body2">
                    You ensure all roles have the right permissions, the system preferences are tuned, and the data flows securely across every department.
                </Typography>
            </Stack>
        )
    }
};

export const DEFAULT_STORY: RoleStory = {
    title: "Team Member",
    color: "#6366f1",
    icon: "👤",
    description: (
        <Typography variant="body1">
            Welcome! You are an essential part of the recruitment process, helping us find and evaluate the best talent for our company.
        </Typography>
    )
};
