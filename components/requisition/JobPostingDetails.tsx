import { Box, Typography, Paper, Chip, TextField, Stack, IconButton, MenuItem, Select, Button, useTheme } from '@mui/material';
import { Requisition, RequisitionPosition } from '@/interface/requisition';
import { Add, Close } from '@mui/icons-material';
import { useState } from 'react';
import { publishRequisition } from '@/api/requisitionApi';

interface JobPostingDetailsProps {
  requisition: Partial<Requisition>;
  isEditMode?: boolean;
  handlePublishRequisition?:(requisitionId:string) => void
}

const JobPostingDetails = ({ requisition, isEditMode = false, handlePublishRequisition}: JobPostingDetailsProps) => {
  console.log('JobPostingDetails requisition:', requisition.requisition_positions);
  const theme = useTheme();
  const [locations, setLocations] = useState<RequisitionPosition[]>(requisition.requisition_positions || []);
  const [newLocation, setNewLocation] = useState('');

  const handleAddLocation = () => {
     setLocations([...locations, { position_slot_id: '', slot_number: 0, location: newLocation }]);
    };

  const handleRemoveLocation = (locToRemove: RequisitionPosition) => {
    setLocations(locations.filter(loc => loc.position_slot_id !== locToRemove.position_slot_id));
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Job Posting & Publication Status
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, justifyContent: 'space-between' }}>
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
                  placeholder="Enter location and press Add"
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
              {requisition.requisition_positions?.map((loc) => (
                <Chip key={loc.position_slot_id} label={loc.location} size="small" color="primary" variant="outlined" sx={{ bgcolor: 'action.hover' }} />
              )) || <Typography variant="body2" color="text.secondary">No locations set</Typography>}
            </Stack>
          )}
        </Box>
        

        {/* Recruiter Assigned */}
        <Box>
           <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Recruiter Assigned
          </Typography>
          {isEditMode ? (
             <Select
                fullWidth
                size="small"
                defaultValue={requisition.recruiter || ''}
                displayEmpty
             >
                 <MenuItem value="" disabled>Select Recruiter</MenuItem>
                 <MenuItem value="John Smith">John Smith</MenuItem>
                 <MenuItem value="Sarah Chen">Sarah Chen</MenuItem>
             </Select>
          ) : (
            <Typography variant="body1">{requisition.recruiter || '-'}</Typography>
          )}
        </Box>

        

        
      </Box>
      <Box sx={{mt: 3}}>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          Current publication status
        </Typography>

        <Box display="flex" alignItems="center" gap={3}>
          <Button //TODO change the color of the button from being blue idk why it is blue
            variant="contained" 
            size="small" 
            sx={{color: requisition.current_job_description_id == null ? theme.palette.success.main : theme.palette.error.main}}
            onClick={() => requisition.requisition_id && handlePublishRequisition?.(requisition.requisition_id)}
          >
            {requisition.published == false ? 'Publish' : 'Unpublish'}
          </Button>
          <Typography variant="body2" color="text.secondary">
            {requisition.current_job_description_id == null ? 'Write job description first' : ''}
          </Typography>
        </Box>
        {/* display the public application link in a copyable field */}
        <Box sx={{mt: 3, backgroundColor: '#f0fdf4', borderRadius: 2, p: 2}}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Public Application Link
          </Typography>
          <p>
            {requisition.public_share_link == null ? '' : `${requisition.public_share_link}` }
          </p>
        </Box>
      </Box>
    </Paper>
  );
};

export default JobPostingDetails;
