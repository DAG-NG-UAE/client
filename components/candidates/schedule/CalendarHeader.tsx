"use client";

import React from 'react';
import { Box, Typography, Stack, IconButton, Button } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Settings } from '@mui/icons-material';
import { useSelector } from '@/redux/store';
import dayjs from 'dayjs';

export const CalendarHeader = () => {
    const { date } = useSelector((state) => state.schedule);

    // Format the date for the display
    const displayDate = dayjs(date).format('dddd, MMMM D, YYYY');

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5, borderBottom: '1px solid #f1f5f9', bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                    {displayDate}
                </Typography>
                <Stack direction="row" spacing={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                    <IconButton size="small" sx={{ borderRadius: 0, borderRight: '1px solid #e2e8f0', px: 1 }}><ArrowBackIos sx={{ fontSize: 12 }} /></IconButton>
                    <Button size="small" sx={{ textTransform: 'none', color: '#1e293b', fontWeight: 700, px: 2, borderRight: '1px solid #e2e8f0', borderRadius: 0, bgcolor: '#f8fafc' }}>Today</Button>
                    <IconButton size="small" sx={{ borderRadius: 0, px: 1 }}><ArrowForwardIos sx={{ fontSize: 12 }} /></IconButton>
                </Stack>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Timezone: <span style={{ color: '#64748b' }}>(GMT-07:00) Pacific Time</span></Typography>
                <IconButton size="small" sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}><Settings sx={{ fontSize: 18, color: '#64748b' }} /></IconButton>
            </Box>
        </Box>
    );
};
