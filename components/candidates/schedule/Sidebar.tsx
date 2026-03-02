"use client";

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Stack, Chip, Avatar,
    IconButton, Select, MenuItem, SelectChangeEvent,
    List, ListItem, ListItemAvatar, ListItemText, Paper, CircularProgress,
    ListItemButton
} from '@mui/material';
import { Search, Add, Person } from '@mui/icons-material';
import { useSelector, useDispatch } from '@/redux/store';
import { setMeetingDetails, removeInterviewer, addInterviewer, updateInterviewer, setLocation, setEditPreview } from '@/redux/slices/schedule';
import { getInterviewerAvailability, searchInterviewers } from '@/api/interview';

const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <Box sx={{ mb: 4 }}>
        <Typography
            variant="caption"
            sx={{
                fontWeight: 700,
                color: 'text.secondary',
                letterSpacing: '0.05em',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&::before': {
                    content: '""',
                    display: 'block',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    bgcolor: 'primary.main'
                }
            }}
        >
            {title}
        </Typography>
        <Stack spacing={2.5}>
            {children}
        </Stack>
    </Box>
);

export const CandidateDetailsSidebar = () => {
    const { candidate } = useSelector((state) => state.schedule);
    return (
        <SidebarSection title="CANDIDATE DETAILS">
            <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>Full Name</Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={candidate?.candidate_name || ''}
                    disabled
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#f8fafc',
                            '& fieldset': { borderColor: '#e2e8f0' }
                        }
                    }}
                />
            </Box>
            <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>Email Address</Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={candidate?.email || ''}
                    disabled
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#f8fafc',
                            '& fieldset': { borderColor: '#e2e8f0' }
                        }
                    }}
                />
            </Box>
        </SidebarSection>
    );
};

