import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Box } from '@mui/material';

export const RecommendationBadge = ({ type }: { type: string }) => {
    let color = 'default';
    let icon = <RemoveCircleIcon fontSize="small" />;
    let bgcolor = '#f5f5f5';
    let textColor = 'text.secondary';

    if (type === 'Strong Hire') {
        color = 'success';
        icon = <ThumbUpIcon fontSize="small" />;
        bgcolor = '#EDF7ED';
        textColor = '#1E4620';
    } else if (type === 'Hire') {
        color = 'primary';
        icon = <CheckCircleIcon fontSize="small" />;
        bgcolor = '#E3F2FD';
        textColor = '#0D47A1';
    } else if (type === 'No Hire') {
        color = 'error';
        icon = <ThumbDownIcon fontSize="small" />;
        bgcolor = '#FFEBEE';
        textColor = '#B71C1C';
    }

    return (
        <Box sx={{ 
            display: 'flex', alignItems: 'center', gap: 1, 
            bgcolor: bgcolor, color: textColor,
            px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 600, fontSize: '0.875rem'
        }}>
            {icon}
            {type}
        </Box>
    );
};