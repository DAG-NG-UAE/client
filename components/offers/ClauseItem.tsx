import { AddCircleOutline } from "@mui/icons-material";
import { Box, IconButton, Paper, Typography, Checkbox } from "@mui/material";

export const ClauseItem = ({ title, description, onAdd, isSelected }: { title: string, description: string, onAdd?: () => void, isSelected?: boolean }) => (
    <Paper 
      variant="outlined" 
      sx={{ 
          p: 1.5, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          cursor: 'pointer',
          '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover'
          }
      }}
      onClick={onAdd} // Make the whole checking clickable for better UX if desired, or keep it on button
    >
        <Box sx={{ display: 'flex', gap: 1 }}>
            <Checkbox 
                checked={!!isSelected} 
                size="small" 
                readOnly 
                sx={{ p: 0, mt: 0.5, alignSelf: 'flex-start', color: 'text.disabled', '&.Mui-checked': { color: 'primary.main' } }} 
            />
            <Box>
                <Typography variant="subtitle2" fontWeight="bold">{title}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
                    {description}
                </Typography>
            </Box>
        </Box>
        <IconButton size="small" color="primary" onClick={(e) => {
             e.stopPropagation();
             onAdd && onAdd();
        }}>
            <AddCircleOutline fontSize="small" sx={{ visibility: isSelected ? 'hidden' : 'visible' }} /> {/* Hide add button if selected? Or keep it? User implies checkmark is the feedback. */}
        </IconButton>
    </Paper>
);