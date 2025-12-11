import { createTheme } from "@mui/material/styles";

// Modern AI-inspired Color Palette
// Primary: Deep Indigo/Violet (Confidence, Intelligence)
// Secondary: Electric Cyan/Blue (Tech, Future)
// Background: Clean Soft White/Gray for reduced eye strain

const theme = createTheme({
  palette: {
    mode: "light", // Keeping light mode for now, but prepping for dark
    primary: {
      main: "#6366f1", // Indigo 500
      light: "#818cf8",
      dark: "#4f46e5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0ea5e9", // Sky 500
      light: "#38bdf8",
      dark: "#0284c7",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc", // Slate 50
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b", // Slate 800
      secondary: "#64748b", // Slate 500
    },
    success: {
      main: "#10b981", // Emerald 500
    },
    warning: {
      main: "#f59e0b", // Amber 500
    },
    error: {
      main: "#ef4444", // Red 500
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    // Global Reset
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(135deg, #EFF6FF 0%, #FAFAFA 100%)", // Very subtle blue-ish white
          // Alternative option if this is too plain: 
          // background: "radial-gradient(circle at 50% -20%, #e0e7ff 0%, #fafafa 60%)",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        },
      },
    },
    // Buttons
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)", // Subtle glow
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
        },
        containedSecondary: {
          background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
        },
      },
    },
    // Cards & Paper
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // Reset overlay
        },
        elevation1: {
          boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.05), 0px 4px 6px -1px rgba(0,0,0,0.05)",
        },
        elevation3: {
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "#e2e8f0", // Slate 200
          boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.05)",
        }
      }
    },
    // Inputs
    MuiTextField: {
      defaultProps: {
        size: "small",
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          }
        }
      }
    },
  },
});

export default theme;
