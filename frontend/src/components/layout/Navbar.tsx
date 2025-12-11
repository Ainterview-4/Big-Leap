import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Container,
    Button,
    IconButton,
    useTheme,
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
                bgcolor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid",
                borderColor: "divider",
                color: "text.primary",
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ height: 70 }}>
                    {/* Back Button */}
                    {showBackButton && (
                        <IconButton
                            onClick={() => navigate(-1)}
                            color="default"
                            sx={{
                                mr: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                                p: 1,
                                "&:hover": { bgcolor: "action.hover" },
                            }}
                        >
                            <ArrowBackIcon fontSize="small" />
                        </IconButton>
                    )}

                    {/* Logo / Brand */}
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{ flexGrow: 1, cursor: "pointer" }}
                        onClick={() => navigate("/dashboard")}
                    >
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "primary.main",
                                borderRadius: 1,
                                mr: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        >
                            BL
                        </Box>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                fontWeight: 800,
                                letterSpacing: "-0.5px",
                                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            BigLeap AI
                        </Typography>
                    </Box>

                    {/* Navigation Links */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, mr: 3 }}>
                        <Button
                            startIcon={<CloudUploadIcon />}
                            onClick={() => navigate("/cv/upload")}
                            sx={{
                                color: isActive("/cv") ? "primary.main" : "text.secondary",
                                bgcolor: isActive("/cv") ? "primary.lighter" : "transparent",
                                fontWeight: isActive("/cv") ? 700 : 500,
                                textTransform: "none",
                                px: 2,
                                borderRadius: 2,
                                "&:hover": { bgcolor: "action.hover" },
                            }}
                        >
                            CV & Resume
                        </Button>
                        <Button
                            startIcon={<DashboardIcon />}
                            onClick={() => navigate("/interview/start")}
                            sx={{
                                color: isActive("/interview") ? "primary.main" : "text.secondary",
                                bgcolor: isActive("/interview")
                                    ? "primary.lighter"
                                    : "transparent",
                                fontWeight: isActive("/interview") ? 700 : 500,
                                textTransform: "none",
                                px: 2,
                                borderRadius: 2,
                                "&:hover": { bgcolor: "action.hover" },
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
                            borderRadius: 2,
                            p: 1,
                        }}
                    >
                        <ExitToAppIcon fontSize="small" />
                    </IconButton>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
