"use client";

import { SnackbarProvider, enqueueSnackbar, useSnackbar } from 'notistack';
import React from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

// This component uses the hook to properly target the specific snackbar
const SnackbarCloseButton = ({ snackbarKey }: { snackbarKey: string | number }) => {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButton 
      onClick={() => closeSnackbar(snackbarKey)} 
      size="small" 
      sx={{ color: '#fff' }} // Force white to match your error red background
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );
};

export function NotistackProvider({ children }: { children: React.ReactNode }) {
  return (
    <SnackbarProvider 
      maxSnack={3} 
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={Slide}
      hideIconVariant
      // Use the 'action' prop here to define the button globally
      action={(key) => <SnackbarCloseButton snackbarKey={key} />}
      // This prevents default variants from adding their own close buttons
      disableWindowBlurListener
      autoHideDuration={5000}
    >
      {children}
    </SnackbarProvider>
  );
}

export { enqueueSnackbar };