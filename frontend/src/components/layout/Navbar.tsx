import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    IconButton,
    useTheme,
    alpha,
    Menu,
    MenuItem,
    ListItemIcon,
    Avatar,
    Divider
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SettingsIcon from "@mui/icons-material/Settings";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfileClick = () => {
        handleMenuClose();
        navigate("/profile");
    };

    const handleLogout = () => {
        handleMenuClose();
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
                bgcolor: alpha(theme.palette.background.paper, 0.7), // Adaptive background
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid",
                borderColor: "divider",
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
                            backgroundColor: alpha(theme.palette.background.paper, 0.5),
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

                {/* User Menu */}
                <Box>
                    <IconButton
                        onClick={handleMenuClick}
                        size="small"
                        sx={{
                            ml: 0.5,
                            border: "2px solid",
                            borderColor: open ? "primary.main" : "transparent",
                            transition: "all 0.2s",
                        }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: theme.palette.secondary.main,
                                fontSize: "1rem",
                                fontWeight: "bold"
                            }}
                        >
                            TU
                        </Avatar>
                    </IconButton>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.1))',
                            mt: 1.5,
                            borderRadius: '16px',
                            minWidth: 180,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: alpha(theme.palette.background.paper, 0.9),
                            backdropFilter: "blur(10px)",
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <Box px={2} py={1}>
                        <Typography variant="subtitle2" fontWeight="bold">Test User</Typography>
                        <Typography variant="caption" color="text.secondary">test@example.com</Typography>
                    </Box>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem onClick={handleProfileClick} sx={{ borderRadius: 1, mx: 1 }}>
                        <ListItemIcon>
                            <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        Profile & Settings
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ borderRadius: 1, mx: 1, color: 'error.main' }}>
                        <ListItemIcon>
                            <ExitToAppIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;