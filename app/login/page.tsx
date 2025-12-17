"use client";
import React from 'react';
import { Box, Typography, Card, CardContent, Button, SvgIcon, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work'; // Using WorkIcon as a placeholder for the logo
import { useAppSelector } from '@/store/hooks';

// Custom icon for Microsoft
const MicrosoftIcon = (props: any) => (
  <SvgIcon {...props}>
    <path d="M11.999 6.25H5.999V11.75H11.999V6.25Z" fill="#F25022" />
    <path d="M18.001 6.25H12.501V11.75H18.001V6.25Z" fill="#7FBA00" />
    <path d="M11.999 12.25H5.999V17.75H11.999V12.25Z" fill="#00A4EF" />
    <path d="M18.001 12.25H12.501V17.75H18.001V12.25Z" fill="#FFB900" />
  </SvgIcon>
);

const LoginPage = () => {
  const theme = useTheme();
  const { loading } = useAppSelector((state) => state.auth);

  const handleMicrosoftSignIn = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/auth/login`;
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.palette.loginBackground, // Use the new theme color
      p: 2,
    }}>
      <Card sx={{
        maxWidth: 500,
        width: '100%',
        // p: 4,
        textAlign: 'center',
        boxShadow: theme.shadows[3],
      }}>
        <CardContent>
          <Box sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}>
            <WorkIcon sx={{ fontSize: 32, color: theme.palette.primary.contrastText }} />
          </Box>
          <Typography variant="h5" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
            HR Portal
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to manage your <Box component="span" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>requisitions</Box>
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<MicrosoftIcon sx={{ fontSize: 20 }} />}
            sx={{ mb: 2, py: 1.5, borderColor: theme.palette.divider, color: theme.palette.text.primary }}
            onClick={handleMicrosoftSignIn} // Add this handler
          >
            {loading ? 'Logging in...' : 'Sign In With Microsoft'}
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4, mb: 1, textTransform: 'uppercase' }}>
            HR Manager Access Only
          </Typography>

          <Typography variant="body2" color="text.secondary">
            By signing in, you agree to our <Link href="#" underline="hover">Terms of Service</Link> and <Link href="#" underline="hover">Privacy Policy</Link>
          </Typography>
        </CardContent>
      </Card>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: theme.palette.primary.contrastText }}>
          Need help? Contact IT Support at <Link href="mailto:support@company.com" underline="hover" sx={{ color: theme.palette.primary.contrastText }}>support@company.com</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
