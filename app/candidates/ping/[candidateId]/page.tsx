"use client";

import React, { useEffect, useState, use } from 'react';
import {
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    Chip,
    Divider,
    Paper,
    Avatar,
    Container
} from '@mui/material';
import { 
    Send, 
    FormatBold, 
    FormatItalic, 
    FormatUnderlined, 
    FormatListBulleted, 
    InsertLink,
    Image,
    MoreVert,
    ArrowBack
} from '@mui/icons-material';
import { dispatch } from '@/redux/dispatchHandle';
import { fetchRequisitionById, clearSelectedRequisition } from '@/redux/slices/requisition';
import { fetchSingleCandidate, clearSelectedCandidate } from '@/redux/slices/candidates';
import { useSelector, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { AppRole, AutomationType } from '@/utils/constants';
import { pingHiringManager } from '@/api/candidate';
import { enqueueSnackbar } from 'notistack';

interface PageProps {
    params: Promise<{
        candidateId: string;
    }>;
}

export default function PingHiringManagerPage({ params }: PageProps) {
    const router = useRouter();
    const { candidateId } = use(params);
    
    // Selectors
    const { selectedRequisition, loading: reqLoading } = useSelector((state: RootState) => state.requisitions);
    const { selectedCandidate, loading: candLoading } = useSelector((state: RootState) => state.candidates);

    // Form State
    const [to, setTo] = useState<string[]>([]);
    const [cc, setCc] = useState<string[]>([]);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    
    const asyncFetchSingleCandidate = async (candidateId: string) => {
        try {
            await fetchSingleCandidate(candidateId)
        } catch (error) {
            console.error('Error fetching candidate:', error);
        }
    };

    const asyncFetchRequisitionById = async (requisitionId: string) => {
        try {
            await fetchRequisitionById(requisitionId)
        } catch (error) {
            console.error('Error fetching requisition:', error);
        }
    };
    
    // 1. Fetch Candidate on mount
    useEffect(() => {
        if (candidateId) {
            asyncFetchSingleCandidate(candidateId);
        }
        return () => {
            dispatch(clearSelectedCandidate());
            dispatch(clearSelectedRequisition());
        };
    }, [candidateId]);

    // 2. Fetch Requisition when candidate is loaded
    useEffect(() => {
        console.log('call the fetch requisition by id ')
        if (selectedCandidate?.requisition_id) {
            console.log('call the fetch requisition by id ')
            asyncFetchRequisitionById(selectedCandidate.requisition_id);
        }
    }, [selectedCandidate]);
    console.log('selectedRequisition', selectedRequisition);
    console.log('selectedCandidate', selectedCandidate);

    // 3. Populate fields when requisition/candidate data is available
    useEffect(() => {
        if (selectedRequisition !== null && selectedCandidate !== null) {
            console.log('you can get what i am asking for ')
            // Populate "To" with stakeholder names
            if (selectedRequisition.stakeholder_names && selectedRequisition.stakeholder_names.length > 0) {
                //we want to set hiring manager email to be the ones whom their role is AppRol.HiringManager and set it to the to field
                const hiringManager = selectedRequisition.stakeholder_names.filter(s => s.role === AppRole.HiringManager);
                if (hiringManager.length > 0) {
                    setTo(hiringManager.map(s => s.email));
                }
                const otherStakeholders = selectedRequisition.stakeholder_names.filter(s => s.role !== AppRole.HiringManager);
                if (otherStakeholders.length > 0) {
                    setCc(otherStakeholders.map(s => s.email));
                }
            }
            
            // Set default subject
            if (!subject) {
                setSubject(`Candidate Update: ${selectedCandidate.candidate_name} - ${selectedRequisition.position}`);
            }
            
            // Set default body
            if (!body) {
                setBody(`Hi Team,\n\nI wanted to bring your attention to ${selectedCandidate.candidate_name} for the ${selectedRequisition.position} role.\n\nBest regards,`);
            }
        }
    }, [selectedRequisition, selectedCandidate]);

    const handleSend = async () => {
        // Here you would implement the actual email sending logic
        await pingHiringManager({ 
            to: to.join(';'), 
            cc: cc.join(';'), 
            subject, 
            body, 
            automationType: AutomationType.PING_HIRING_MANAGER 
        });
        enqueueSnackbar(`Email sent to hiring managers regarding ${selectedCandidate?.candidate_name}`, { variant: 'success' });
        router.back();
    };

    const handleBack = () => {
        router.back();
    };

    const isLoading = reqLoading || candLoading;

    return (
        <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            p: 3,
            bgcolor: 'background.default',
        }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Button 
                    startIcon={<ArrowBack />} 
                    onClick={handleBack}
                    sx={{ mr: 1, color: 'text.secondary', textTransform: 'none' }}
                >
                    Back
                </Button>
            </Box>

            <Paper 
                elevation={0}
                variant="outlined"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 1,
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    borderColor: 'divider',
                    minHeight: '600px' // Ensure it has some height even if content is small
                }}
            >
                {/* Header / Toolbar */}
                <Box sx={{ 
                    px: 3, 
                    py: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'end', 
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: 'action.hover' // Slight contrast for toolbar
                }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<Send />}
                            onClick={handleSend}
                            disabled={isLoading}
                            disableElevation // Flat button
                            sx={{ textTransform: 'none', px: 4 }}
                        >
                            Send Email
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="inherit" 
                            sx={{ textTransform: 'none', borderColor: 'divider' }}
                            onClick={handleBack}
                        >
                            Discard
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    
                    {/* To Field */}
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ width: 80, fontWeight: 600 }}>To:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flexGrow: 1 }}>
                            {to.map((name, index) => (
                                <Chip 
                                    key={index} 
                                    label={name} 
                                    size="small" 
                                    onDelete={() => setTo(to.filter((_, i) => i !== index))}
                                    avatar={<Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>{name[0]}</Avatar>} 
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* CC Field */}
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ width: 80, fontWeight: 600 }}>Cc:</Typography>
                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flexGrow: 1 }}>
                            {cc.map((name, index) => (
                                <Chip 
                                    key={index} 
                                    label={name} 
                                    size="small" 
                                    onDelete={() => setCc(cc.filter((_, i) => i !== index))}
                                    avatar={<Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>{name[0]}</Avatar>} 
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Subject Field */}
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
                         <Typography variant="body2" color="text.secondary" sx={{ width: 80, fontWeight: 600 }}>Subject:</Typography>
                        <TextField 
                            fullWidth 
                            variant="standard" 
                            placeholder="Add a subject" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            InputProps={{ disableUnderline: true, style: { fontWeight: 500 } }}
                        />
                    </Box>

                    {/* Formatting Toolbar */}
                    <Box sx={{ 
                        px: 3, 
                        py: 1.5, 
                        display: 'flex', 
                        gap: 1, 
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.default'
                    }}>
                        <IconButton size="small"><FormatBold fontSize="small" /></IconButton>
                        <IconButton size="small"><FormatItalic fontSize="small" /></IconButton>
                        <IconButton size="small"><FormatUnderlined fontSize="small" /></IconButton>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        <IconButton size="small"><FormatListBulleted fontSize="small" /></IconButton>
                        <IconButton size="small"><InsertLink fontSize="small" /></IconButton>
                        <IconButton size="small"><Image fontSize="small" /></IconButton>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton size="small"><MoreVert fontSize="small" /></IconButton>
                    </Box>

                    {/* Body */}
                    <TextField
                        multiline
                        fullWidth
                        variant="standard"
                        placeholder="Type your message here..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        InputProps={{ 
                            disableUnderline: true 
                        }}
                        sx={{ 
                            flexGrow: 1, 
                            p: 3,
                            '& .MuiInputBase-root': {
                                height: '100%',
                                alignItems: 'flex-start',
                                fontSize: '1rem',
                                lineHeight: 1.6
                            }
                        }}
                    />
                </Box>
            </Paper>
        </Box>
    );
}
