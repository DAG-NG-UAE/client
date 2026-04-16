import { Box, Typography, Paper, Chip, TextField, Stack, IconButton, MenuItem, Select, Button, useTheme, Tooltip, CircularProgress, Avatar, Popover, List, ListItem, ListItemText, ListItemAvatar, Checkbox, InputAdornment, ListItemButton, Switch, FormControlLabel, alpha } from '@mui/material';
import { useEffect, useState } from 'react';
import { Requisition, RequisitionPosition, RequisitionPositionLists } from '@/interface/requisition';
import { Add, Close, Search } from '@mui/icons-material';
import { searchInterviewers } from '@/api/interview';
import { AppRole } from '@/utils/constants';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getFirstAndLastInitials } from '@/utils/transform';
import { callAssignRecruiters, callRemoveRecruiters, callAddRequisitionLocation, callUpdateRequisitionLocation, callDeleteRequisitionLocation } from '@/redux/slices/requisition';
import { Check, Edit, Close as CloseIcon, ContentCopy as CopyIcon } from '@mui/icons-material';

interface JobPostingDetailsProps {
  requisition: Partial<Requisition>;
  isEditMode?: boolean;
  handlePublishRequisition?: (requisitionId: string) => void
  handleUnpublishRequisition?: (requisitionId: string, jobListKey: string) => void
}

interface Interviewer {
  id: string;
  displayName: string;
  mail: string;
  jobTitle: string;
}


