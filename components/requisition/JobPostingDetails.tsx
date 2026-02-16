import { Box, Typography, Paper, Chip, TextField, Stack, IconButton, MenuItem, Select, Button, useTheme, Tooltip, CircularProgress, Avatar, Popover, List, ListItem, ListItemText, ListItemAvatar, Checkbox, InputAdornment, ListItemButton, Switch, FormControlLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { Requisition, RequisitionPosition, RequisitionPositionLists } from '@/interface/requisition';
import { Add, Close, Search } from '@mui/icons-material';
import { assignRecruiters } from '@/api/requisitionApi';
import { fetchRecruiters } from '@/redux/slices/user';
import { AppRole } from '@/utils/constants';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getFirstAndLastInitials } from '@/utils/transform';
import { callAssignRecruiters, callRemoveRecruiters, callAddRequisitionLocation, callUpdateRequisitionLocation, callDeleteRequisitionLocation } from '@/redux/slices/requisition';
import { Check, Edit, Close as CloseIcon } from '@mui/icons-material';

interface JobPostingDetailsProps {
  requisition: Partial<Requisition>;
  isEditMode?: boolean;
  handlePublishRequisition?:(requisitionId:string) => void
  handleUnpublishRequisition?: (requisitionId: string, jobListKey: string) => void
}


