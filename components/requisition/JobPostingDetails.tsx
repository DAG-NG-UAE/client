import { Box, Typography, Paper, Chip, TextField, Stack, IconButton, MenuItem, Select, Button, useTheme } from '@mui/material';
import { Requisition } from '@/interface/requisition';
import { Add, Close } from '@mui/icons-material';
import { useState } from 'react';

interface JobPostingDetailsProps {
  requisition: Partial<Requisition>;
  isEditMode?: boolean;
}

const JobPostingDetails = ({ requisition, isEditMode = false }: JobPostingDetailsProps) => {
  const theme = useTheme();
  const [locations, setLocations] = useState<string[]>(requisition.posting_locations || []);
  const [newLocation, setNewLocation] = useState('');

  const handleAddLocation = () => {
    if (newLocation && !locations.includes(newLocation)) {
      setLocations([...locations, newLocation]);
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (locToRemove: string) => {
    setLocations(locations.filter(loc => loc !== locToRemove));
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
                {locations.map((loc) => (
                  <Chip
                    key={loc}
                    label={loc}
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
              {requisition.posting_locations?.map((loc) => (
                <Chip key={loc} label={loc} size="small" color="primary" variant="outlined" sx={{ bgcolor: 'action.hover' }} />
              )) || <Typography variant="body2" color="text.secondary">No locations set</Typography>}
            </Stack>
          )}
        </Box>
        {/* External Job Title
        <Box>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            External Job Title (Shown to candidates)
          </Typography>
          {isEditMode ? (
            <TextField
              fullWidth
              size="small"
              defaultValue={requisition.position} // Assuming position is external title for now
              placeholder="e.g. Senior Frontend Engineer"
            />
          ) : (
             <Typography variant="body1">{requisition.position}</Typography>
          )}
        </Box> */}

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
          Current publisication status
        </Typography>

        <Box display="flex" alignItems="center" gap={3}>
          <Button //TODO change the color of the button from being blue idk why it is blue
            variant="contained" 
            size="small" 
            sx={{color: requisition.current_job_description_id == null ? theme.palette.success.main : theme.palette.error.main}}
          >
            {requisition.current_job_description_id == null ? 'Publish' : 'Unpublish'}
          </Button>
          <Typography variant="body2" color="text.secondary">
            {requisition.current_job_description_id == null ? 'Write job description first' : 'Publish to careers page'}
          </Typography>
        </Box>
        {/* display the public application link in a copyable field */}
        <Box sx={{mt: 3, backgroundColor: '#f0fdf4', borderRadius: 2, p: 2}}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Public Application Link
          </Typography>
          <p>
            {requisition.current_job_description_id == null ? '' : `https://careers.page/${requisition.current_job_description_id}`}
          </p>
        </Box>
      </Box>
    </Paper>
  );
};

export default JobPostingDetails;
