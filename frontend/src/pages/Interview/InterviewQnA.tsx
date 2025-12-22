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
import { useLocation, useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import TimerIcon from "@mui/icons-material/Timer";
import { answerSession, evaluateSession } from "../../services/interviewApi";

const InterviewQnA: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get state from Setup Page
  const { role, experience, focusArea, sessionId, session } = location.state || {};

  // Local State
  const [currentQuestionText, setCurrentQuestionText] = useState<string>("");
  const [questionIndex, setQuestionIndex] = useState<number>(1);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const [isLoading, setIsLoading] = useState(false);

  // Initialize from passed session data or fetch
  useEffect(() => {
    if (!sessionId) {
      // Fallback or redirect if no session
      console.warn("No sessionId provided, redirecting...");
      navigate("/interview/start");
      return;
    }

    if (session) {
      // We might have the initial question in session data if backend returns it on create
      // But typically create returns the session object. 
      // We might need to fetch the *first* question text if it's not in the 'create' response or generated yet.
      // Actually, creating a session usually implies starting. 
      // Let's assume the backend 'answer' logic generates the *next* question.
      // What about the FIRST question?
      // If the backend doesn't provide a first question on Create, we might need a workaround or an initial "start" trigger.
      // Looking at controller: create session -> status IN_PROGRESS. No messages yet? 
      // We probably need to send an empty answer or a "start" signal to get the first question, 
      // OR the backend createSession should have generated the first question.
      // Let's check backend logic... 
      // Backend 'startSession' just creates the record. It doesn't seem to generate a message.
      // 'answerInterview' generates the next question.
    }

    // TEMPORARY: If no question exists, we simulate "starting" by asking the backend for a question 
    // or we just display a welcome message and hit "Next" to get the first real question?
    // Let's assume for now we call 'answer' with a "Hello" or "Ready" to trigger the first question 
    // IF the conversation history is empty.
    // Ideally we should Fetch the session details to see if messages exist.

    // Setting a default starting prompt if none exists
    setCurrentQuestionText("Please introduce yourself and tell us about your experience as a " + (role || "developer") + ".");

  }, [sessionId, session, navigate, role]);

  // Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [questionIndex]); // Reset on new question

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleNext = async () => {
    if (!sessionId) return;

    try {
      setIsLoading(true);
      // Send answer to backend
      const res = await answerSession(sessionId, answer);
      const data = res.data; // { sessionId, questionIndex, nextQuestion }

      if (data && data.nextQuestion) {
        setCurrentQuestionText(data.nextQuestion);
        setQuestionIndex(data.questionIndex || questionIndex + 1);
        setAnswer("");
        setTimeLeft(120);
      } else {
        // No next question? Maybe finished?
        handleFinish();
      }

    } catch (err) {
      console.error("Error submitting answer:", err);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      await evaluateSession(sessionId);
      navigate("/interview/results", { state: { sessionId } });
    } catch (err) {
      console.error("Error evaluating session:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Skip showing mocked list logic
  // const totalQuestions = ... 
  // For dynamic chat, we might not know total questions, or we fix it to 5 etc.
  // Let's assume continuous for now or fix a limit.

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
      {/* Header Info */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary">
            {role || "Interview"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {experience || "General"} • {focusArea || "General"}
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

      {/* Progress Bar (Mocked for continuous flow) */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="text.secondary">
            Question {questionIndex}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            In Progress
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={Math.min(questionIndex * 10, 100)} sx={{ height: 10, borderRadius: 5 }} />
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
          {currentQuestionText || "Loading question..."}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic", mt: 2, display: "block" }}>
          Hint: Be specific and provide examples.
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
          disabled={isLoading}
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
          onClick={() => handleFinish()} // Quit -> Validates/Evaluates what we have
          sx={{ textTransform: "none" }}
        >
          End Session
        </Button>

        <Button
          variant="contained"
          size="large"
          endIcon={isLoading ? null : <SendIcon />}
          onClick={handleNext}
          disabled={answer.trim().length === 0 || isLoading}
          sx={{
            px: 5,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1.1rem"
          }}
        >
          {isLoading ? "Sending..." : "Submit Answer"}
        </Button>
      </Box>
    </Container>
  );
};

export default InterviewQnA;
