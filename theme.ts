import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Define common design tokens from tailwindstyle.css
const typography = {
  fontFamily: '"Geist Sans", sans-serif',
  h1: {
    fontSize: '2rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  h2: {
    fontSize: '1.75rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  button: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
    textTransform: 'none',
  },
};

const shape = {
  borderRadius: 10, // Corresponds to --radius: 0.625rem which is 10px
};

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette
          primary: {
            main: '#155dfc', // Selected item on sidebar, also new primary for theme
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#E9EAF0', // oklch(0.95 0.0058 264.53) converted
            contrastText: '#030213',
          },
          background: {
            default: '#f3f4f6', // New background color
            paper: '#ffffff',
          },
          text: {
            primary: '#252525', // oklch(0.145 0 0) converted
            secondary: '#717182',
          },
          divider: 'rgba(0, 0, 0, 0.1)',
          action: {
            active: '#B5B5B5',
          },
          error: {
            main: '#d4183d',
            contrastText: '#ffffff',
          },
          info: {
            main: '#459569', // Pending color
          },
          warning: {
            main: '#fef9c2', // In Review color
          },
          success: {
            main: '#459569', // Open color: similar to pending as per image.
          },
        }
      : {
          // Dark mode palette (adjusting for new sidebar color)
          primary: {
            main: '#155dfc', // Selected item on sidebar
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#262626', // A darker secondary for dark mode
            contrastText: '#FBFBFB',
          },
          background: {
            default: '#101828', // Sidebar background as default for dark mode
            paper: '#252525', // Dark card
          },
          text: {
            primary: '#FBFBFB', // Light text for dark mode
            secondary: '#B5B5B5',
          },
          divider: '#454545', // Darker divider
          action: {
            active: '#707070',
          },
          error: {
            main: '#7D4742',
            contrastText: '#B87B75',
          },
          info: {
            main: '#459569',
          },
          warning: {
            main: '#fef9c2',
          },
          success: {
            main: '#459569',
          },
        }),
  },
  typography,
  shape,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          // borderRadius: shape.borderRadius,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
        },
        notchedOutline: {
          borderColor: 'rgba(0, 0, 0, 0.1)', // Using light mode border color as a default
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#f3f4f6', // Main content header background in light mode
          color: '#101828', // "HR Portal" text if it were in the AppBar, but it's in sidebar
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)', // Add border for separation
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#101828', // New sidebar background color
          color: '#FFFFFF', // New sidebar foreground color
          borderRight: '1px solid #364152', // New sidebar border color
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#155dfc', // Selected item color
            color: '#FFFFFF', // Selected item text color
            '&:hover': {
              backgroundColor: '#155dfc', // Keep same on hover
            },
          },
          '&:hover': {
            backgroundColor: '#0F4DBA', // Darker blue for hover state
            color: '#FFFFFF', // Hover state text color
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorSuccess: {
          backgroundColor: '#459569', // Open color
          color: '#FFFFFF',
        },
        colorInfo: {
          backgroundColor: '#459569', // Pending color
          color: '#FFFFFF',
        },
        colorWarning: {
          backgroundColor: '#fef9c2', // In Review color
          color: '#000000', // Dark text for light background
        },
        colorError: {
          backgroundColor: '#d4183d', // Closed color (from previous destructive)
          color: '#FFFFFF',
        },
      },
    },
  },
});

export const getAppTheme = (mode: PaletteMode) => responsiveFontSizes(createTheme(getDesignTokens(mode)));
