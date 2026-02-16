import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Paper, useTheme, alpha, Fade } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

interface ProcessingStateProps {
    title: string;
    steps: string[];
    estimatedTime?: number; // milliseconds
    tips?: string[];
}

const DEFAULT_TIPS = [
    "Use strong action verbs like 'Led', 'Developed', and 'Optimized'.",
    "Tailor your resume keywords to the specific job description.",
    "Keep your resume concise and focused on achievements, not just duties.",
    "Quantify your results whenever possible (e.g., 'Increased sales by 20%').",
    "Proofread carefully! Typos can be a deal-breaker.",
];

const ProcessingState: React.FC<ProcessingStateProps> = ({
    title,
    steps,
    estimatedTime = 10000,
    tips = DEFAULT_TIPS
}) => {
    const theme = useTheme();

    // Progress State
    const [progress, setProgress] = useState(0);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // Tip State
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [showTip, setShowTip] = useState(true);

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            // Calculate progress (0 to 90%, last 10% is for completion)
            // Use a logarithmic curve to slow down as it gets closer to 90%
            const rawProgress = Math.min((elapsed / estimatedTime) * 100, 95);
            setProgress(rawProgress);

            // Rotate steps based on progress
            const stepDuration = estimatedTime / steps.length;
            const stepIndex = Math.min(
                Math.floor(elapsed / stepDuration),
                steps.length - 1
            );
            setCurrentStepIndex(stepIndex);
        }, 100);

        return () => clearInterval(interval);
    }, [estimatedTime, steps]);

    // Rotate tips every 4 seconds
    useEffect(() => {
        const tipInterval = setInterval(() => {
            setShowTip(false);
            setTimeout(() => {
                setCurrentTipIndex((prev) => (prev + 1) % tips.length);
                setShowTip(true);
            }, 500); // Wait for fade out
        }, 4000);

        return () => clearInterval(tipInterval);
    }, [tips]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="60vh"
            className="animate-fade-in"
        >
            <Box position="relative" mb={6}>
                {/* Animated Background Glow */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                            '0%': { transform: 'translate(-50%, -50%) scale(0.95)', opacity: 0.5 },
                            '50%': { transform: 'translate(-50%, -50%) scale(1.05)', opacity: 0.8 },
                            '100%': { transform: 'translate(-50%, -50%) scale(0.95)', opacity: 0.5 },
                        },
                    }}
                />
                <PsychologyIcon sx={{ fontSize: 80, color: 'primary.main', position: 'relative', zIndex: 1 }} />
            </Box>

            <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
                {title}
            </Typography>

            <Box width="100%" maxWidth="500px" mt={4}>
                {/* Progress Bar */}
                <Box sx={{ position: 'relative', mb: 1 }}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                            }
                        }}
                    />
                </Box>

                {/* Current Step Text */}
                <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                        {steps[currentStepIndex]}...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {Math.round(progress)}%
                    </Typography>
                </Box>
            </Box>

            {/* Rotating Tips */}
            <Paper
                elevation={0}
                sx={{
                    mt: 8,
                    p: 3,
                    maxWidth: 600,
                    width: '100%',
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.info.main, 0.05),
                    border: '1px dashed',
                    borderColor: alpha(theme.palette.info.main, 0.3),
                }}
            >
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <TipsAndUpdatesIcon color="info" fontSize="small" />
                    <Typography variant="subtitle2" color="info.main" fontWeight="bold">
                        DID YOU KNOW?
                    </Typography>
                </Box>
                <Fade in={showTip} timeout={500}>
                    <Typography variant="body1" color="text.primary" sx={{ fontStyle: 'italic', minHeight: '1.5em' }}>
                        "{tips[currentTipIndex]}"
                    </Typography>
                </Fade>
            </Paper>
        </Box>
    );
};

export default ProcessingState;
