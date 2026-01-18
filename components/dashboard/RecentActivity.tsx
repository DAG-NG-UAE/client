import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Divider,
  CircularProgress
} from '@mui/material';
import { Work as WorkIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import axiosInstance from '@/api/axiosInstance';
import { Activity, ActivityType } from '@/interface/activity';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getRecentActivity } from '@/api/analytics';

dayjs.extend(relativeTime);

const formatActivityType = (type: string) => {
    return type
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
};

const RecentActivity = () => {
    const theme = useTheme();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                // Assuming the endpoint based on common patterns and response message
                const response = await getRecentActivity();
                setActivities(response);
            } catch (error) {
                console.error("Failed to fetch activities", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    return (
        <Paper 
             elevation={0}
             sx={{ 
               p: 3, 
               borderRadius: 3, 
               border: `1px solid ${theme.palette.divider}`,
               height: '100%',
               display: 'flex',
               flexDirection: 'column'
             }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>Recent Activity</Typography>
              {/* <Typography component="span" variant="caption" color="primary" sx={{ cursor: 'pointer', fontWeight: 600 }}>View All</Typography> */}
            </Box>
            
            <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                {activities.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No recent activity</Typography>
                ) : (
                    <List sx={{ px: 0 }}>
                    {activities.map((activity, index) => (
                        <React.Fragment key={activity.activity_id}>
                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                            <ListItemAvatar>
                            <Avatar sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.main, width: 32, height: 32, fontSize: '0.875rem' }}>
                                <WorkIcon fontSize="small" />
                            </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                            primary={
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {activity.triggered_by_name}
                                </Typography>
                            }
                            secondary={
                                <React.Fragment>
                                <Typography
                                    component="span"
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {formatActivityType(activity.triggered_action)}
                                </Typography>
                                <Typography component="span" variant="caption" color="text.primary" fontWeight={500}>
                                    {" " + activity.target_name}
                                </Typography>
                                <Typography display="block" variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                                    {dayjs(activity.triggered_at).fromNow()}
                                </Typography>
                                </React.Fragment>
                            }
                            />
                        </ListItem>
                        {index < activities.length - 1 && <Divider component="li" variant="inset" />}
                        </React.Fragment>
                    ))}
                    </List>
                )}
            </Box>
          </Paper>
    );
};

export default RecentActivity;
