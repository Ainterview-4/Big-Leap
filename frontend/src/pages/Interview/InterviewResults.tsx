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
  Card,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeIcon from "@mui/icons-material/Home";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate, useLocation } from "react-router-dom";
import { getSession } from "../../services/interviewApi";

const InterviewResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = location.state || {};

  const [session, setSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!sessionId) {
      navigate("/interview/start");
      return;
    }

    const fetchResults = async () => {
      try {
        const data = await getSession(sessionId);
        setSession(data);
      } catch (err) {
        console.error("Failed to fetch session results", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 6, mb: 8, textAlign: "center" }}>
        <Typography>Loading results...</Typography>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="lg" sx={{ mt: 6, mb: 8, textAlign: "center" }}>
        <Typography>No results found.</Typography>
        <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
      </Container>
    );
  }

  // Derive display data from session
  // If feedback is JSON string, parse it. If it's the score/feedback fields, use them.
  // The backend might return specific structure.
  // For now, let's assume session.score and session.feedback are available.
  // If we want detailed category breakdown, we might need to parse messages or updated backend schema.
  // Based on current schema: status, score, feedback (string/summary), messages.

  const overallScore = session.score || 0;
  const role = session.interview?.role || "Interview";

  // For categories/strengths/improvements, currently the simple backend finalize only returns `total_answers` and `average_score` in feedback text usually.
  // BUT the user wants detailed breakdown.
  // Real implementation: The API "finalize-session" returns { session_id, total_answers, average_score }.
  // It does NOT return categories/strengths yet in the minimal implementation.
  // However, we can display the aggregate score and maybe some mock categories if the backend doesn't provide them, 
  // OR we clarify that we show what we have.
  // The user SAW mock data and complained. So we must show REAL data even if simple.

  const feedbackText = session.feedback || "No feedback available.";



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
            Great job! Here is the detailed breakdown of your interview session for <strong>{role}</strong>.
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
                  {overallScore}
                </Typography>
                <Typography variant="h4" sx={{ alignSelf: 'flex-end', mb: 1.5, ml: 0.5, color: 'text.secondary' }}>
                  /100
                </Typography>
              </Box>
              <Chip
                label={overallScore >= 70 ? "Pass / Recommended" : "Needs Improvement"}
                color={overallScore >= 70 ? "success" : "warning"}
                icon={overallScore >= 70 ? <CheckCircleIcon /> : <ErrorOutlineIcon />}
                sx={{ alignSelf: "center", fontSize: "1rem", py: 2, px: 1 }}
              />
            </Card>
          </Grid>

          {/* Detailed Feedback (Simplified if we don't have categories) */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ height: "100%" }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Session Feedback
              </Typography>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="body1" color="text.primary">
                  {feedbackText}
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        {/* Detailed Breakdown */}
        {session.messages && session.messages.length > 0 && (
          <Box mt={6} mb={4}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Answer Breakdown
            </Typography>
            <Paper elevation={0} sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
              {session.messages
                .filter((m: any) => m.role === "user")
                .map((answer: any, index: number) => {
                  const answerIndex = session.messages.indexOf(answer);
                  const question = session.messages[answerIndex - 1];

                  // Safely extract grade data
                  const gradeData = answer.metadata?.grade;
                  let displayScore = "-";
                  let feedback = null;
                  let isGoodGrade = false;

                  if (gradeData !== undefined && gradeData !== null) {
                    if (typeof gradeData === 'object') {
                      // API returns object with score and short_feedback
                      const score = gradeData.score ?? gradeData.grade;
                      // Convert to string for display
                      if (score !== undefined) {
                        displayScore = String(score);
                        const scoreNum = Number(score);
                        if (!isNaN(scoreNum) && scoreNum >= 7) isGoodGrade = true;
                      }

                      if (gradeData.short_feedback) {
                        feedback = gradeData.short_feedback;
                      }
                    } else {
                      // Fallback for simple values
                      displayScore = String(gradeData);
                      const scoreNum = Number(gradeData);
                      if (!isNaN(scoreNum) && scoreNum >= 7) isGoodGrade = true;
                      if (typeof gradeData === 'string' && (gradeData.startsWith('A') || gradeData.startsWith('B'))) isGoodGrade = true;
                    }
                  }

                  return (
                    <Box key={answer.id} sx={{ p: 4, borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 9 }}>
                          <Typography variant="subtitle2" color="primary.main" fontWeight="bold" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                            Question {index + 1}
                          </Typography>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
                            {question?.content || "Unknown Question"}
                          </Typography>

                          <Box mt={2} bgcolor="grey.50" p={2.5} borderRadius={3} border="1px dashed" borderColor="grey.300">
                            <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" mb={1}>
                              YOUR ANSWER
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                              {answer.content}
                            </Typography>
                          </Box>

                          {/* Feedback Section */}
                          {feedback && (
                            <Box mt={2} display="flex" gap={1} alignItems="flex-start">
                              <Typography variant="caption" sx={{ bgcolor: "info.light", color: "info.dark", px: 1, borderRadius: 1, fontWeight: "bold", mt: 0.3 }}>
                                AI FEEDBACK
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                "{feedback}"
                              </Typography>
                            </Box>
                          )}
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                          <Box
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              bgcolor: 'background.default',
                              textAlign: 'center',
                              minWidth: 120,
                              border: "1px solid",
                              borderColor: "divider",
                              boxShadow: 1
                            }}
                          >
                            <Typography variant="caption" display="block" color="text.secondary" fontWeight="bold" mb={1}>
                              SCORE
                            </Typography>
                            <Typography variant="h3" fontWeight="800" color={isGoodGrade ? "success.main" : "warning.main"} sx={{ lineHeight: 1 }}>
                              {displayScore}
                              <Typography component="span" variant="h6" color="text.secondary" sx={{ opacity: 0.6 }}>/10</Typography>
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}
            </Paper>
          </Box>
        )}

        <Divider sx={{ my: 6 }} />

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
