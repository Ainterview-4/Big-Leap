import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  LinearProgress,
  Chip,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import TimerIcon from "@mui/icons-material/Timer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useLocation, useNavigate } from "react-router-dom";

// Mock Questions Generator (In real app, fetch from Backend)
const getMockQuestions = (role: string) => [
  {
    id: 1,
    question: `Can you explain the difference between 'let', 'const', and 'var' in JavaScript?`,
    hint: "Think about scope and hoisting.",
  },
  {
    id: 2,
    question: `How would you optimize the performance of a React application with a large list of items?`,
    hint: "Consider virtualization or memoization.",
  },
  {
    id: 3,
    question: `Describe a challenging bug you faced in a previous ${role} project and how you solved it.`,
    hint: "Use the STAR method (Situation, Task, Action, Result).",
  },
];

const InterviewQnA: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get state from Setup Page
  const { role, experience, focusArea } = location.state || {
    role: "Candidate",
    experience: "General",
    focusArea: "General",
  };

  const questions = getMockQuestions(role);
  const totalQuestions = questions.length;

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question

  // Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleNext = () => {
    // In a real app, save the answer here
    console.log(`Answer for Q${currentIndex + 1}:`, answer);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnswer("");
      setTimeLeft(120); // Reset timer
    } else {
      // Finish Session
      navigate("/interview/results");
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
      {/* Header Info */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary">
            {role} Interview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {experience} Level • {focusArea}
          </Typography>
        </Box>
        <Chip
          icon={<TimerIcon />}
          label={formatTime(timeLeft)}
          color={timeLeft < 30 ? "error" : "default"}
          variant="outlined"
          sx={{ fontSize: "1rem", px: 1 }}
        />
      </Box>

      {/* Progress Bar */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="text.secondary">
            Question {currentIndex + 1} of {totalQuestions}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}%
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
      </Box>

      {/* Question Card */}
      <Paper
        elevation={3}
        sx={{
          p: 5,
          borderRadius: 4,
          mb: 4,
          background: "linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)",
          border: "1px solid",
          borderColor: "primary.light",
        }}
      >
        <Typography variant="h5" fontWeight="medium" gutterBottom>
          {currentQuestion.question}
        </Typography>

        {/* Optional Hint */}
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic", mt: 2, display: "block" }}>
          Hint: {currentQuestion.hint}
        </Typography>
      </Paper>

      {/* Answer Input */}
      <Box sx={{ position: "relative" }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          placeholder="Type your answer here..."
          variant="outlined"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            }
          }}
        />
        <IconButton
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            bgcolor: "action.hover"
          }}
        >
          <MicIcon color="primary" />
        </IconButton>
      </Box>

      {/* Footer / Navigation */}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          color="inherit"
          onClick={() => navigate("/interview/start")}
          sx={{ textTransform: "none" }}
        >
          Quit Session
        </Button>

        <Button
          variant="contained"
          size="large"
          endIcon={currentIndex === totalQuestions - 1 ? <SendIcon /> : <ArrowForwardIcon />}
          onClick={handleNext}
          disabled={answer.trim().length === 0}
          sx={{
            px: 5,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1.1rem"
          }}
        >
          {currentIndex === totalQuestions - 1 ? "Submit & Finish" : "Next Question"}
        </Button>
      </Box>
    </Container>
  );
};

export default InterviewQnA;