export const InterviewersSidebar = () => {
    const dispatch = useDispatch();
    const { internalInterviewers, interviewTitle, date, duration } = useSelector((state) => state.schedule);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);


    console.log('the internal interviewers are ', internalInterviewers)
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                setIsSearching(true);
                setShowResults(true);
                try {
                    const results = await searchInterviewers(searchQuery);
                    setSearchResults(results || []);
                } catch (error) {
                    console.error("Search failed:", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSelectInterviewer = async (member: any) => {
        dispatch(addInterviewer({
            displayName: member.displayName,
            jobTitle: member.jobTitle,
            avatar: member.avatar,
            email: member.mail
        }));
        setSearchQuery('');
        setShowResults(false);

        // after selecting the interviewer, we want to get their availability so we can show it on the calender grid 
        try {
            const availabilities = await getInterviewerAvailability([member.mail], date);
            if (Array.isArray(availabilities)) {
                availabilities.forEach((avail: any) => {
                    dispatch(updateInterviewer({
                        email: avail.scheduleId,
                        data: { availabilityView: avail.availabilityView }
                    }));
                });
            }
        } catch (error) {
            console.error("Failed to fetch availability:", error);
        }
    };

    return (
        <SidebarSection title="INTERVIEWERS">
            <Box sx={{ position: 'relative' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>Internal Team</Typography>
                {/* if there is no title, date and duration - we do not want to show this interview section  */}
                {!interviewTitle || !date || !duration ? (
                    <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>Set the Meeting Details </Typography>
                ) : (
                    <Box>
                        <TextField
                            fullWidth
                            placeholder="Search team members..."
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                            InputProps={{
                                startAdornment: <Search sx={{ color: 'text.disabled', mr: 1, fontSize: 18 }} />,
                                endAdornment: isSearching && <CircularProgress size={16} />,
                                sx: { borderRadius: 2, bgcolor: '#f8fafc' }
                            }}
                        />
                    </Box>
                )}

                {showResults && searchResults.length > 0 && (
                    <Paper
                        elevation={4}
                        sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            zIndex: 100,
                            mt: 1,
                            maxHeight: 200,
                            overflowY: 'auto',
                            borderRadius: 2
                        }}
                    >
                        <List disablePadding>
                            {searchResults.map((member: any, idx: number) => (
                                <ListItem
                                    key={idx}
                                    disablePadding
                                >
                                    <ListItemButton
                                        onClick={() => handleSelectInterviewer(member)}
                                        sx={{ '&:hover': { bgcolor: '#f1f5f9' } }}
                                    >
                                        <ListItemAvatar sx={{ minWidth: 40 }}>
                                            <Avatar sx={{ width: 24, height: 24 }} src={member.avatar}>
                                                <Person sx={{ fontSize: 16 }} />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={member.displayName}
                                            secondary={member.jobTitle}
                                            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                                            secondaryTypographyProps={{ variant: 'caption' }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}

                <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
                    {internalInterviewers.map((member, idx) => (
                        <Chip
                            key={idx}
                            avatar={<Avatar alt={member.displayName} sx={{ width: 20, height: 20 }}>{member.displayName[0]}</Avatar>}
                            label={member.displayName}
                            onDelete={() => dispatch(removeInterviewer(idx))}
                            variant="outlined"
                            sx={{
                                bgcolor: '#eff6ff',
                                borderColor: '#bfdbfe',
                                borderRadius: 2,
                                '& .MuiChip-label': { color: '#1e40af', fontWeight: 600, fontSize: '0.75rem' },
                                '& .MuiChip-deleteIcon': { color: '#3b82f6', fontSize: 16 }
                            }}
                        />
                    ))}
                </Stack>
            </Box>
            <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>Guest Interviewer</Typography>
                <Stack direction="row" spacing={1}>
                    <TextField
                        fullWidth
                        placeholder="email@external.com"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <IconButton size="small" sx={{ bgcolor: '#f1f5f9', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Add sx={{ fontSize: 20 }} />
                    </IconButton>
                </Stack>
            </Box>
        </SidebarSection>
    );
};

export const MeetingDetailsSidebar = () => {
    const dispatch = useDispatch();
    const { interviewTitle, date, duration, internalInterviewers, locationType, locationDetails } = useSelector((state) => state.schedule);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setMeetingDetails({ title: e.target.value }));
    };

    const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        dispatch(setMeetingDetails({ date: newDate }));

        // we also want to refetch the availability of all the interviewers for the new date
        if (internalInterviewers.length > 0) {
            try {
                const emails = internalInterviewers.map((member: any) => member.email);
                const availabilities = await getInterviewerAvailability(emails, newDate);
                if (Array.isArray(availabilities)) {
                    availabilities.forEach((avail: any) => {
                        dispatch(updateInterviewer({
                            email: avail.scheduleId,
                            data: { availabilityView: avail.availabilityView }
                        }));
                    });
                }
            } catch (error) {
                console.error("Failed to fetch availability:", error);
            }
        }
    };

    const handleDurationChange = (e: SelectChangeEvent<number>) => {
        dispatch(setMeetingDetails({ duration: Number(e.target.value) }));
    };

    const handleLocationTypeChange = (e: SelectChangeEvent<string>) => {
        dispatch(setLocation({ type: e.target.value as 'online' | 'in_person' }));
    };

    const handleLocationDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setLocation({ type: locationType, details: e.target.value }));
    };

    return (
        <SidebarSection title="MEETING DETAILS">
            <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>Interview Title</Typography>
                <TextField
                    fullWidth
                    value={interviewTitle}
                    onChange={handleTitleChange}
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
            </Box>
            <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>Date</Typography>
                    <TextField
                        fullWidth
                        type="date"
                        value={date}
                        onChange={handleDateChange}
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>Duration</Typography>
                    <Select
                        fullWidth
                        value={duration}
                        onChange={handleDurationChange}
                        size="small"
                        sx={{ borderRadius: 2 }}
                    >
                        <MenuItem value={30}>30 mins</MenuItem>
                        <MenuItem value={60}>60 mins</MenuItem>
                        <MenuItem value={90}>90 mins</MenuItem>
                    </Select>
                </Box>
            </Stack>

            <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>Location Type</Typography>
                <Select
                    fullWidth
                    value={locationType}
                    onChange={handleLocationTypeChange}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    <MenuItem value="online">Online (Teams)</MenuItem>
                    <MenuItem value="in_person">In-Person</MenuItem>
                </Select>
            </Box>

            {locationType === 'in_person' ? (
                <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>Location Details / Address</Typography>
                    <TextField
                        fullWidth
                        placeholder="Room 302, Lagos Office"
                        value={locationDetails}
                        onChange={handleLocationDetailsChange}
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                </Box>
            ) : (
                <Box sx={{ p: 1.5, bgcolor: '#f0f9ff', borderRadius: 2, border: '1px solid #bae6fd' }}>
                    <Typography variant="caption" sx={{ color: '#0369a1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>ℹ️</span> Microsoft Teams link will be generated automatically.
                    </Typography>
                </Box>
            )}
        </SidebarSection>
    );
};

export const ScheduleSidebar = () => {
    return (
        <Box sx={{ width: 320, borderRight: '1px solid #e5e7eb', p: 3, overflowY: 'auto' }}>
            <CandidateDetailsSidebar />
            <MeetingDetailsSidebar />
            <InterviewersSidebar />

        </Box>
    );
};
