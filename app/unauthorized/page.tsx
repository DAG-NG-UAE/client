"use client";

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const UnauthorizedPage = () => {
    const router = useRouter();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Unauthorized Access
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                You do not have permission to view this page.
            </Typography>
            <Button variant="contained" onClick={() => router.back()}>
                Go Back
            </Button>
        </Box>
    );
};

export default UnauthorizedPage;
