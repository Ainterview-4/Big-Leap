import React from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  Divider,
  Stack,
  Card,
  CardContent,
  useTheme,
  alpha,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DownloadIcon from "@mui/icons-material/Download";
import WarningIcon from "@mui/icons-material/Warning";
import { useNavigate, useLocation } from "react-router-dom";
import { analyzeCVRequest, getCV } from "../../api/cv";
import { toast } from "react-toastify";
import type { AnalysisResult, CV } from "../../api/types";

import ProcessingState from "../../components/ProcessingState";

// Simple Circular Progress Component if recharts is not desired
const ScoreCircle: React.FC<{ score: number }> = ({ score }) => (
  <Box position="relative" display="inline-flex">
    <Typography
      variant="caption"
      component="div"
      color="text.secondary"
      sx={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: score > 70 ? "success.main" : score > 40 ? "warning.main" : "error.main",
      }}
    >
      {score}%
    </Typography>
    <Box
      sx={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        border: `6px solid #e0e0e0`,
        borderTopColor: score > 70 ? "#2e7d32" : score > 40 ? "#ed6c02" : "#d32f2f",
        transform: "rotate(-45deg)", // Adjust to make it look like a progress filler
      }}
    />
  </Box>
);

const CVResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const filename = location.state?.filename || "Uploaded Resume";

  const receivedCv: CV | undefined = (location.state as { cvData?: CV })?.cvData;
  const [cvStart, setCvStart] = React.useState<CV | undefined>(receivedCv);
  const structured = cvStart?.structuredData;

  const [analyzing, setAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);
  const [atsScore, setAtsScore] = React.useState<number | null>(null);
  const analysisAttempted = React.useRef(false);

  // Polling for Structured Data
  const needsPolling = cvStart?.status === "PROCESSING" || cvStart?.status === "QUEUED" || (cvStart?.id && !cvStart.structuredData);

  React.useEffect(() => {
    if (needsPolling && cvStart?.id) {
      const interval = setInterval(async () => {
        try {
          const res = await getCV(cvStart.id);
          // Safely handle AxiosResponse or direct data
          const updatedCv = ((res as any).data || res) as CV;

          if (updatedCv.status === "COMPLETED" || updatedCv.structuredData) {
            setCvStart(updatedCv);
            clearInterval(interval);
            toast.success("AI Analysis Completed!");
          } else if (updatedCv.status === "FAILED") {
            clearInterval(interval);
            toast.error("AI Analysis Failed. Please try uploading again.");
          }
        } catch (error) {
          console.error("Polling failed", error);
        }
      }, 2000); // Poll every 2 seconds

      return () => clearInterval(interval);
    }
  }, [cvStart, structured, needsPolling]);

  React.useEffect(() => {
    // If we have an ID but no analysis result yet, fetch it
    // Use ref to prevent double-firing or infinite retry loops
    // Wait until status is COMPLETED or structuredData is available before analyzing
    const readyToAnalyze = cvStart?.status === "COMPLETED" || !!cvStart?.structuredData;

    if (cvStart?.id && readyToAnalyze && !analysisResult && !analyzing && !analysisAttempted.current) {
      analysisAttempted.current = true;

      const fetchAnalysis = async () => {
        try {
          setAnalyzing(true);
          const res = await analyzeCVRequest(cvStart.id);
          const data = ((res as { data?: unknown }).data || res) as { analysis: AnalysisResult; atsScore: number };
          setAnalysisResult(data.analysis);
          setAtsScore(data.atsScore);
        } catch (error) {
          console.error("Analysis failed", error);
          toast.error("Could not complete ATS analysis. Please try again later.");
        } finally {
          setAnalyzing(false);
        }
      };
      fetchAnalysis();
    }
  }, [cvStart, analysisResult, analyzing]);

  // Merge data sources: Analysis API > Upload structured data > Mocks
  const score = atsScore ?? (structured ? 0 : 0);
  const summary = analysisResult?.issues?.[0]?.fix || structured?.summary || "Analyzing...";
  const strengths = analysisResult?.strengths || structured?.skills?.technical || [];
  const missingKeywords = analysisResult?.missingKeywords || [];

  const cvData = {
    score,
    summary, // No longer need placeholder text here as we show full screen loader
    missingKeywords,
    strengths,
  };

  const isProcessing = needsPolling || analyzing;

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: `0 20px 40px -10px ${alpha(theme.palette.primary.main, 0.05)}`,
          minHeight: '60vh'
        }}
      >
        {isProcessing ? (
          <ProcessingState
            title="Analyzing Your Resume"
            estimatedTime={10000}
            steps={[
              "Parsing PDF document structure...",
              "Extracting professional experience...",
              "Identifing technical skills...",
              "Analyzing formatting and layout...",
              "Comparing against industry standards...",
              "Calculating ATS Score..."
            ]}
          />
        ) : (
          <>
            {/* Header Section */}
            <Box textAlign="center" mb={6} className="animate-fade-in">
              <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h3" fontWeight="800" color="text.primary" gutterBottom>
                Analysis Complete
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Here is how <strong>{filename}</strong> stacks up against industry standards.
              </Typography>
            </Box>

            <Grid container spacing={4} className="animate-fade-in">
              {/* LEFT COLUMN: Score & Summary */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: alpha(theme.palette.divider, 0.6)
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      ATS Score
                    </Typography>
                    <Box py={2}>
                      <ScoreCircle score={cvData.score} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                      Your resume scores <strong>{cvData.score}/100</strong>. It is formatted well but missing some key technical terms.
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      fullWidth
                      sx={{ borderRadius: 2 }}
                    >
                      Download Report
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* RIGHT COLUMN: Detailed Analysis */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={3}>
                  {/* Executive Summary */}
                  <Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      Executive Summary
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {cvData.summary}
                    </Typography>
                  </Box>

                  <Divider />

                  {/* Missing Keywords */}
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <WarningIcon color="warning" />
                      <Typography variant="h6" fontWeight="bold">
                        Missing Keywords
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Recruiters often look for these specific skills. Consider adding them if you have the experience:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                      {cvData.missingKeywords.map((keyword: string) => (
                        <Chip
                          key={keyword}
                          label={keyword}
                          color="warning"
                          variant="outlined"
                          sx={{ fontWeight: "medium" }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Divider />

                  {/* Strengths */}
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Identified Strengths
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {cvData.strengths.map((skill: string) => (
                        <Chip
                          key={skill}
                          label={skill}
                          color="success"
                          sx={{ fontWeight: "medium", bgcolor: "success.light", color: "success.dark" }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="center" mt={8} gap={3} className="animate-fade-in">
              {/* Optimization State Logic */}
              {cvStart?.optimizedPdfUrl ? (
                <Stack direction="row" spacing={3}>
                  <Button
                    variant="contained"
                    size="large"
                    color="success"
                    startIcon={<DownloadIcon />}
                    href={cvStart.optimizedPdfUrl}
                    target="_blank"
                    sx={{
                      px: 6,
                      py: 1.5,
                      fontSize: "1.1rem",
                      borderRadius: 3,
                      fontWeight: "bold",
                      boxShadow: "0 8px 20px -4px rgba(46, 125, 50, 0.4)",
                    }}
                  >
                    Download Optimized PDF
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    color="primary"
                    startIcon={<AutoFixHighIcon />}
                    onClick={() => navigate("/cv/optimize", { state: { cvData: cvStart, force: true } })}
                    sx={{
                      px: 4,
                      borderRadius: 3,
                      borderWidth: 2,
                      "&:hover": { borderWidth: 2 },
                    }}
                  >
                    Re-optimize (Force)
                  </Button>
                </Stack>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AutoFixHighIcon />}
                  onClick={() => navigate("/cv/optimize", { state: { cvData: cvStart } })}
                  sx={{
                    px: 6,
                    py: 1.5,
                    fontSize: "1.1rem",
                    borderRadius: 3,
                    fontWeight: "bold",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 8px 20px -4px ${alpha(theme.palette.primary.main, 0.4)}`,
                  }}
                >
                  Optimize My CV
                </Button>
              )}

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/interview/start")}
                sx={{
                  px: 6,
                  py: 1.5,
                  fontSize: "1.1rem",
                  borderRadius: 3,
                  borderWidth: 2,
                  "&:hover": { borderWidth: 2 },
                }}
              >
                Practice Interview
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default CVResult;
