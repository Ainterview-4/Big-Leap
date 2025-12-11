import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    IconButton,
    useTheme,
    alpha,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth/login");
    };

    const isActive = (path: string) => location.pathname.startsWith(path);
    const showBackButton = location.pathname !== "/dashboard";

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: alpha("#ffffff", 0.7), // More transparent for better glass effect
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid",
                borderColor: "rgba(0,0,0,0.06)", // Softer border
                color: "text.primary",
                transition: "all 0.3s ease",
            }}
        >
            <Toolbar disableGutters sx={{ height: 72, px: { xs: 2, md: 4 } }}>
                {/* Back Button */}
                {showBackButton && (
                    <IconButton
                        onClick={() => navigate(-1)}
                        color="default"
                        sx={{
                            mr: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 3, // Softer rounding
                            p: 1,
                            backgroundColor: "rgba(255,255,255,0.5)",
                            transition: "all 0.2s",
                            "&:hover": {
                                bgcolor: theme.palette.primary.main,
                                color: "#fff",
                                borderColor: theme.palette.primary.main,
                                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
                            },
                        }}
                    >
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                )}

                {/* Logo / Brand */}
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{ flexGrow: 1, cursor: "pointer", userSelect: "none" }}
                    onClick={() => navigate("/dashboard")}
                >
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            borderRadius: "10px", // Squircle
                            mr: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "900",
                            fontSize: "0.9rem",
                            boxShadow: "0 4px 10px rgba(99, 102, 241, 0.3)"
                        }}
                    >
                        PP
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: "-0.5px",
                            background: `linear-gradient(90deg, ${theme.palette.text.primary} 0%, ${theme.palette.text.secondary} 100%)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        PrePath AI
                    </Typography>
                </Box>

                {/* Navigation Links */}
                <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, mr: 3 }}>
                    <Button
                        startIcon={<CloudUploadIcon />}
                        onClick={() => navigate("/cv/upload")}
                        sx={{
                            color: isActive("/cv") ? "primary.main" : "text.secondary",
                            bgcolor: isActive("/cv") ? alpha(theme.palette.primary.main, 0.08) : "transparent",
                            fontWeight: isActive("/cv") ? 700 : 500,
                            textTransform: "none",
                            px: 2.5,
                            py: 1,
                            borderRadius: 3,
                            "&:hover": {
                                bgcolor: alpha(theme.palette.primary.main, 0.12),
                                color: "primary.dark",
                            },
                        }}
                    >
                        CV Optimizer
                    </Button>
                    <Button
                        startIcon={<DashboardIcon />}
                        onClick={() => navigate("/interview/start")}
                        sx={{
                            color: isActive("/interview") ? "secondary.main" : "text.secondary",
                            bgcolor: isActive("/interview")
                                ? alpha(theme.palette.secondary.main, 0.08)
                                : "transparent",
                            fontWeight: isActive("/interview") ? 700 : 500,
                            textTransform: "none",
                            px: 2.5,
                            py: 1,
                            borderRadius: 3,
                            "&:hover": {
                                bgcolor: alpha(theme.palette.secondary.main, 0.12),
                                color: "secondary.dark",
                            },
                        }}
                    >
                        Interview Prep
                    </Button>
                </Box>

                {/* Logout Button */}
                <IconButton
                    onClick={handleLogout}
                    color="default"
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                        p: 1,
                        backgroundColor: "rgba(255,255,255,0.5)",
                        transition: "all 0.2s",
                        "&:hover": {
                            bgcolor: theme.palette.error.main,
                            color: "white",
                            borderColor: theme.palette.error.main,
                            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"
                        }
                    }}
                >
                    <ExitToAppIcon fontSize="small" />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;