"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    alpha,
    Autocomplete,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    CheckCircleOutline,
    Close,
    GroupAddRounded,
    PersonAdd,
    PersonRemove,
    Search,
    Send,
} from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
    fetchRequisitionById,
    callInviteInterviewers,
    callRemoveRecruiters,
} from "@/redux/slices/requisition";
import RequisitionHeader from "@/components/requisition/RequisitionHeader";
import { searchInterviewers } from "@/api/interview";

interface Interviewer {
    id: string;
    displayName: string;
    mail: string;
    jobTitle: string;
}

// ---------------------------------------------------------------------------
// Invite modal
// ---------------------------------------------------------------------------

function InviteModal({
    open,
    onClose,
    requisitionId,
    position,
}: {
    open: boolean;
    onClose: () => void;
    requisitionId: string;
    position: string;
}) {
    const { loading } = useSelector((state: RootState) => state.requisitions);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Interviewer[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedInterviewers, setSelectedInterviewers] = useState<Interviewer[]>([]);

    const defaultMessage = useMemo(() => {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        const link = `${baseUrl}/requisition/${encodeURIComponent(requisitionId)}`;
        return `Hi, I would like to invite you to collaborate as an interviewer for the requisition: ${position || "this position"}.\n\nYou can view the details here: ${link}\n\nYour expertise would be greatly valued in evaluating the candidates.`;
    }, [requisitionId, position]);

    const [inviteMessage, setInviteMessage] = useState(defaultMessage);

    useEffect(() => {
        if (open) {
            setInviteMessage(defaultMessage);
            setSelectedInterviewers([]);
            setSearchQuery("");
        }
    }, [open, defaultMessage]);

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
            } catch {
                // silent
            } finally {
                setIsSearching(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const addInterviewer = (interviewer: Interviewer | null) => {
        if (interviewer && !selectedInterviewers.find((i) => i.mail === interviewer.mail)) {
            setSelectedInterviewers((prev) => [...prev, interviewer]);
        }
        setSearchQuery("");
    };

    const removeInterviewer = (mail: string) => {
        setSelectedInterviewers((prev) => prev.filter((i) => i.mail !== mail));
    };

    const handleSend = async () => {
        if (!requisitionId || selectedInterviewers.length === 0) return;
        const users = selectedInterviewers.map((i) => ({
            email: i.mail,
            displayName: i.displayName,
        }));
        await callInviteInterviewers({ requisitionId, users, message: inviteMessage });
        // Refetch so the stakeholder list updates
        await fetchRequisitionById(requisitionId);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" gap={1.5}>
                        <Box
                            sx={{
                                p: 1, borderRadius: 1.5,
                                bgcolor: alpha("#155dfc", 0.1), color: "primary.main",
                                display: "flex", alignItems: "center",
                            }}
                        >
                            <GroupAddRounded fontSize="small" />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                                Invite Collaborators
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Search and add colleagues to this hiring process
                            </Typography>
                        </Box>
                    </Stack>
                    <IconButton size="small" onClick={onClose}>
                        <Close fontSize="small" />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
                {/* Search */}
                <Box>
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Find DAG staff by name or email
                    </Typography>
                    <Autocomplete
                        fullWidth
                        options={searchResults}
                        getOptionLabel={(o) => `${o.displayName} (${o.mail})`}
                        onInputChange={(_, value) => setSearchQuery(value)}
                        onChange={(_, value) => addInterviewer(value)}
                        value={null}
                        loading={isSearching}
                        clearOnBlur
                        blurOnSelect
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Type name or email address..."
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: <Search sx={{ color: "text.disabled", mr: 1, ml: 1 }} />,
                                    endAdornment: (
                                        <>
                                            {isSearching && <CircularProgress color="primary" size={18} />}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                    sx: { borderRadius: 2, pl: 1 },
                                }}
                            />
                        )}
                        renderOption={({ key, ...props }, option) => (
                            <Box key={key} component="li" {...props}
                                sx={{ py: 1.5, px: 2, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: 0 } }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: alpha("#155dfc", 0.1), color: "primary.main", fontWeight: 600, width: 36, height: 36, fontSize: "0.85rem" }}>
                                        {option.displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={option.displayName}
                                    secondary={`${option.jobTitle} • ${option.mail}`}
                                    slotProps={{ primary: { fontWeight: 600 }, secondary: { variant: "caption" } }}
                                />
                                {selectedInterviewers.find((i) => i.mail === option.mail) && (
                                    <CheckCircleOutline color="success" fontSize="small" />
                                )}
                            </Box>
                        )}
                    />
                </Box>

                {/* Message */}
                <Box>
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Message (Optional)
                    </Typography>
                    <TextField
                        fullWidth multiline rows={5}
                        placeholder="Add a personalized message..."
                        value={inviteMessage}
                        onChange={(e) => setInviteMessage(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                </Box>

                {/* Pending list */}
                {selectedInterviewers.length > 0 && (
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha("#f3f4f6", 0.6), border: "1px dashed", borderColor: "divider" }}>
                        <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
                            <Typography variant="subtitle2" fontWeight={700}>Pending Invitations</Typography>
                            <Chip label={selectedInterviewers.length} size="small" color="primary" />
                        </Stack>
                        <List disablePadding>
                            {selectedInterviewers.map((interviewer) => (
                                <ListItem
                                    key={interviewer.mail}
                                    sx={{ mb: 1, bgcolor: "background.paper", borderRadius: 1.5, border: "1px solid", borderColor: "divider" }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: "secondary.main", color: "secondary.contrastText", fontSize: "0.8rem", width: 32, height: 32 }}>
                                            {interviewer.displayName.split(" ").map((n) => n[0]).join("")}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={interviewer.displayName}
                                        secondary={interviewer.mail}
                                        slotProps={{ primary: { variant: "body2", fontWeight: 600 }, secondary: { variant: "caption" } }}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton size="small" onClick={() => removeInterviewer(interviewer.mail)}>
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button color="inherit" onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Send />}
                    disabled={selectedInterviewers.length === 0 || loading}
                    onClick={handleSend}
                    sx={{ borderRadius: 2 }}
                >
                    Send Invites
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function InvitePage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id ? decodeURIComponent(params.id as string) : "";
    const { selectedRequisition, loading } = useSelector((state: RootState) => state.requisitions);

    const [inviteOpen, setInviteOpen] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        if (id) fetchRequisitionById(id);
    }, [id]);

    const stakeholders = selectedRequisition?.stakeholder_names ?? [];

    const handleRemove = async (stakeholderId: string, stakeholderEmail: string) => {
        setRemovingId(stakeholderId);
        await callRemoveRecruiters(id, stakeholderId, stakeholderEmail);
        setRemovingId(null);
    };

    return (
        <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "background.default" }}>
            <Box maxWidth={720} mx="auto">
                <RequisitionHeader
                    title={`Stakeholders — ${selectedRequisition?.position || "Requisition"}`}
                    requisitionId={id}
                    isEditMode
                />

                {/* Header row */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Stakeholders
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            People currently collaborating on this requisition
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<PersonAdd />}
                        onClick={() => setInviteOpen(true)}
                        sx={{ borderRadius: 2 }}
                    >
                        Invite Collaborators
                    </Button>
                </Stack>

                {/* Stakeholder list */}
                {loading && stakeholders.length === 0 ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : stakeholders.length === 0 ? (
                    <Box
                        sx={{
                            py: 8, textAlign: "center", border: "1px dashed", borderColor: "divider",
                            borderRadius: 3, bgcolor: "action.hover",
                        }}
                    >
                        <GroupAddRounded sx={{ fontSize: 48, color: "text.disabled", mb: 1.5 }} />
                        <Typography variant="body1" color="text.secondary" fontWeight={500}>
                            No stakeholders yet
                        </Typography>
                        <Typography variant="body2" color="text.disabled" mt={0.5}>
                            Invite colleagues using the button above
                        </Typography>
                    </Box>
                ) : (
                    <List disablePadding sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
                        {stakeholders.map((s, idx) => (
                            <ListItem
                                key={s.id}
                                divider={idx < stakeholders.length - 1}
                                sx={{ py: 1.5, px: 2.5 }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: alpha("#155dfc", 0.1), color: "primary.main", fontWeight: 700, fontSize: "0.85rem" }}>
                                        {s.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={s.name}
                                    secondary={s.email}
                                    slotProps={{ primary: { fontWeight: 600 }, secondary: { variant: "caption" } }}
                                />
                                {/* {s.role && (
                                    <Chip label={s.role} size="small" variant="outlined" sx={{ mr: 1, fontSize: "0.7rem" }} />
                                )} */}
                                <Tooltip title="Remove stakeholder" arrow>
                                    <span>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            disabled={removingId === s.id}
                                            onClick={() => handleRemove(s.id, s.email)}
                                        >
                                            {removingId === s.id
                                                ? <CircularProgress size={16} color="error" />
                                                : <PersonRemove fontSize="small" />
                                            }
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>

            <InviteModal
                open={inviteOpen}
                onClose={() => setInviteOpen(false)}
                requisitionId={id}
                position={selectedRequisition?.position ?? ""}
            />
        </Box>
    );
}
