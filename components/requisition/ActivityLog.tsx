import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { Requisition } from '@/interface/requisition';
import { History, Person, Edit, CheckCircle } from '@mui/icons-material';

interface ActivityLogProps {
  requisition: Partial<Requisition>;
}

const ActivityLog = ({ requisition }: ActivityLogProps) => {
  const activities = requisition.activity_log || [];

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <History sx={{ mr: 1, color: 'text.secondary', transform: 'rotate(90deg)' }} /> {/* Using History as Activity icon proxy or find better */}
        <Typography variant="h6" fontWeight={500}>
          Activity Log
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {activities.map((activity, index) => (
          <ListItem key={index} alignItems="flex-start" sx={{ px: 0, py: 0, mb: 0, position: 'relative' }}>
             {/* Timeline line */}
             {index !== activities.length - 1 && (
                <Box sx={{ 
                    position: 'absolute', 
                    left: '1px', 
                    top: '24px', 
                    bottom: '-8px', 
                    width: '2px', 
                    bgcolor: 'divider' 
                }} />
             )}
             
             {/* Timeline marker */}
             <Box sx={{ 
                 width: '4px', 
                 height: '24px', 
                 bgcolor: 'text.disabled', 
                 mr: 2,
                 borderRadius: 1,
                 flexShrink: 0,
                 mt: 0.5
             }} />

            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  {activity.title}
                </Typography>
              }
              secondary={
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {activity.user} • {activity.timestamp}
                  </Typography>
                </Box>
              }
              sx={{ m: 0 }}
            />
          </ListItem>
        ))}
        {activities.length === 0 && (
            <Typography variant="body2" color="text.secondary">No activity recorded.</Typography>
        )}
      </List>
      
      <Box sx={{ mt: 'auto' }}>
          <Typography variant="button" color="primary" sx={{ cursor: 'pointer', textTransform: 'none', '&:hover': { textDecoration: 'underline' } }}>
              View all activity →
          </Typography>
      </Box>
    </Paper>
  );
};

export default ActivityLog;
