import { Box, Typography, Paper, Chip, TextField, Stack, IconButton, MenuItem, Select, Button, useTheme, Tooltip, CircularProgress, Avatar, Popover, List, ListItem, ListItemText, ListItemAvatar, Checkbox, InputAdornment, ListItemButton } from '@mui/material';
import { useState } from 'react';
import { Requisition, RequisitionPosition } from '@/interface/requisition';
import { Add, Close, Search } from '@mui/icons-material';
import { assignRecruiters } from '@/api/requisitionApi';

interface JobPostingDetailsProps {
  requisition: Partial<Requisition>;
  isEditMode?: boolean;
  handlePublishRequisition?:(requisitionId:string) => void
  handleUnpublishRequisition?: (requisitionId: string, jobListKey: string) => void
}

const MOCK_RECRUITERS = [
  { id: '1', name: 'John Doe', initials: 'JD', color: '#1976d2' },
  { id: '2', name: 'Sarah Key', initials: 'SK', color: '#2e7d32' },
  { id: '3', name: 'Liam Wilson', initials: 'LW', color: '#9c27b0' },
  { id: '4', name: 'Emma Davis', initials: 'ED', color: '#ed6c02' },
  { id: '5', name: 'James Miller', initials: 'JM', color: '#d32f2f' },
];

