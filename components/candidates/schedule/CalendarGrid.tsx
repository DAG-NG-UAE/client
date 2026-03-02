import React, { useState } from 'react';
import { Box, Typography, Stack, Avatar, Paper } from '@mui/material';
import { CheckCircle, Info } from '@mui/icons-material';
import { useSelector, useDispatch } from '@/redux/store';
import { setTimeSlot } from '@/redux/slices/schedule';
import dayjs from 'dayjs';

const getStatusColor = (value: string) => {
    switch (value) {
        case '0': return '#e8f5e9'; // Very light green (Free)
        case '2': return '#ffebee'; // Very light red (Busy)
        case '1': return '#fff3e0'; // Light orange (Tentative)
        default: return '#f5f5f5'; // Gray (Unknown)
    }
};

export const CalendarGrid = () => {
    const dispatch = useDispatch();
    const { internalInterviewers, candidate, duration, date, startTime } = useSelector((state) => state.schedule);
    const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

    const hours = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

    interface GridColumn {
        displayName: string;
        jobTitle: string;
        type: string;
        highlight?: boolean;
        avatar?: string;
        availabilityView?: string;
        email?: string;
    }

    const gridColumns: GridColumn[] = [
        ...internalInterviewers.map(int => ({ ...int, type: 'interviewer' })),
        { displayName: 'External Guest', jobTitle: 'N/A', type: 'guest' },
        { displayName: 'Candidate Slot', jobTitle: candidate?.candidate_name || 'Sarah Jenkins', type: 'candidate', highlight: true }
    ];

    const formatSlotToTime = (slot: number) => {
        const hour = Math.floor(slot / 2);
        const minute = (slot % 2) * 30;
        return dayjs().hour(hour).minute(minute).format('hh:mm A');
    };

    const isSlotPassed = (slotIndex: number) => {
        if (!date) return false;
        const slotTime = dayjs(date)
            .hour(Math.floor(slotIndex / 2))
            .minute((slotIndex % 2) * 30)
            .second(0);
        return slotTime.isBefore(dayjs());
    };

    const checkAvailability = (startSlot: number) => {
        const durationSlots = duration / 30;
        const unavailable = internalInterviewers.filter(int => {
            if (!int.availabilityView) return false; // If no data, assume they might be free for now? Or busy? 
            const view = int.availabilityView;
            for (let i = 0; i < durationSlots; i++) {
                if (view[startSlot + i] && view[startSlot + i] !== '0') return true;
            }
            return false;
        });
        return unavailable;
    };

    const getTimeSlotIndex = (timeStr: string) => {
        if (!timeStr) return 16;
        try {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours < 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            return (hours * 2) + (minutes / 30);
        } catch (e) {
            return 16;
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const slot = Math.floor(y / 50) + 16;
        setHoveredSlot(slot);
    };

    const handleMouseLeave = () => setHoveredSlot(null);

    const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const slot = Math.floor(y / 50) + 16;

        if (isSlotPassed(slot)) return;

        const unavailable = checkAvailability(slot);
        if (unavailable.length === 0 && internalInterviewers.length > 0) {
            const start = formatSlotToTime(slot);
            const end = formatSlotToTime(slot + (duration / 30));
            dispatch(setTimeSlot({ startTime: start, endTime: end }));
        }
    };

    const unavailableMembers = hoveredSlot !== null ? checkAvailability(hoveredSlot) : [];
    const isEveryoneAvailable = internalInterviewers.length > 0 && unavailableMembers.length === 0;

    const selectedSlotIndex = startTime ? getTimeSlotIndex(startTime) : null;

    return (
        <Box sx={{ flex: 1, overflowY: 'auto', position: 'relative', bgcolor: '#f8fafc' }}>
            {/* Grid Header */}
            <Box sx={{ display: 'flex', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, bgcolor: 'white', zIndex: 10, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <Box sx={{ width: 100, flexShrink: 0 }} />
                {gridColumns.map((int, idx) => (
                    <Box key={idx} sx={{ flex: 1, p: 2, borderLeft: '1px solid #f1f5f9', textAlign: 'center', bgcolor: int.highlight ? '#faf5ff' : 'white' }}>
                        <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: int.type === 'candidate' ? '#7c3aed' : '#e2e8f0',
                                    boxShadow: int.highlight ? '0 0 0 2px #d8b4fe' : 'none'
                                }}
                            >
                                {int.displayName ? int.displayName[0] : ''}
                            </Avatar>
                            <Box sx={{ textAlign: 'left' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2, color: int.type === 'candidate' ? '#5b21b6' : '#1e293b' }}>{int.displayName}</Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>{int.jobTitle}</Typography>
                            </Box>
                        </Stack>
                    </Box>
                ))}
            </Box>

            {/* Grid Content */}
            <Box sx={{ display: 'flex', position: 'relative' }}>
                {/* Time Column */}
                <Box sx={{ width: 100, flexShrink: 0, bgcolor: 'white' }}>
                    {hours.map((h, i) => (
                        <Box key={i} sx={{ height: 100, p: 2, pr: 1.5, textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>{h}</Typography>
                        </Box>
                    ))}
                </Box>

                {/* Calendar Cells */}
                <Box
                    sx={{ flex: 1, display: 'flex', position: 'relative', cursor: 'pointer' }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleGridClick}
                >
                    {gridColumns.map((int, colIdx) => (
                        <Box key={colIdx} sx={{ flex: 1, borderLeft: '1px solid #f1f5f9', position: 'relative' }}>
                            {hours.map((_, rowIdx) => {
                                const slotIndex = (8 + rowIdx) * 2;
                                const firstHalfIndex = slotIndex;
                                const secondHalfIndex = slotIndex + 1;

                                const firstHalf = int.availabilityView ? int.availabilityView[firstHalfIndex] : '0';
                                const secondHalf = int.availabilityView ? int.availabilityView[secondHalfIndex] : '0';

                                const isFirstHalfPassed = isSlotPassed(firstHalfIndex);
                                const isSecondHalfPassed = isSlotPassed(secondHalfIndex);

                                return (
                                    <Box key={rowIdx} sx={{ height: 100, borderBottom: '1px solid #f1f5f9', position: 'relative' }}>
                                        {int.type === 'interviewer' && int.availabilityView && (
                                            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 0 }}>
                                                <Box sx={{ flex: 1, bgcolor: isFirstHalfPassed ? '#f1f5f9' : getStatusColor(firstHalf) }}>
                                                    {isFirstHalfPassed && colIdx === 0 && (
                                                        <Typography variant="caption" sx={{ fontSize: 8, color: '#94a3b8', ml: 1, fontWeight: 700, mt: 0.5, display: 'block' }}>PASSED</Typography>
                                                    )}
                                                </Box>
                                                <Box sx={{ flex: 1, bgcolor: isSecondHalfPassed ? '#f1f5f9' : getStatusColor(secondHalf) }}>
                                                    {isSecondHalfPassed && colIdx === 0 && (
                                                        <Typography variant="caption" sx={{ fontSize: 8, color: '#94a3b8', ml: 1, fontWeight: 700, mt: 0.5, display: 'block' }}>PASSED</Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        )}
                                        {(isFirstHalfPassed || isSecondHalfPassed) && int.type !== 'interviewer' && (
                                            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 0 }}>
                                                <Box sx={{ flex: 1, bgcolor: isFirstHalfPassed ? '#f8fafc' : 'transparent' }} />
                                                <Box sx={{ flex: 1, bgcolor: isSecondHalfPassed ? '#f8fafc' : 'transparent' }} />
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    ))}

                    {/* Hover Overlay */}
                    {hoveredSlot !== null && !isSlotPassed(hoveredSlot) && (
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: (hoveredSlot - 16) * 50,
                                height: (duration / 30) * 50,
                                bgcolor: isEveryoneAvailable ? 'rgba(37, 99, 235, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                border: `2px solid ${isEveryoneAvailable ? '#2563eb' : '#ef4444'}`,
                                borderRadius: 1,
                                zIndex: 20,
                                pointerEvents: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.1s ease-out'
                            }}
                        >
                            <Paper
                                elevation={4}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: 'white',
                                    border: `1px solid ${isEveryoneAvailable ? '#bfdbfe' : '#fecaca'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    maxWidth: 300
                                }}
                            >
                                {isEveryoneAvailable ? (
                                    <>
                                        <CheckCircle sx={{ color: '#059669', fontSize: 20 }} />
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#065f46', display: 'block' }}>
                                                EVERYONE AVAILABLE
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>
                                                {formatSlotToTime(hoveredSlot)} - {formatSlotToTime(hoveredSlot + (duration / 30))}
                                            </Typography>
                                        </Box>
                                    </>
                                ) : (
                                    <>
                                        <Info sx={{ color: '#dc2626', fontSize: 20 }} />
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#991b1b', display: 'block' }}>
                                                CONFLICT DETECTED
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 600 }}>
                                                Unavailable: {unavailableMembers.map(m => m.displayName).join(', ')}
                                            </Typography>
                                        </Box>
                                    </>
                                )}
                            </Paper>
                        </Box>
                    )}

                    {/* Locked-in Selection */}
                    {selectedSlotIndex !== null && (
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: (selectedSlotIndex - 16) * 50,
                                height: (duration / 30) * 50,
                                bgcolor: 'rgba(124, 58, 237, 0.25)',
                                border: '2px solid #7c3aed',
                                borderRadius: 1,
                                zIndex: 15,
                                pointerEvents: 'none',
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-end',
                                p: 1
                            }}
                        >
                            <Box sx={{ bgcolor: '#7c3aed', color: 'white', px: 1, py: 0.2, borderRadius: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CheckCircle sx={{ fontSize: 12 }} />
                                <Typography variant="caption" sx={{ fontWeight: 800, fontSize: 10 }}>SELECTED SLOT</Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};
