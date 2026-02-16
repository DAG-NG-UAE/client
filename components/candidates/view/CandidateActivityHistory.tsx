import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { getCandidateActivity } from '@/api/candidate';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import HistoryIcon from '@mui/icons-material/History';
import CircleIcon from '@mui/icons-material/Circle';
import { CandidateStatusHistory } from '@/interface/candidate';

dayjs.extend(relativeTime);

interface Props {
    candidateId: string;
}



const CandidateActivityHistory: React.FC<Props> = ({ candidateId }) => {
    const [activities, setActivities] = useState<CandidateStatusHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivity = async () => {
            if (!candidateId) return;
            try {
                setLoading(true);
                const data = await getCandidateActivity(candidateId) as unknown as CandidateStatusHistory[];
                setActivities(data);
            } catch (err) {
                console.error("Failed to fetch activity", err);
                setError("Failed to load activity history.");
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [candidateId]);

    if (loading) {
        return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>;
    }

    if (error) {
        return <Box sx={{ p: 4 }}><Typography color="error">{error}</Typography></Box>;
    }

    if (!activities || activities.length === 0) {
        return (
             <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                <HistoryIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                <Typography>No activity history found.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ position: 'relative', ml: 2, borderLeft: '2px solid', borderColor: 'divider', pl: 4, pb: 2 }}>
                {activities.map((activity, index) => (
                    <Box key={activity.history_id || index} sx={{ mb: 4, position: 'relative' }}>
                        {/* Dot */}
                        <Box sx={{ 
                            position: 'absolute', 
                            left: '-39px', 
                            top: 0, 
                            bgcolor: 'background.paper', 
                            p: 0.5 
                        }}>
                             <CircleIcon color="primary" sx={{ fontSize: 16 }} />
                        </Box>

                        {/* Content */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                    {dayjs(activity.changed_date).fromNow()}
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    • {dayjs(activity.changed_date).format('MMM D, YYYY')}
                                </Typography>
                            </Box>

                            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                    {activity.new_status ? activity.new_status.replace(/_/g, ' ') : 'Status Update'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                     {activity.notes || (activity.old_status ? `Moved from ${activity.old_status.replace(/_/g, ' ')}` : 'Status updated')}
                                </Typography>
                            </Paper>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CandidateActivityHistory;
