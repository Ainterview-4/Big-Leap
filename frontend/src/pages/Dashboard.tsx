import React from "react";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
            <Box textAlign="center" mb={6}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Welcome to BigLeap AI
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Choose your path to career success
                </Typography>
            </Box>

            <Grid container spacing={6} justifyContent="center" alignItems="stretch">
                {/* CV Section Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 6,
                            height: "100%",
                            borderRadius: 4,
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.3s ease-in-out",
                            border: "1px solid transparent",
                            background: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)",
                            "&:hover": {
                                transform: "translateY(-8px)",
                                boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                                borderColor: "primary.main",
                            },
                        }}
                        onClick={() => navigate("/cv/upload")}
                    >
                        <Box
                            sx={{
                                width: 100,
                                height: 100,
                                borderRadius: "50%",
                                bgcolor: "primary.light",
                                color: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto",
                                mb: 4,
                            }}
                        >
                            <CloudUploadIcon sx={{ fontSize: 50, color: "#fff" }} />
                        </Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                            CV Optimizer
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Upload your resume, get AI-powered feedback, and optimize it to pass ATS systems and impress recruiters.
                        </Typography>
                    </Paper>
                </Grid>

                {/* Interview Section Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 6,
                            height: "100%",
                            borderRadius: 4,
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.3s ease-in-out",
                            border: "1px solid transparent",
                            background: "linear-gradient(135deg, #ffffff 0%, #fff0f7 100%)",
                            "&:hover": {
                                transform: "translateY(-8px)",
                                boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                                borderColor: "secondary.main",
                            },
                        }}
                        onClick={() => navigate("/interview/start")}
                    >
                        <Box
                            sx={{
                                width: 100,
                                height: 100,
                                borderRadius: "50%",
                                bgcolor: "secondary.light",
                                color: "secondary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto",
                                mb: 4,
                            }}
                        >
                            <SchoolIcon sx={{ fontSize: 50, color: "#fff" }} />
                        </Box>
                        <Typography variant="h4" fontWeight="bold" gutterBottom color="secondary">
                            Interview Prep
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Practice with AI-generated interview questions tailored to your profile and get real-time feedback.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
