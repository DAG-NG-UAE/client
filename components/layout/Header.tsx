import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

interface HeaderProps {
  handleDrawerToggle: () => void;
}

const Header = ({ handleDrawerToggle }: HeaderProps) => {
  const theme = useTheme();
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        // boxShadow: 'none',
        // borderBottom: `1px solid ${theme.palette.divider}`,
        // backgroundColor: theme.palette.background.default,
        // color: theme.palette.text.primary,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        {/* The title will be handled by the specific pages or context */}
        {/* <Typography variant="h6" noWrap component="div">
          Page Title
        </Typography> */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
