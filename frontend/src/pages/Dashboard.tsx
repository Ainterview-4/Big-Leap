import React from "react";
import { Container, Grid, Paper, Typography, Box, useTheme, alpha } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 }, mb: 8 }}>
            <Box textAlign="center" mb={{ xs: 6, md: 8 }}>
                <Typography
                    variant="h2"
                    fontWeight="800"
                    gutterBottom
                    sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "-1px",
                        mb: 2
                    }}
                >
                    Welcome to PrePath AI
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.6 }}>
                    Your personal AI career coach. Choose a path below to start optimizing your profile and practicing for success.
                </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                {/* CV Section Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, md: 6 },
                            height: "100%",
                            borderRadius: 6,
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                            position: "relative",
                            overflow: "hidden",
                            background: "rgba(255, 255, 255, 0.7)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid",
                            borderColor: "divider",
                            "&:hover": {
                                transform: "translateY(-8px)",
                                boxShadow: `0 20px 40px -10px ${alpha(theme.palette.primary.main, 0.2)}`,
                                borderColor: "primary.main",
                                "& .icon-box": {
                                    transform: "scale(1.1) rotate(5deg)",
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                                    color: "white",
                                }
                            },
                        }}
                        onClick={() => navigate("/cv/upload")}
                    >
                        {/* Decorative Background Blob */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: -50,
                                right: -50,
                                width: 150,
                                height: 150,
                                borderRadius: "50%",
                                background: alpha(theme.palette.primary.main, 0.1),
                                filter: "blur(40px)",
                                zIndex: 0,
                            }}
                        />

                        <Box
                            className="icon-box"
                            sx={{
                                width: 90,
                                height: 90,
                                borderRadius: "24px",
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto",
                                mb: 4,
                                transition: "all 0.3s ease",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            <CloudUploadIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Box position="relative" zIndex={1}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
                                CV Optimizer
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                Upload your resume to get comprehensive AI-feedback using industry standards. Improve your ATS score instantly.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Interview Section Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, md: 6 },
                            height: "100%",
                            borderRadius: 6,
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                            position: "relative",
                            overflow: "hidden",
                            background: "rgba(255, 255, 255, 0.7)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid",
                            borderColor: "divider",
                            "&:hover": {
                                transform: "translateY(-8px)",
                                boxShadow: `0 20px 40px -10px ${alpha(theme.palette.secondary.main, 0.2)}`,
                                borderColor: "secondary.main",
                                "& .icon-box": {
                                    transform: "scale(1.1) rotate(-5deg)",
                                    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
                                    color: "white",
                                }
                            },
                        }}
                        onClick={() => navigate("/interview/start")}
                    >
                        {/* Decorative Background Blob */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: -50,
                                left: -50,
                                width: 150,
                                height: 150,
                                borderRadius: "50%",
                                background: alpha(theme.palette.secondary.main, 0.1),
                                filter: "blur(40px)",
                                zIndex: 0,
                            }}
                        />

                        <Box
                            className="icon-box"
                            sx={{
                                width: 90,
                                height: 90,
                                borderRadius: "24px",
                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                color: "secondary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto",
                                mb: 4,
                                transition: "all 0.3s ease",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            <SchoolIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Box position="relative" zIndex={1}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
                                Interview Prep
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                Simulate real interview scenarios. Practice technical and behavioral questions with a timer and get results.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
