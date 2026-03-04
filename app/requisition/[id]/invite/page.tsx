"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Autocomplete,
    TextField,
    Button,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    CircularProgress,
    Stack,
    Divider,
    alpha,
    Tooltip,
    Chip,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchRequisitionById, callInviteInterviewers } from "@/redux/slices/requisition";
import RequisitionHeader from "@/components/requisition/RequisitionHeader";
import { searchInterviewers } from "@/api/interview";
import {
    Close,
    PersonAdd,
    Send,
    Search,
    GroupAddRounded,
    CheckCircleOutline
} from "@mui/icons-material";

interface Interviewer {
    id: string;
    displayName: string;
    mail: string;
    jobTitle: string;
}

const InvitePage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params?.id ? decodeURIComponent(params.id as string) : "";
    const { selectedRequisition, loading } = useSelector(
        (state: RootState) => state.requisitions
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Interviewer[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedInterviewers, setSelectedInterviewers] = useState<Interviewer[]>([]);

    // Auto-generate the default message with a link to the requisition
    const defaultMessage = useMemo(() => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        // Use encodeURIComponent to handle spaces or special characters in the ID
        const requisitionLink = `${baseUrl}/requisition/${encodeURIComponent(id)}`;
        return `Hi, I would like to invite you to collaborate as an interviewer for the requisition: ${selectedRequisition?.position || 'this position'}.\n\nYou can view the details here: ${requisitionLink}\n\nYour expertise would be greatly valued in evaluating the candidates.`;
    }, [id, selectedRequisition]);

    const [inviteMessage, setInviteMessage] = useState("");

    // Set the invite message once the requisition data loads
    useEffect(() => {
        if (defaultMessage && !inviteMessage) {
            setInviteMessage(defaultMessage);
        }
    }, [defaultMessage]);

    useEffect(() => {
        if (id) {
            fetchRequisitionById(id as string);
        }
    }, [id]);

    // Simple debounce implementation
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!searchQuery || searchQuery.length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const results = await searchInterviewers(searchQuery);
                setSearchResults(results || []);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const addInterviewer = (interviewer: Interviewer | null) => {
        if (interviewer && !selectedInterviewers.find((i) => i.mail === interviewer.mail)) {
            setSelectedInterviewers([...selectedInterviewers, interviewer]);
        }
        setSearchQuery("");
    };

    const removeInterviewer = (mail: string) => {
        setSelectedInterviewers(selectedInterviewers.filter((i) => i.mail !== mail));
    };

    const handleSendInvites = async () => {
        if (!id || selectedInterviewers.length === 0) return;

        const users = selectedInterviewers.map(i => ({
            email: i.mail,
            displayName: i.displayName
        }));

        try {
            await callInviteInterviewers({
                requisitionId: id as string,
                users,
                message: inviteMessage
            });
            // Clear the selected list after successful invite
            setSelectedInterviewers([]);
            // Success feedback would be good here, but for now we just clear the list as requested
        } catch (error) {
            console.error("Failed to send invites", error);
        }
    };

    return (
        <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "background.default" }}>
            <Container maxWidth="md">
                <RequisitionHeader
                    title={`Invite to ${selectedRequisition?.position || "Requisition"}`}
                    requisitionId={id as string}
                    isEditMode
                />

                <Paper
                    elevation={0}
                    sx={{
                        p: 5,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        background: 'linear-gradient(to bottom right, #ffffff, #fafafa)'
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: alpha('#155dfc', 0.1),
                                color: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <GroupAddRounded fontSize="large" />
                        </Box>
                        <Box>
                            <Typography variant="h5" fontWeight={700}>
                                Invite Collaborators
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Search and add colleagues to participate in this hiring process.
                            </Typography>
                        </Box>
                    </Stack>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.primary' }}>
                            Find people by name or email
                        </Typography>
                        <Autocomplete
                            fullWidth
                            options={searchResults}
                            getOptionLabel={(option) => `${option.displayName} (${option.mail})`}
                            onInputChange={(e, value) => setSearchQuery(value)}
                            onChange={(e, value) => addInterviewer(value)}
                            value={null}
                            loading={isSearching}
                            clearOnBlur
                            blurOnSelect
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Type name or email address..."
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <Search sx={{ color: 'text.disabled', mr: 1, ml: 1 }} />
                                        ),
                                        endAdornment: (
                                            <React.Fragment>
                                                {isSearching ? <CircularProgress color="primary" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                        sx: { borderRadius: 2, pl: 1 }
                                    }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <Box component="li" {...props} sx={{ py: 1.5, px: 2, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: alpha('#155dfc', 0.1), color: 'primary.main', fontWeight: 600 }}>
                                            {option.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={option.displayName}
                                        secondary={
                                            <Typography variant="caption" color="text.secondary" component="span">
                                                {option.jobTitle} • {option.mail}
                                            </Typography>
                                        }
                                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
                                    />
                                    {selectedInterviewers.find(i => i.mail === option.mail) && (
                                        <CheckCircleOutline color="success" fontSize="small" />
                                    )}
                                </Box>
                            )}
                        />
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: "text.primary" }}>
                            Message (Optional)
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            placeholder="Add a personalized message..."
                            value={inviteMessage}
                            onChange={(e) => setInviteMessage(e.target.value)}
                            sx={{
                                bgcolor: alpha("#f3f4f6", 0.3),
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                        />
                    </Box>

                    {selectedInterviewers.length > 0 && (
                        <Box sx={{
                            mt: 4,
                            p: 3,
                            borderRadius: 2,
                            bgcolor: alpha('#f3f4f6', 0.5),
                            border: '1px dashed',
                            borderColor: 'divider'
                        }}>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                Pending Invitations <Chip label={selectedInterviewers.length} size="small" color="primary" sx={{ fontWeight: 700 }} />
                            </Typography>
                            <List sx={{ pt: 1 }}>
                                {selectedInterviewers.map((interviewer) => (
                                    <ListItem
                                        key={interviewer.mail}
                                        sx={{
                                            mb: 1,
                                            bgcolor: 'background.paper',
                                            borderRadius: 2,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', fontSize: '0.875rem' }}>
                                                {interviewer.displayName.split(' ').map(n => n[0]).join('')}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={interviewer.displayName}
                                            secondary={interviewer.mail}
                                            primaryTypographyProps={{ fontWeight: 600 }}
                                        />
                                        <ListItemSecondaryAction>
                                            <Tooltip title="Remove">
                                                <IconButton edge="end" onClick={() => removeInterviewer(interviewer.mail)} size="small">
                                                    <Close fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}

                    <Divider sx={{ my: 5 }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Button
                            variant="text"
                            onClick={() => router.back()}
                            sx={{ color: 'text.secondary', fontWeight: 600 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Send />}
                            onClick={handleSendInvites}
                            disabled={selectedInterviewers.length === 0 || loading}
                            sx={{
                                px: 4,
                                py: 1.2,
                                borderRadius: 2,
                                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                                '&:hover': {
                                    boxShadow: (theme) => `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                                }
                            }}
                        >
                            Confirm and Send Invites
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default InvitePage;
