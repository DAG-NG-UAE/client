import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

// manage custom themes across codebase
declare module "@mui/material/styles" {
  interface Palette {
    icons?: {
      container: string;
      main: string;
    };
    loginBackground?: string;
  }

  interface PaletteOptions {
    icons?: {
      container: string;
      main: string;
    };
    loginBackground?: string;
  }
}

// Define common design tokens from tailwindstyle.css
const typography = {
  fontFamily: '"Plus Jakarta Sans", sans-serif',
  h1: {
    fontSize: "1.75rem",
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h2: {
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: "1.25rem",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: "1.125rem",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  tableHeader: {
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.6,
  },
  button: {
    fontSize: "0.875rem",
    fontWeight: 600,
    lineHeight: 1.5,
    textTransform: "none",
  },
};

const shape = {
  borderRadius: 10, // Corresponds to --radius: 0.625rem which is 10px
};

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
        // Light mode palette
        primary: {
          main: "#673ab7", // Premium Purple
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#E9EAF0",
          contrastText: "#030213",
        },
        background: {
          default: "#f8f7ff", // Very light purple tint
          paper: "#ffffff",
        },
        text: {
          primary: "#1a102d", // Matching deep purple-black for text
          secondary: "#717182",
        },
        divider: "rgba(103, 58, 183, 0.1)", // Purple-tinted divider
        action: {
          active: "#673ab7",
        },
        error: {
          main: "#d4183d",
          contrastText: "#ffffff",
        },
        info: {
          main: "#459569",
        },
        warning: {
          main: "#fef9c2",
        },
        success: {
          main: "#459569",
        },
        icons: {
          container: "#f3e5f5", // Light purple container
          main: "#673ab7", // Purple icon
        },
        loginBackground: "#673ab7",
      }
      : {
        // Dark mode palette (adjusting for new sidebar color)
        primary: {
          main: "#155dfc", // Selected item on sidebar
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#262626", // A darker secondary for dark mode
          contrastText: "#FBFBFB",
        },
        background: {
          default: "#101828", // Sidebar background as default for dark mode
          paper: "#252525", // Dark card
        },
        text: {
          primary: "#FBFBFB", // Light text for dark mode
          secondary: "#B5B5B5",
        },
        divider: "#454545", // Darker divider
        action: {
          active: "#707070",
        },
        error: {
          main: "#7D4742",
          contrastText: "#B87B75",
        },
        info: {
          main: "#459569",
        },
        warning: {
          main: "#fef9c2",
        },
        success: {
          main: "#459569",
        },
        icons: {
          container: "#dbeafe", // Icon container background for dark mode
          main: "#5f92fd", // Icon color for dark mode
        },
        loginBackground: "#1557f5", // Login page background color for dark mode
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
          borderColor: "rgba(0, 0, 0, 0.1)", // Using light mode border color as a default
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#673ab7", // Match the new header purple
          color: "#ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          borderBottom: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1a102d", // Premium deep purple-black
          color: "#FFFFFF",
          borderRight: "1px solid #362a4d",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#673ab7", // Selected item purple
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#7e57c2", // Slightly lighter purple on hover
            },
          },
          "&:hover": {
            backgroundColor: "rgba(103, 58, 183, 0.1)", // Light purple tint hover
            color: "#673ab7",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorSuccess: {
          backgroundColor: "#459569", // Open color
          color: "#FFFFFF",
        },
        colorInfo: {
          backgroundColor: "#459569", // Pending color
          color: "#FFFFFF",
        },
        colorWarning: {
          backgroundColor: "#fef9c2", // In Review color
          color: "#000000", // Dark text for light background
        },
        colorError: {
          backgroundColor: "#d4183d", // Closed color (from previous destructive)
          color: "#FFFFFF",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: "#d4183d", // Set asterisk color to red
          "&.Mui-error": {
            color: "#d4183d",
          },
        },
      },
    },
  },
});

export const getAppTheme = (mode: PaletteMode) =>
  responsiveFontSizes(createTheme(getDesignTokens(mode)));

export const getApprovalTheme = () =>
  responsiveFontSizes(
    createTheme({
      palette: {
        mode: "dark", // The reference image is dark
        primary: {
          main: "#135bec",
        },
        background: {
          default: "#101622",
          paper: "#1e293b", // Slightly lighter than background-dark for cards, mimicking the image cards
        },
        text: {
          primary: "#ffffff",
          secondary: "#94a3b8",
        },
      },
      typography: {
        fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
        h1: {
          fontSize: "1.75rem",
          fontWeight: 700,
        },
        h2: {
          fontSize: "1.5rem",
          fontWeight: 600,
        },
        h3: {
          fontSize: "1.25rem",
          fontWeight: 600,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: "0.5rem", // lg
              textTransform: "none",
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "none", // Remove default MUI dark mode gradient
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: "0.75rem", // xl
              backgroundColor: "#1e293b", // Keeping card bg distinct
              border: "1px solid #334155", // Subtle border
            },
          },
        },
        MuiFormLabel: {
          styleOverrides: {
            asterisk: {
              color: "#ef4444", // Red color for dark mode
            },
          },
        },
      },
    }),
  );