const JobPostingDetails = ({ requisition, isEditMode = false, handlePublishRequisition, handleUnpublishRequisition}: JobPostingDetailsProps) => {
  console.log('JobPostingDetails requisition:', requisition.positions_list);
  const theme = useTheme();
  const [locations, setLocations] = useState<{position_slot_id:string; loc: string; qty:number}[]>(requisition.positions_list || []);
  const [newLocation, setNewLocation] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);

  // Recruiter Assignment State
  const [assignedRecruiters, setAssignedRecruiters] = useState<typeof MOCK_RECRUITERS>(() => {
    // Initial state logic: map existing 'recruiter' string to mock if possible, or empty
    if (requisition.recruiter) {
        const found = MOCK_RECRUITERS.find(r => r.name === requisition.recruiter);
        return found ? [found] : [];
    }
    return [];
  });
  const [recruiterAnchorEl, setRecruiterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [recruiterSearch, setRecruiterSearch] = useState('');
  const [tempSelectedRecruiters, setTempSelectedRecruiters] = useState<string[]>([]);
  const [assigningRecruiters, setAssigningRecruiters] = useState(false);

  const handleAddLocation = () => {
     setLocations([...locations, { position_slot_id: '', qty: 0, loc: newLocation }]);
    };

  const handleRemoveLocation = (locToRemove: RequisitionPosition) => {
    setLocations(locations.filter(loc => loc.position_slot_id !== locToRemove.position_slot_id));
  };

  // Recruiter Handlers
  const handleRecruiterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTempSelectedRecruiters(assignedRecruiters.map(r => r.id));
    setRecruiterAnchorEl(event.currentTarget);
  };

  const handleCloseRecruiterPopover = () => {
    setRecruiterAnchorEl(null);
    setRecruiterSearch('');
  };

  const handleToggleRecruiter = (recruiterId: string) => {
    setTempSelectedRecruiters(prev => 
      prev.includes(recruiterId)
        ? prev.filter(id => id !== recruiterId)
        : [...prev, recruiterId]
    );
  };

  const handleAssignRecruitersAction = async () => {
    setAssigningRecruiters(true);
    try {
      const selectedObjs = MOCK_RECRUITERS.filter(r => tempSelectedRecruiters.includes(r.id));
      if (requisition.requisition_id) {
        await assignRecruiters(requisition.requisition_id, selectedObjs.map(r => r.id)); // Sending IDs
      }
      setAssignedRecruiters(selectedObjs);
      handleCloseRecruiterPopover();
    } catch (error) {
      console.error("Failed to assign recruiters", error);
    } finally {
      setAssigningRecruiters(false);
    }
  };

  const filteredRecruiters = MOCK_RECRUITERS.filter(r => 
    r.name.toLowerCase().includes(recruiterSearch.toLowerCase())
  );

  const openRecruiterPopover = Boolean(recruiterAnchorEl);
  const recruiterPopoverId = openRecruiterPopover ? 'recruiter-popover' : undefined;

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Job Posting & Publication Status
      </Typography>

      <Box sx={{ backgroundColor: 'orange', display: 'flex', flexDirection: 'row', gap: 1, alignContent: 'center' }}>
        {/* Posting Locations */}
        <Box>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Posting Locations
          </Typography>
          {isEditMode ? (
            <Box>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter location"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
                />
                <IconButton onClick={handleAddLocation} color="primary" sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, borderRadius: 1 }}>
                    <Add />
                </IconButton>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {requisition.requisition_positions?.map((loc) => (
                  <Chip
                    key={loc.position_slot_id}
                    label={loc.location}
                    onDelete={() => handleRemoveLocation(loc)}
                    color="primary"
                    variant="outlined"
                    sx={{ bgcolor: 'action.hover' }}
                  />
                ))}
              </Stack>
            </Box>
          ) : (
            <Stack direction="row" spacing={1}>
              {requisition.positions_list?.map((loc) => (
                <Chip key={loc.position_slot_id} label={loc.loc} size="small" color="primary" variant="outlined" sx={{ bgcolor: 'action.hover' }} />
              )) || <Typography variant="body2" color="text.secondary">No locations set</Typography>}
            </Stack>
          )}
        </Box>
        

        {/* Recruiter Assigned */}
        <Box>
          <Box sx={{mt: 3}}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Current publication status
            </Typography>

            <Box display="flex" alignItems="center" gap={3}>
              {
                requisition.sanity_job_list_key ? (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}
                      onClick={async () => {
                        setUnpublishing(true);
                        try {
                          console.log('Unpublish button clicked. Requisition ID:', requisition.requisition_id, 'Job List Key:', requisition.sanity_job_list_key);
                          requisition.requisition_id && await handleUnpublishRequisition?.(requisition.requisition_id, requisition.sanity_job_list_key!);
                        } finally {
                          setUnpublishing(false);
                        }
                      }}
                      disabled={unpublishing}
                  >
                    {unpublishing ? <CircularProgress size={24} color="inherit" /> : 'Unpublish'}
                  </Button>
                ) : requisition.current_job_description_id ? (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ backgroundColor: 'green', color: 'white', '&:hover': { backgroundColor: 'darkgreen' } }}
                      onClick={async () => {
                        setPublishing(true);
                        try {
                          requisition.requisition_id && await handlePublishRequisition?.(requisition.requisition_id);
                        } finally {
                          setPublishing(false);
                        }
                      }}
                      disabled={publishing}
                    >
                      {publishing ? <CircularProgress size={24} color="inherit" /> : 'Publish'}
                    </Button>
                ) : (
                  <Tooltip title="Please include job description">
                    <span>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: 'grey', color: 'white', '&:hover': { backgroundColor: 'darkgrey' } }}
                        disabled
                      >
                        Publish
                      </Button>
                    </span>
                  </Tooltip>
                )
              }
              <Typography variant="body2" color="text.secondary">
                {requisition.current_job_description_id == null ? 'Write job description first' : ''}
              </Typography>
            </Box>
          </Box>

           <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Recruiters Assigned
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {assignedRecruiters.map((recruiter) => (
              <Tooltip title={recruiter.name} key={recruiter.id}>
                <Avatar 
                  sx={{ 
                    bgcolor: recruiter.color, 
                    width: 32, 
                    height: 32, 
                    fontSize: '0.875rem' 
                  }}
                >
                  {recruiter.initials}
                </Avatar>
              </Tooltip>
            ))}
            
            {isEditMode && (
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
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: { width: 300, p: 0, mt: 1, borderRadius: 2 }
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
               <TextField
                fullWidth
                size="small"
                placeholder="Search recruiters..."
                value={recruiterSearch}
                onChange={(e) => setRecruiterSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <List sx={{ maxHeight: 200, overflow: 'auto', p: 0 }}>
              {filteredRecruiters.map((recruiter) => {
                const labelId = `checkbox-list-label-${recruiter.id}`;
                return (
                  <ListItem 
                    key={recruiter.id} 
                    dense 
                    disablePadding
                  >
                    <ListItemButton onClick={() => handleToggleRecruiter(recruiter.id)}>
                      <ListItemAvatar>
                        <Checkbox
                          edge="start"
                          checked={tempSelectedRecruiters.indexOf(recruiter.id) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemAvatar>
                      <ListItemAvatar sx={{minWidth: 40}}>
                        <Avatar sx={{ width: 30, height: 30, bgcolor: recruiter.color, fontSize: '0.75rem' }}>{recruiter.initials}</Avatar>
                      </ListItemAvatar>
                      <ListItemText id={labelId} primary={recruiter.name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
              {filteredRecruiters.length === 0 && (
                <ListItem>
                  <ListItemText primary="No recruiters found" sx={{textAlign: 'center', color: 'text.secondary'}} />
                </ListItem>
              )}
            </List>
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={handleAssignRecruitersAction}
                disabled={assigningRecruiters}
              >
                {assigningRecruiters ? <CircularProgress size={24} color="inherit" /> : 'Assign'}
              </Button>
            </Box>
          </Popover>
        </Box>

        

        
      </Box>
      
        {/* display the public application link in a copyable field */}
        <Box sx={{mt: 3, backgroundColor: '#f0fdf4', borderRadius: 2, p: 2}}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Public Application Link
          </Typography>
          <p>
            {requisition.sanity_job_list_key == null ? '' : `${requisition.public_share_link}` }
          </p>
        </Box>
    
    </Paper>
  );
};

export default JobPostingDetails;
