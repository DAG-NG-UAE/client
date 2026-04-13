"use client";

import { Box, Button, Typography, Paper, Stack, alpha } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTheme } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { logoutUser } from "@/redux/slices/auth";
import { formatRoleName } from "@/utils/transform";

const UnauthorizedPage = () => {
    const router = useRouter();
    const theme = useTheme();
    const { user } = useSelector((state: RootState) => state.auth);

    const firstName = user?.full_name?.split(' ')[0] ?? 'there';

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: theme.palette.background.default,
                p: 3,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    maxWidth: 460,
                    width: '100%',
                    p: 5,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: 'center',
                }}
            >
                {/* Icon */}
                <Box
                    sx={{
                        width: 64, height: 64, borderRadius: '50%',
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 3,
                    }}
                >
                    <LockOutlinedIcon sx={{ fontSize: 30, color: theme.palette.warning.main }} />
                </Box>

                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                    Hey {firstName}, you're in the wrong room
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.7 }}>
                    Your account doesn't have access to this page.
                </Typography>

                {user?.role_name && (
                    <Box
                        sx={{
                            display: 'inline-flex', alignItems: 'center', gap: 1,
                            px: 2, py: 0.75, borderRadius: 10,
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            mb: 3,
                        }}
                    >
                        <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                            Logged in as: {formatRoleName(user.role_name)}
                        </Typography>
                    </Box>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    If you think this is a mistake, reach out to{' '}
                    <a href="mailto:isabella.k@bajajnigeria.com" style={{ color: 'inherit', fontWeight: 600 }}>
                        isabella.k@bajajnigeria.com
                    </a>{' '}
                    to get the right permissions.
                </Typography>

                <Stack spacing={1.5}>
                    <Button
                        variant="contained"
                        startIcon={<LogoutIcon />}
                        onClick={() => logoutUser()}
                        fullWidth
                        sx={{ borderRadius: 2, fontWeight: 600, py: 1.2 }}
                    >
                        Sign out
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default UnauthorizedPage;
