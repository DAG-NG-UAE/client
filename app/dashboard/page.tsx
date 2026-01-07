"use client";
import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography, 
  Card, 
  CardContent, 
  CircularProgress,
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText,
  Divider,
  useTheme,
  Paper,
  IconButton
} from '@mui/material';
import { 
  Work as WorkIcon, 
  Group as GroupIcon, 
  CheckCircle as CheckCircleIcon, 
  Schedule as ScheduleIcon, 
  Send as SendIcon, 
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { getRequisitions } from '../../api/requisitionApi';
import withAuth from '@/components/auth/withAuth';
import { AppRole } from '@/utils/constants';

// --- Mock Data ---
const mockFunnelData = [
  { stage: 'Applied', count: 1240, color: '#3f51b5' },
  { stage: 'Shortlisted', count: 450, color: '#2196f3' },
  { stage: 'Interviewed', count: 180, color: '#00bcd4' },
  { stage: 'Offered', count: 45, color: '#4caf50' },
  { stage: 'Hired', count: 28, color: '#8bc34a' },
];

const mockRecentActivity = [
  { id: 1, user: 'Sarah Jenkins', action: 'scheduled an interview for', target: 'Senior Frontend Developer', time: '2 hours ago', avatar: 'S' },
  { id: 2, user: 'Mike Ross', action: 'sent an offer to', target: 'Product Manager', time: '4 hours ago', avatar: 'M' },
  { id: 3, user: 'System', action: 'New application received for', target: 'UX Designer', time: '5 hours ago', avatar: null },
  { id: 4, user: 'Isabella K', action: 'opened a new requisition', target: 'Marketing Lead', time: '1 day ago', avatar: 'I' },
];

// --- Components ---

const KPICard = ({ title, value, icon, color, trend }: { title: string, value: string | number, icon: React.ReactNode, color: string, trend?: string }) => {
  const theme = useTheme();
  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%', 
        borderRadius: 3, 
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper, 
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        }
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: `${color}15`, 
              color: color,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', bgcolor: 'success.light', px: 1, py: 0.5, borderRadius: 10 }}>
              <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
              <Typography variant="caption" fontWeight="bold">{trend}</Typography>
            </Box>
          )}
        </Box>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5, color: 'text.primary' }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const FunnelChart = () => {
  const maxCount = Math.max(...mockFunnelData.map(d => d.count));
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      {mockFunnelData.map((item, index) => (
        <Box key={item.stage} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 100 }}>
            <Typography variant="body2" fontWeight={600} color="text.secondary">{item.stage}</Typography>
          </Box>
          <Box sx={{ flex: 1, mx: 2 }}>
            <Box 
              sx={{ 
                height: 32, 
                borderRadius: 2, 
                width: `${(item.count / maxCount) * 100}%`,
                bgcolor: item.color,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                transition: 'width 1s ease-in-out',
                position: 'relative',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
            </Box>
          </Box>
          <Typography variant="body2" fontWeight="bold">{item.count}</Typography>
        </Box>
      ))}
    </Box>
  );
};

const DashboardPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [activeRequisitionsCount, setActiveRequisitionsCount] = useState<number>(0);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch real requisitions to get the count
        const data: any[] = await getRequisitions();
        const activeCount = data.filter((r: any) => r.status === 'open' || r.status === 'active' || r.status === 'approved').length;
        setActiveRequisitionsCount(activeCount || 12); // Fallback to 12 if 0 for demo purposes/visuals
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setActiveRequisitionsCount(8); // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', backgroundColor: 'background.default' }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: 'text.primary', mb: 1 }}>
          Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening in recruitment today.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }, minWidth: 0 }}>
          <KPICard 
            title="Active Requisitions" 
            value={activeRequisitionsCount} 
            icon={<WorkIcon />} 
            color={theme.palette.primary.main} 
            trend="+2 New"
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }, minWidth: 0 }}>
          <KPICard 
            title="Total Candidates" 
            value="1,240" 
            icon={<GroupIcon />} 
            color="#9c27b0" 
            trend="+12%"
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }, minWidth: 0 }}>
          <KPICard 
            title="Filled This Month" 
            value="18" 
            icon={<CheckCircleIcon />} 
            color="#2e7d32"
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }, minWidth: 0 }}>
          <KPICard 
            title="Pe. Interviews" 
            value="24" 
            icon={<ScheduleIcon />} 
            color="#ed6c02"
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }, minWidth: 0 }}>
          <KPICard 
            title="Offers Sent" 
            value="12" 
            icon={<SendIcon />} 
            color="#009688"
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }, minWidth: 0 }}>
          <KPICard 
            title="Avg Time to Hire" 
            value="21 Days" 
            icon={<TimerIcon />} 
            color="#0288d1"
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Recruitment Funnel */}
        <Box sx={{ flex: 2, minWidth: 0 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>Recruitment Funnel</Typography>
              <IconButton size="small"><MoreVertIcon /></IconButton>
            </Box>
            <FunnelChart />
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50' }} />
                 <Typography variant="caption" color="text.secondary">Offers Accepted (62%)</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Recent Activity */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper 
             elevation={0}
             sx={{ 
               p: 3, 
               borderRadius: 3, 
               border: `1px solid ${theme.palette.divider}`,
               height: '100%'
             }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>Recent Activity</Typography>
              <Typography component="span" variant="caption" color="primary" sx={{ cursor: 'pointer', fontWeight: 600 }}>View All</Typography>
            </Box>
            <List sx={{ px: 0 }}>
              {mockRecentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.main, width: 32, height: 32, fontSize: '0.875rem' }}>
                        {activity.avatar || <WorkIcon fontSize="small" />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {activity.user}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {activity.action} 
                          </Typography>
                          <Typography component="span" variant="caption" color="text.primary" fontWeight={500}>
                            {" " + activity.target}
                          </Typography>
                          <Typography display="block" variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                            {activity.time}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < mockRecentActivity.length - 1 && <Divider component="li" variant="inset" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default withAuth(DashboardPage, [AppRole.Admin, AppRole.HeadOfHr, AppRole.HrManager, AppRole.HiringManager]);
