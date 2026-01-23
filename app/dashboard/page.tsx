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
  Paper,
  IconButton,
  Skeleton,
  Alert,
  LinearProgress
} from '@mui/material';
import { useTheme, keyframes } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { 
  Work as WorkIcon, 
  Group as GroupIcon, 
  CheckCircle as CheckCircleIcon, 
  Schedule as ScheduleIcon, 
  Send as SendIcon, 
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,

} from '@mui/icons-material';
import { getRequisitions } from '../../api/requisitionApi';
import withAuth from '@/components/auth/withAuth';
import { AppRole } from '@/utils/constants';
import useSWR from 'swr';
import axiosInstance from '@/api/axiosInstance';


import RecentActivity from '@/components/dashboard/RecentActivity';



// --- Components ---

const blinkAnimation = keyframes`
  0% { 
    background-color: transparent; 
  }
  50% { 
    background-color: rgba(255, 0, 0, 0.1); /* Subtle red tint */
    border-color: #ff0000;                /* Optional: make the border red too */
  }
  100% { 
    background-color: transparent; 
  }
`;

const KPICard = ({ title, value, icon, color, trend, blink, onClick }: { title: string, value: string | number, icon: React.ReactNode, color: string, trend?: string, blink?: boolean, onClick?: () => void }) => {
  const theme = useTheme();
  return (
    <Card 
      elevation={0}
      onClick={onClick}
      sx={{ 
        height: '100%', 
        borderRadius: 3, 
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper, 
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        animation: blink ? `${blinkAnimation} 1.5s infinite ease-in-out` : 'none',
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

const FunnelChart = ({ funnelChartData }: { funnelChartData: { label: string; value: number | string }[] }) => {
  const colors = ['#3f51b5', '#2196f3', '#00bcd4', '#4caf50', '#8bc34a'];
  
  const processedData = funnelChartData.map((item, index) => ({
    ...item,
    value: Number(item.value) || 0,
    color: colors[index % colors.length]
  }));

  const maxCount = Math.max(...processedData.map(d => d.value)) || 1;
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      {processedData.map((item, index) => (
        <Box key={item.label} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 100 }}>
            <Typography variant="body2" fontWeight={600} color="text.secondary">{item.label}</Typography>
          </Box>
          <Box sx={{ flex: 1, mx: 2 }}>
            <Box 
              sx={{ 
                height: 32, 
                borderRadius: 2, 
                width: `${(item.value / maxCount) * 100}%`,
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
          <Typography variant="body2" fontWeight="bold">{item.value}</Typography>
        </Box>
      ))}
    </Box>
  );
};

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data.data)
const DashboardPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const { data, error, isLoading } = useSWR('/analytics/dashboard/stats', fetcher)

  if (isLoading) return <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />;
  if (error) return <Alert severity="error">Failed to load dashboard data</Alert>;

  const funnelBase = data?.funnel_applied || 1; // Avoid division by zero

  console.log(`the data is ${JSON.stringify(data)}`)
  const funnelStages = [
    { label: 'Applied', value: data.funnel_applied },
    { label: 'Shortlisted', value: data.funnel_shortlisted },
    { label: 'Offered', value: data.funnel_offered },
    { label: 'Hired', value: data.funnel_hired },
  ];

  console.log(`the funnel stages are ${JSON.stringify(funnelStages)}`)


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
            value={data?.active_requisitions || 0}
            icon={<WorkIcon />} 
            color={theme.palette.primary.main} 
            trend={data?.daily_requisition_request > 0 ? `+${data?.daily_requisition_request} New` : ""}
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }, minWidth: 0 }}>
          <KPICard 
            title="Total Candidates" 
            value={data?.total_candidates || 0 } 
            icon={ <GroupIcon />} 
            color="#9c27b0" 
            trend={data?.daily_candidates > 0 ? `+${data?.daily_candidates} New` : ""}
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }, minWidth: 0 }}>
          <KPICard 
            title="Filled This Month" 
            value={data.filled_this_month || 0} 
            icon={<CheckCircleIcon />} 
            color="#2e7d32"
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }, minWidth: 0 }}>
          <KPICard 
            title="Pe. Interviews" 
            value={data?.pending_feedback || 0} 
            icon={<ScheduleIcon />} 
            color="#ed6c02"
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }, minWidth: 0 }}>
          <KPICard 
            title="Offers Sent" 
            value={data.funnel_offered || 0} 
            icon={<SendIcon />} 
            color="#009688"
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }, minWidth: 0 }}>
          <KPICard 
            title="Offer Revision" 
            value={data?.revise_offers || 0} 
            icon={<ScheduleIcon />} 
            color="#ed6c02"
            blink={(data?.revise_offers || 0) > 0}
            onClick={() => router.push('/offers/revision_requested')}
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }, minWidth: 0 }}>
          <KPICard 
            title="Avg Day(s) to Hire" 
            value={data?.avg_time_to_fill || 0} 
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
            <FunnelChart funnelChartData={funnelStages}/>
            
            {/* <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50' }} />
                 <Typography variant="caption" color="text.secondary">Offers Accepted (62%)</Typography>
              </Box>
            </Box> */}
          </Paper>
        </Box>

        {/* Recent Activity */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
             <RecentActivity />
        </Box>
      </Box>
    </Box>
  );
};

export default withAuth(DashboardPage, [AppRole.Admin, AppRole.HeadOfHr, AppRole.HrManager]);