const JobPostingDetails = ({ requisition, isEditMode = false, handlePublishRequisition, handleUnpublishRequisition}: JobPostingDetailsProps) => {
  console.log(`the requisition is => ${JSON.stringify(requisition)}`)
  const theme = useTheme();
  const {recruiters} = useSelector((state: RootState) => state.users)
  const {selectedRequisition} = useSelector((state: RootState) => state.requisitions)
  const {user} = useSelector((state: RootState) => state.auth)

  const [locations, setLocations] = useState<{position_slot_id:string; loc: string; qty:number; is_active:boolean}[]>(requisition.positions_list || []);
  const [newLocation, setNewLocation] = useState('');
  const [newQuantity, setNewQuantity] = useState<number | ''>('');
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);

  useEffect(() => {
    if (requisition.positions_list) {
      setLocations(requisition.positions_list);
    }
  }, [requisition.positions_list]);

  useEffect(() => { 
    handleFetchRecruiters()
  }, [])
  
  // Recruiter Assignment State
  const [assignedRecruiters, setAssignedRecruiters] = useState<typeof recruiters>([]);

  useEffect(() => {
    if (requisition.stakeholder_names && recruiters) {
      const assigned = requisition.stakeholder_names
        .filter(stakeholder => stakeholder.role === AppRole.Recruiter)
        .map(stakeholder => {
          const foundRecruiter = recruiters.find(r => r.user_id === stakeholder.id);
          return foundRecruiter ? foundRecruiter : null;
        })
        .filter(recruiter => recruiter !== null) as typeof recruiters;
      setAssignedRecruiters(assigned);
    } else {
      setAssignedRecruiters([]);
    }
  }, [requisition.stakeholder_names, recruiters]);
  const [recruiterAnchorEl, setRecruiterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [recruiterSearch, setRecruiterSearch] = useState('');
  const [tempSelectedRecruiters, setTempSelectedRecruiters] = useState<string[]>([]);
  const [assigningRecruiters, setAssigningRecruiters] = useState(false);
  const [removingRecruiterId, setRemovingRecruiterId] = useState<string | null>(null);

  const handleAddLocation = async () => {
    if (newLocation && newQuantity && requisition.requisition_id) {
      if (editingLocationId) {
        // Edit Mode
        await callUpdateRequisitionLocation(requisition.requisition_id, editingLocationId, newLocation, Number(newQuantity));
        setEditingLocationId(null);
      } else {
        // Add Mode
        await callAddRequisitionLocation(requisition.requisition_id, newLocation, Number(newQuantity));
      }
      setNewLocation('');
      setNewQuantity('');
    }
  };

  const handleRemoveLocation = async (locToRemove: {position_slot_id: string, loc: string}) => {
    if (requisition.requisition_id) {
      await callDeleteRequisitionLocation(requisition.requisition_id, locToRemove.position_slot_id, locToRemove.loc);
    }
  };

  const handleEditLocation = (loc: {position_slot_id:string; loc: string; qty:number}) => {
    setNewLocation(loc.loc);
    setNewQuantity(loc.qty);
    setEditingLocationId(loc.position_slot_id);
  };

  const handleCancelEdit = () => {
    setNewLocation('');
    setNewQuantity('');
    setEditingLocationId(null);
  };

  // Recruiter Handlers
  const handleRecruiterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTempSelectedRecruiters(assignedRecruiters.map(r => r.user_id).filter((id): id is string => id !== undefined));
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
      const selectedObjs = recruiters.filter(r => r.user_id !== undefined && tempSelectedRecruiters.includes(r.user_id));
      console.log(`The selected recruiters are => ${JSON.stringify(selectedObjs)}`)
      
      const assignedIds = assignedRecruiters.map(r => r.user_id);
      const newRecruiters = selectedObjs.filter(r => !assignedIds.includes(r.user_id));

      const emails = newRecruiters.map(r => r.email).filter(Boolean).join(';');

      if (requisition.requisition_id) {
        await callAssignRecruiters(
            requisition.requisition_id, 
            selectedObjs.filter((r): r is {user_id: string, role_id: string, full_name: string} => r.user_id !== undefined && r.role_id !== undefined).map(r => ({userId: r.user_id, roleId: r.role_id})),
            emails
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
      const updatedAssignedRecruiters = assignedRecruiters.filter(r => r.user_id !== recruiterIdToRemove);

      console.log(`this is the updated assigned recruiter => ${JSON.stringify(updatedAssignedRecruiters)}`)
      
      const recruiterToRemove = assignedRecruiters.find(r => r.user_id === recruiterIdToRemove);
      const email = recruiterToRemove?.email || "";

       await callRemoveRecruiters(requisition.requisition_id, recruiterIdToRemove, email);
    } catch (error) {
      console.error("Failed to remove recruiter", error);
    } finally {
      setRemovingRecruiterId(null);
    }
  };

  const handleFetchRecruiters = async() => { 
    await fetchRecruiters(AppRole.Recruiter)
  }

 

  const filteredRecruiters = recruiters?.filter(r => 
    r.full_name && r.full_name.toLowerCase().includes(recruiterSearch.toLowerCase())
  );

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
          {isEditMode ? (
            <Box>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Location"
                  placeholder="Enter location"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
                <TextField
                  sx={{ width: 120 }}
                  size="small"
                  label="Headcount"
                  type="number"
                  placeholder='Qty'
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
                />
                
                {editingLocationId ? (
                   <>
                    <IconButton onClick={handleAddLocation} color="primary" sx={{ bgcolor: 'secondary.main', color: 'white', '&:hover': { bgcolor: 'secondary.dark' }, borderRadius: 1 }}>
                        <Check />
                    </IconButton>
                    <IconButton onClick={handleCancelEdit} size="small">
                        <CloseIcon />
                    </IconButton>
                   </>
                ) : (
                   <IconButton 
                      onClick={handleAddLocation} 
                      color="primary" 
                      sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, borderRadius: 1 }}
                    >
                      <Add />
                   </IconButton>
                )}
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {locations?.map((loc) => (
                  <Tooltip key={loc.position_slot_id} title={loc.is_active === false ? "This location is currently inactive/hidden" : ""}>
                    <Chip
                      label={`${loc.loc} (${loc.qty})`}
                      onDelete={() => handleRemoveLocation(loc)}
                      onClick={() => handleEditLocation(loc)}
                      variant={editingLocationId === loc.position_slot_id ? "filled" : "outlined"}
                      color={editingLocationId === loc.position_slot_id ? "primary" : "default"}
                      sx={{ 
                        opacity: loc.is_active === false ? 0.6 : 1,
                        textDecoration: loc.is_active === false ? 'line-through' : 'none',
                        bgcolor: editingLocationId === loc.position_slot_id 
                          ? 'primary.light' 
                          : loc.is_active === false 
                            ? 'action.disabledBackground' 
                            : 'action.hover' 
                      }}
                    />
                  </Tooltip>
                ))}
              </Stack>
            </Box>
          ) : (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {locations.length > 0 ? locations.map((loc) => (
                <Tooltip key={loc.position_slot_id} title={loc.is_active === false ? "Inactive/Hidden" : ""}>
                   <Chip 
                    label={`${loc.loc} (${loc.qty})`} 
                    size="small" 
                    color={loc.is_active === false ? "default" : "primary"} 
                    variant="outlined" 
                    sx={{ 
                      bgcolor: loc.is_active === false ? 'action.disabledBackground' : 'action.hover',
                      opacity: loc.is_active === false ? 0.6 : 1,
                      textDecoration: loc.is_active === false ? 'line-through' : 'none'
                     }} 
                   />
                </Tooltip>
              )) : <Typography variant="body2" color="text.secondary">No locations set</Typography>}
            </Stack>
          )}
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

                   {/* Toggle Switch */}
                {
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
                }
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
                          bgcolor: recruiter.color || 'red', 
                          width: 32, 
                          height: 32, 
                          fontSize: '0.875rem' 
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
                
                {isEditMode && (user?.role_name == AppRole.HeadOfHr || user?.role_name == AppRole.HrManager) && (
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
                  {filteredRecruiters?.map((recruiter) => {
                    const labelId = `checkbox-list-label-${recruiter.user_id}`;
                    return (
                      <ListItem key={recruiter.user_id} dense disablePadding>
                        <ListItemButton onClick={() => { if (recruiter.user_id) handleToggleRecruiter(recruiter.user_id); }}>
                          <ListItemAvatar>
                            <Checkbox
                              edge="start"
                              checked={recruiter.user_id ? tempSelectedRecruiters.indexOf(recruiter.user_id) !== -1 : false}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </ListItemAvatar>
                          <ListItemAvatar sx={{minWidth: 40}}>
                            <Avatar 
                              sx={{ width: 30, 
                              height: 30, 
                              bgcolor: recruiter.color || 'red',
                              fontSize: '0.75rem' 
                            }}>{getFirstAndLastInitials(recruiter.full_name || 'Unknown')}</Avatar>
                          </ListItemAvatar>
                          <ListItemText id={labelId} primary={recruiter.full_name} />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                  {filteredRecruiters?.length === 0 && (
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
        </Stack>
      </Box>    

      
        {/* display the public application link in a copyable field */}
        <Box>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Public Application Link
            </Typography>
          <Box sx={{display:'flex', borderRadius: 2, p: 2, width: '50%', backgroundColor:theme.palette.secondary.main}}>
            <p>
              {selectedRequisition?.sanity_job_list_key == null ? '' : `${selectedRequisition?.public_share_link}` }
            </p>
          </Box>
        </Box>
        
    
    </Paper>
  );
};

export default JobPostingDetails;