const JobPostingDetails = ({ requisition, isEditMode = false, handlePublishRequisition, handleUnpublishRequisition }: JobPostingDetailsProps) => {
  console.log(`the requisition is => ${JSON.stringify(requisition)}`)
  const theme = useTheme();
  // We no longer fetch all recruiters by default
  const { selectedRequisition } = useSelector((state: RootState) => state.requisitions)
  const { user } = useSelector((state: RootState) => state.auth)

  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const link = requisition.public_share_link || selectedRequisition?.public_share_link;
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };



  // Recruiter Assignment State
  const [assignedRecruiters, setAssignedRecruiters] = useState<{ user_id?: string, full_name?: string, email?: string, color?: string }[]>([]);

  useEffect(() => {
    if (requisition.stakeholder_names) {
      const assigned = requisition.stakeholder_names
        .filter(stakeholder => stakeholder.role === AppRole.Recruiter)
        .map(stakeholder => ({
          user_id: stakeholder.id,
          full_name: stakeholder.name,
          email: stakeholder.email,
        }));
      setAssignedRecruiters(assigned);
    } else {
      setAssignedRecruiters([]);
    }
  }, [requisition.stakeholder_names]);

  const [recruiterAnchorEl, setRecruiterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [recruiterSearch, setRecruiterSearch] = useState('');
  const [isSearchingRecruiters, setIsSearchingRecruiters] = useState(false);
  const [recruiterSearchResults, setRecruiterSearchResults] = useState<Interviewer[]>([]);
  const [tempSelectedRecruiters, setTempSelectedRecruiters] = useState<Interviewer[]>([]);
  const [assigningRecruiters, setAssigningRecruiters] = useState(false);
  const [removingRecruiterId, setRemovingRecruiterId] = useState<string | null>(null);

  // Debounced search for recruiters
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!recruiterSearch || recruiterSearch.length < 2) {
        setRecruiterSearchResults([]);
        return;
      }
      setIsSearchingRecruiters(true);
      try {
        const results = await searchInterviewers(recruiterSearch);
        setRecruiterSearchResults(results || []);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearchingRecruiters(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [recruiterSearch]);



  // Recruiter Handlers
  const handleRecruiterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Current assigned recruiters as base for selection
    const initialSelection = assignedRecruiters.map(r => ({
      mail: r.email,
      displayName: r.full_name,
      id: r.user_id,
      jobTitle: ''
    } as Interviewer));
    setTempSelectedRecruiters(initialSelection);
    setRecruiterAnchorEl(event.currentTarget);
  };

  const handleCloseRecruiterPopover = () => {
    setRecruiterAnchorEl(null);
    setRecruiterSearch('');
    setRecruiterSearchResults([]);
  };

  const handleToggleRecruiter = (recruiter: Interviewer) => {
    setTempSelectedRecruiters(prev =>
      prev.find(r => r.mail === recruiter.mail)
        ? prev.filter(r => r.mail !== recruiter.mail)
        : [...prev, recruiter]
    );
  };

  const handleAssignRecruitersAction = async () => {
    setAssigningRecruiters(true);
    try {
      if (requisition.requisition_id) {
        await callAssignRecruiters(
          requisition.requisition_id,
          tempSelectedRecruiters.map(r => ({ email: r.mail, displayName: r.displayName }))
        )
      }
      handleCloseRecruiterPopover();
    } catch (error) {
      console.error("Failed to assign recruiters", error);
    } finally {
      setAssigningRecruiters(false);
    }
  };

  const handleRemoveRecruiter = async (recruiterIdToRemove: string) => {
    if (!requisition.requisition_id) return;

    setRemovingRecruiterId(recruiterIdToRemove);
    try {
      const recruiterToRemove = assignedRecruiters.find(r => r.user_id === recruiterIdToRemove);
      const email = recruiterToRemove?.email || "";

      await callRemoveRecruiters(requisition.requisition_id, recruiterIdToRemove, email);
    } catch (error) {
      console.error("Failed to remove recruiter", error);
    } finally {
      setRemovingRecruiterId(null);
    }
  };





  const openRecruiterPopover = Boolean(recruiterAnchorEl);
  const recruiterPopoverId = openRecruiterPopover ? 'recruiter-popover' : undefined;

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Job Posting & Publication Status
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 6 }}>
        {/* Left Column: Posting Locations */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" display="block" gutterBottom>
            Posting Locations
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {requisition.locations ? (
              <Chip
                label={`${requisition.locations} (${requisition.num_positions || 0})`}
                variant="outlined"
                color="primary"
                sx={{
                  bgcolor: 'action.hover',
                  fontWeight: 500
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">No location set</Typography>
            )}
          </Stack>
        </Box>

        {/* Right Column: Visibility & Recruiters */}
        <Stack spacing={4} sx={{ minWidth: 300 }}>
          {/* Public Visibility */}
          <Box>
            <Typography variant="body2" display="block" gutterBottom>
              Public Visibility
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              {/* Status Indicator Dot */}
              <Box sx={{
                width: 8, height: 8,
                borderRadius: '50%',
                bgcolor: requisition.sanity_job_list_key ? 'success.main' : 'text.disabled'
              }} />

              <Typography
                variant="body2"
                sx={{
                  color: requisition.sanity_job_list_key ? 'success.main' : 'text.disabled',
                  fontWeight: 500,
                  flex: 1
                }}
              >
                {requisition.sanity_job_list_key ? 'Published' : 'Unpublished'}
              </Typography>

              {/* Toggle Switch - Only visible to HR and Recruiters */}
              {[AppRole.HeadOfHr, AppRole.HrManager, AppRole.Recruiter].includes(user?.role_name as AppRole) && (
                requisition.current_job_description_id ? (
                  <Tooltip title={requisition.sanity_job_list_key ? "Unpublish" : "Publish"}>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <Switch
                        checked={!!requisition.sanity_job_list_key}
                        disabled={publishing || unpublishing || requisition.status !== 'approved'}
                        onChange={async (e) => {
                          if (e.target.checked) {
                            // Publish
                            setPublishing(true);
                            try {
                              requisition.requisition_id && await handlePublishRequisition?.(requisition.requisition_id);
                            } finally {
                              setPublishing(false);
                            }
                          } else {
                            // Unpublish
                            setUnpublishing(true);
                            try {
                              requisition.requisition_id && await handleUnpublishRequisition?.(requisition.requisition_id, requisition.sanity_job_list_key!);
                            } finally {
                              setUnpublishing(false);
                            }
                          }
                        }}
                        color="success"
                      />
                      {(publishing || unpublishing) && (
                        <CircularProgress
                          size={24}
                          sx={{
                            color: 'success.main',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                          }}
                        />
                      )}
                    </Box>
                  </Tooltip>
                ) : (
                  <Tooltip title="Write job description first">
                    <span><Switch disabled /></span>
                  </Tooltip>
                )
              )}
            </Stack>
          </Box>


          {/* Recruiters Assigned */}
          <Box>
            <Typography variant="body2" display="block" gutterBottom>
              Recruiters Assigned
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              {assignedRecruiters.map((recruiter) => (
                <Tooltip title={recruiter.full_name} key={recruiter.user_id}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha('#155dfc', 0.1),
                        color: 'primary.main',
                        width: 32,
                        height: 32,
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: alpha('#155dfc', 0.2)
                      }}
                    >
                      {getFirstAndLastInitials(recruiter.full_name || 'Unknown')}
                    </Avatar>
                    {isEditMode && (
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: 'grey.500',
                          color: 'white',
                          '&:hover': { bgcolor: 'grey.700' },
                          width: 20,
                          height: 20,
                        }}
                        onClick={() => { if (recruiter.user_id) handleRemoveRecruiter(recruiter.user_id); }}
                        disabled={assigningRecruiters || removingRecruiterId === recruiter.user_id || user?.role_name != AppRole.HeadOfHr && user?.role_name != AppRole.HrManager}
                      >
                        {removingRecruiterId === recruiter.user_id ? <CircularProgress size={12} color="inherit" /> : <Close fontSize="inherit" />}
                      </IconButton>
                    )}
                  </Box>
                </Tooltip>
              ))}

              {isEditMode && (user?.role_name == AppRole.HeadOfHr || user?.role_name == AppRole.HrManager || user?.role_name == AppRole.Recruiter) && (
                <Tooltip title="Assign Recruiters">
                  <IconButton
                    onClick={handleRecruiterClick}
                    size="small"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      width: 32,
                      height: 32,
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>

            <Popover
              id={recruiterPopoverId}
              open={openRecruiterPopover}
              anchorEl={recruiterAnchorEl}
              onClose={handleCloseRecruiterPopover}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              PaperProps={{ sx: { width: 300, p: 0, mt: 1, borderRadius: 2 } }}
            >
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by name or email..."
                  value={recruiterSearch}
                  onChange={(e) => setRecruiterSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: isSearchingRecruiters ? (
                      <InputAdornment position="end">
                        <CircularProgress size={16} />
                      </InputAdornment>
                    ) : null
                  }}
                />
              </Box>
              <List sx={{ maxHeight: 250, overflow: 'auto', p: 0 }}>
                {recruiterSearchResults.map((recruiter) => {
                  const labelId = `checkbox-list-label-${recruiter.mail}`;
                  const isSelected = !!tempSelectedRecruiters.find(r => r.mail === recruiter.mail);
                  return (
                    <ListItem key={recruiter.mail} dense disablePadding>
                      <ListItemButton onClick={() => handleToggleRecruiter(recruiter)}>
                        <ListItemAvatar>
                          <Checkbox
                            edge="start"
                            checked={isSelected}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </ListItemAvatar>
                        <ListItemAvatar sx={{ minWidth: 40 }}>
                          <Avatar
                            sx={{
                              width: 30,
                              height: 30,
                              bgcolor: alpha('#155dfc', 0.1),
                              color: 'primary.main',
                              fontSize: '0.75rem'
                            }}>
                            {recruiter.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          id={labelId}
                          primary={recruiter.displayName}
                          secondary={recruiter.mail}
                          primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                          secondaryTypographyProps={{ fontSize: '0.75rem' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
                {recruiterSearchResults.length === 0 && !isSearchingRecruiters && recruiterSearch.length >= 2 && (
                  <ListItem>
                    <ListItemText primary="No colleagues found" sx={{ textAlign: 'center', color: 'text.secondary' }} />
                  </ListItem>
                )}
                {recruiterSearch.length < 2 && recruiterSearchResults.length === 0 && (
                  <ListItem>
                    <ListItemText primary="Type at least 2 characters to search" sx={{ textAlign: 'center', color: 'text.secondary' }} />
                  </ListItem>
                )}
              </List>
              <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary' }}>
                  {tempSelectedRecruiters.length} selected
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleAssignRecruitersAction}
                  disabled={assigningRecruiters || tempSelectedRecruiters.length === 0}
                >
                  {assigningRecruiters ? <CircularProgress size={24} color="inherit" /> : 'Confirm Selection'}
                </Button>
              </Box>
            </Popover>
          </Box>
        </Stack>
      </Box>


      {/* display the public application link in a copyable field - only if published */}
      {requisition.sanity_job_list_key && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Public Application Link
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 2,
              p: 1.5,
              px: 2,
              width: { xs: '100%', md: '60%' },
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              border: '1px dashed',
              borderColor: alpha(theme.palette.primary.main, 0.3)
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                color: 'primary.main',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mr: 2
              }}
            >
              {requisition.public_share_link || selectedRequisition?.public_share_link}
            </Typography>

            <Tooltip title={copied ? "Copied!" : "Copy Link"}>
              <IconButton
                size="small"
                onClick={handleCopyLink}
                color={copied ? "success" : "primary"}
              >
                <CopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}


    </Paper>
  );
};

export default JobPostingDetails;
