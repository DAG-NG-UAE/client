"use client";
import React from 'react';
import { Box, Typography, Card, CardContent, Button, SvgIcon, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work'; // Using WorkIcon as a placeholder for the logo
import { useRouter } from 'next/navigation';

// Custom icon for Microsoft
const MicrosoftIcon = (props: any) => (
  <SvgIcon {...props}>
    <path d="M11.999 6.25H5.999V11.75H11.999V6.25Z" fill="#F25022" />
    <path d="M18.001 6.25H12.501V11.75H18.001V6.25Z" fill="#7FBA00" />
    <path d="M11.999 12.25H5.999V17.75H11.999V12.25Z" fill="#00A4EF" />
    <path d="M18.001 12.25H12.501V17.75H18.001V12.25Z" fill="#FFB900" />
  </SvgIcon>
);

// Custom icon for Google
const GoogleIcon = (props: any) => (
  <SvgIcon {...props}>
    <path d="M22.449 12.276C22.449 11.592 22.385 10.941 22.274 10.311H11.458V14.544H17.587C17.301 16.035 16.486 17.291 15.321 18.118L15.309 18.204L18.841 20.916L19.065 20.932C21.282 18.917 22.449 15.939 22.449 12.276Z" fill="#4285F4" />
    <path d="M11.458 22.999C14.475 22.999 17.009 22.019 18.841 20.932L15.321 18.118C14.354 18.784 13.013 19.222 11.458 19.222C8.636 19.222 6.208 17.323 5.344 14.821L5.228 14.83L1.583 17.712L1.545 17.842C3.327 21.316 7.07 22.999 11.458 22.999Z" fill="#34A853" />
    <path d="M5.344 14.821C5.127 14.191 5 13.513 5 12.793C5 12.073 5.127 11.395 5.344 10.765L5.324 10.658L1.624 7.749L1.583 7.842C0.575 9.876 0 12.24 0 12.793C0 13.346 0.575 15.71 1.583 17.744L5.344 14.821Z" fill="#FBBC05" />
    <path d="M11.458 6.545C13.197 6.545 14.576 7.245 15.421 8.033L18.991 4.545C17.009 2.659 14.475 1.792 11.458 1.792C7.07 1.792 3.327 3.475 1.545 6.949L5.289 9.831L5.344 10.765C6.208 8.263 8.636 6.545 11.458 6.545Z" fill="#EA4335" />
  </SvgIcon>
);

const LoginPage = () => {
  const theme = useTheme();
  const router = useRouter();

  const handleMicrosoftSignIn = () => {
    // In a real application, this would trigger an authentication flow (e.g., OAuth2)
    // For now, we'll just navigate to the dashboard
    router.push('/dashboard');
  };

  const handleGoogleSignIn = () => {
    // In a real application, this would trigger an authentication flow
    // For now, it will do nothing or show a message
    console.log('Google Sign-in clicked');
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
            Sign in with Microsoft
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon sx={{ fontSize: 20 }} />}
            sx={{ py: 1.5, borderColor: theme.palette.divider, color: theme.palette.text.primary }}
            onClick={handleGoogleSignIn} // Add this handler
          >
            Sign in with Google
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
