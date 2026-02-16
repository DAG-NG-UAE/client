import { Box } from "@mui/material";

export const Highlight = ({ text }: { text: string }) => (
    <Box component="span" sx={{ bgcolor: 'rgba(21, 93, 252, 0.1)', color: 'primary.main', px: 0.5, py: 0.2, borderRadius: 1, fontWeight: 'medium' }}>
        {text}
    </Box>
);
