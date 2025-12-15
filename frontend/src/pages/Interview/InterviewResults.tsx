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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { useNavigate } from "react-router-dom";

// Mock Data for Results
const resultData = {
  overallScore: 82,
  role: "Frontend Developer",
  feedback: [
    {
      category: "Technical Knowledge",
      score: 85,
      comment: "Strong understanding of React concepts and state management.",
    },
    {
      category: "Communication",
      score: 90,
      comment: "Clear and concise explanations. Good use of terminology.",
    },
    {
      category: "Problem Solving",
      score: 70,
      comment: "Good approach, but could optimize the solution for better performance.",
    },
  ],
  strengths: [
    "Expertise in React Hooks",
    "Clear communication style",
    "Modern ES6+ syntax usage",
  ],
  improvements: [
    "Deepen knowledge of Webpack/Vite configurations",
    "Practice writing unit tests (Jest/Testing Library)",
    "Consider edge cases in algorithm questions",
  ],
};

const InterviewResults: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: 4,
          background: "linear-gradient(135deg, #ffffff 0%, #fffbf0 100%)", // Light gold tint
          border: "1px solid",
          borderColor: "warning.light",
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <EmojiEventsIcon sx={{ fontSize: 80, color: "#FFD700", mb: 2 }} />
          <Typography variant="h3" fontWeight="800" gutterBottom>
            Session Completed!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Great job! Here is the detailed breakdown of your mock interview for <strong>{resultData.role}</strong>.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Overall Score Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                borderRadius: 3,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: 3,
                borderColor: "warning.main",
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Overall Score
              </Typography>
              <Box position="relative" display="inline-flex" justifyContent="center" my={3}>
                <Typography variant="h1" fontWeight="bold" color="primary.main">
                  {resultData.overallScore}
                </Typography>
                <Typography variant="h4" sx={{ alignSelf: 'flex-end', mb: 1.5, ml: 0.5, color: 'text.secondary' }}>
                  /100
                </Typography>
              </Box>
              <Chip
                label="Pass / Recommended"
                color="success"
                icon={<CheckCircleIcon />}
                sx={{ alignSelf: "center", fontSize: "1rem", py: 2, px: 1 }}
              />
            </Card>
          </Grid>

          {/* Detailed Feedback Categories */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ height: "100%" }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Feedback by Category
              </Typography>
              <Grid container spacing={2}>
                {resultData.feedback.map((item, index) => (
                  <Grid size={{ xs: 12 }} key={index}>
                    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.category}
                        </Typography>
                        <Chip
                          label={`${item.score}/100`}
                          size="small"
                          color={item.score > 80 ? "success" : item.score > 60 ? "warning" : "error"}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {item.comment}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        <Grid container spacing={4}>
          {/* Strengths */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <ThumbUpAltIcon color="primary" />
                <Typography variant="h5" fontWeight="bold">
                  Top Strengths
                </Typography>
              </Box>
              <List>
                {resultData.strengths.map((text, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <StarIcon sx={{ color: "#FFD700" }} />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>

          {/* Areas for Improvement */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <ErrorOutlineIcon color="error" />
                <Typography variant="h5" fontWeight="bold">
                  Areas to Improve
                </Typography>
              </Box>
              <List>
                {resultData.improvements.map((text, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <ErrorOutlineIcon color="error" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="center" mt={8} gap={3}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/dashboard")}
            sx={{
              px: 5,
              py: 1.5,
              fontSize: "1.1rem",
              borderRadius: 3,
              borderWidth: 2,
              "&:hover": { borderWidth: 2 },
            }}
          >
            Back to Dashboard
          </Button>

          <Button
            variant="contained"
            size="large"
            startIcon={<RefreshIcon />}
            onClick={() => navigate("/interview/start")}
            sx={{
              px: 5,
              py: 1.5,
              fontSize: "1.1rem",
              borderRadius: 3,
              fontWeight: "bold",
            }}
          >
            Practise Again
          </Button>
        </Box>

      </Paper>
    </Container>
  );
};

export default InterviewResults;
