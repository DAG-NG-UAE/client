import { AddCircleOutline, DragIndicator } from "@mui/icons-material";
import { Box, IconButton, Paper, Typography } from "@mui/material";

export const ClauseItem = ({ title, description, onAdd }: { title: string, description: string, onAdd?: () => void }) => (
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
    >
        <Box sx={{ display: 'flex', gap: 1 }}>
            <DragIndicator fontSize="small" sx={{ color: 'text.disabled', mt: 0.5 }} />
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
            <AddCircleOutline fontSize="small" />
        </IconButton>
    </Paper>
);