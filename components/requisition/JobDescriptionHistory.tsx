import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { History } from '@mui/icons-material';

interface JobDescriptionHistoryProps {
  // In a real app, this would take a history array
}

const JobDescriptionHistory = () => {
  // Mock data matching the design
  const history = [
    { version: 'Version 2', user: 'John Doe (HR Manager)', date: 'Nov 16, 2025, 11:30 AM' },
    { version: 'Version 1', user: 'Sarah Chen (Hiring Manager)', date: 'Nov 15, 2025, 03:20 PM' },
  ];

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <History sx={{ mr: 1, color: 'text.secondary' }} />
        <Typography variant="h6" fontWeight={500}>
          Job Description History
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {history.map((item, index) => (
          <ListItem key={index} alignItems="flex-start" sx={{ px: 0, py: 0, mb: 3 }}>
            <Box sx={{ 
                width: '3px', 
                bgcolor: 'primary.main', 
                alignSelf: 'stretch', 
                mr: 2,
                borderRadius: 1
            }} />
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  {item.version}
                </Typography>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary" display="block">
                    {item.user}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.date}
                  </Typography>
                </Box>
              }
              sx={{ ListItemTextProps: { component: 'div' }}}
            />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ mt: 'auto' }}>
          <Typography variant="button" color="primary" sx={{ cursor: 'pointer', textTransform: 'none', '&:hover': { textDecoration: 'underline' } }}>
              View all versions →
          </Typography>
      </Box>
    </Paper>
  );
};

export default JobDescriptionHistory;
