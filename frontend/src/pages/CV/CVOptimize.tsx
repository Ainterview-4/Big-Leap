import React, { useState } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RecommendIcon from "@mui/icons-material/Recommend";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const CVOptimize: React.FC = () => {
    const navigate = useNavigate();
    const [optimizing, setOptimizing] = useState(false);
    const [optimized, setOptimized] = useState(false);

    // Mock initial issues
    const initialIssues = [
        { type: "warning", text: "Resume length is too short for your experience level." },
        { type: "info", text: "Consider adding more action verbs (e.g., 'Led', 'Developed')." },
        { type: "error", text: "Missing contact information: 'LinkedIn URL'." },
    ];

    // Mock optimized improvements
    const improvements = [
        "Rephrased 5 bullet points to be result-oriented.",
        "Added 3 missing industry keywords: 'Docker', 'Kubernetes', 'CI/CD'.",
        "Corrected 2 formatting inconsistencies.",
        "Added LinkedIn URL placeholder.",
    ];

    const handleOptimize = () => {
        setOptimizing(true);
        // Simulate API call
        setTimeout(() => {
            setOptimizing(false);
            setOptimized(true);
        }, 2000);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 6,
                    borderRadius: 4,
                    background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
                }}
            >
                <Box display="flex" alignItems="center" mb={4}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/cv/result")} sx={{ mr: 2 }}>
                        Back
                    </Button>
                    <Typography variant="h4" fontWeight="bold">
                        AI CV Optimizer
                    </Typography>
                </Box>

                {!optimized ? (
                    <Box>
                        <Typography variant="h6" gutterBottom color="text.secondary">
                            We found some areas for improvement in your resume.
                        </Typography>

                        <Grid container spacing={4} sx={{ mt: 2, mb: 4 }}>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Identified Issues
                                        </Typography>
                                        <List>
                                            {initialIssues.map((issue, index) => (
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <RecommendIcon color={issue.type === "error" ? "error" : "warning"} />
                                                    </ListItemIcon>
                                                    <ListItemText primary={issue.text} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }} display="flex" alignItems="center" justifyContent="center">
                                <Box textAlign="center">
                                    <CircularProgress
                                        variant="determinate"
                                        value={75}
                                        size={120}
                                        thickness={4}
                                        sx={{ color: "warning.main", mb: 2 }}
                                    />
                                    <Typography variant="h5" fontWeight="bold">
                                        75/100
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Current Score
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Box textAlign="center">
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={optimizing ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                                onClick={handleOptimize}
                                disabled={optimizing}
                                sx={{
                                    px: 6,
                                    py: 2,
                                    borderRadius: 3,
                                    fontSize: "1.2rem",
                                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                                    boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                                }}
                            >
                                {optimizing ? "Optimizing..." : "Fix My Resume with AI"}
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        <Box textAlign="center" mb={4}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 1 }} />
                            <Typography variant="h4" color="success.main" fontWeight="bold">
                                Optimization Complete!
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Your resume score has increased to **95/100**.
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AutoFixHighIcon color="primary" sx={{ mr: 1 }} /> Improvements Made
                                        </Typography>
                                        <List>
                                            {improvements.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <CheckCircleIcon color="success" fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText primary={item} />
                                                    </ListItem>
                                                    {index < improvements.length - 1 && <Divider component="li" />}
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card variant="outlined" sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4, bgcolor: '#f0faff' }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                                        Your New Resume is Ready
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph textAlign="center">
                                        Download your optimized resume in PDF format to use for your applications.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<DownloadIcon />}
                                        sx={{ mt: 2 }}
                                    >
                                        Download Optimized PDF
                                    </Button>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default CVOptimize;
