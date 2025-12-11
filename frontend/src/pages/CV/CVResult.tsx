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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DownloadIcon from "@mui/icons-material/Download";
import WarningIcon from "@mui/icons-material/Warning";
import { useNavigate, useLocation } from "react-router-dom";

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
  const filename = location.state?.filename || "Uploaded Resume";

  // MOCK DATA - Replace with actual API response later
  const cvData = {
    score: 75,
    summary: "A solid profile for a Frontend Developer role. Good experience with React and modern web technologies. However, lacks explicit mentions of testing frameworks and backend familiarity.",
    missingKeywords: ["Jest", "Cypress", "Docker", "GraphQL", "CI/CD"],
    strengths: ["React.js", "TypeScript", "UI/UX Design", "Responsive Layouts"],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Header Section */}
        <Box textAlign="center" mb={6}>
          <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h3" fontWeight="800" color="text.primary" gutterBottom>
            Analysis Complete
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Here is how <strong>{filename}</strong> stacks up against industry standards.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* LEFT COLUMN: Score & Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined" sx={{ height: "100%", borderRadius: 3 }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  ATS Score
                </Typography>
                <Box py={2}>
                  {/* Placeholder for a real chart library later */}
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
                  {cvData.missingKeywords.map((keyword) => (
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
                  {cvData.strengths.map((skill) => (
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
        <Box display="flex" justifyContent="center" mt={8} gap={3}>
          <Button
            variant="contained"
            size="large"

            startIcon={<AutoFixHighIcon />}
            onClick={() => navigate("/cv/optimize")}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: "1.1rem",
              borderRadius: 3,
              fontWeight: "bold",
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              boxShadow: "0 4px 14px 0 rgba(33, 203, 243, .3)",
            }}
          >
            Optimize My CV
          </Button>

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
      </Paper>
    </Container>
  );
};

export default CVResult;
