import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import { answerSession, evaluateSession } from "../../services/interviewApi";

const InterviewQnA: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get state from Setup Page
  const { role, experience, focusArea, sessionId, session } = location.state || {};

  // Local State
  const [currentQuestion, setCurrentQuestion] = useState<{ id: string; text: string } | null>(null);
  const [questionIndex, setQuestionIndex] = useState<number>(1);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize from passed session data
  useEffect(() => {
    if (!sessionId) {
      navigate("/interview/start");
      return;
    }

    if (session?.question) {
      // Backend returns "question_text" or "text" or "question"
      const q = session.question;
      const text = q.text || q.question_text || q.question;
      const id = q.id || q.question_id;

      if (text && id) {
        setCurrentQuestion({ id, text });
      }
    } else {
      // Only if we don't have initial question (unexpected for new flow)
      // Fallback or loading state
      setCurrentQuestion({ id: "init", text: "Ready to start the interview?" });
    }
  }, [sessionId, session, navigate]);

  const handleNext = async () => {
    if (!sessionId || !currentQuestion) return;

    try {
      setIsLoading(true);

      const payload = {
        previous_question_id: currentQuestion.id,
        previous_question: currentQuestion.text,
        previous_answer: answer
      };

      // Send answer to backend
      const res = await answerSession(sessionId, payload);
      // Backend returns the NEXT question object directly (or inside data)
      const nextQ = res;

      if (nextQ && (nextQ.question_text || nextQ.text)) {
        const text = nextQ.question_text || nextQ.text;
        const id = nextQ.id || nextQ.question_id;

        setCurrentQuestion({ id, text });
        setQuestionIndex(prev => prev + 1);
        setAnswer("");

        if (nextQ.category === "final") {
          // Optional: Auto-finish or show a "Finalize" button
          // For now, let's just let them continue or manually finish if UI allows
          // Or ideally, redirect to results
          handleFinish();
        }

      } else if (nextQ?.category === 'final') {
        handleFinish();
      } else {
        // Fallback
        console.warn("No next question returned", nextQ);
      }

    } catch (err: unknown) {
      console.error("Error submitting answer:", err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((err as any).response?.data?.error?.code === "INTERVIEW_LIMIT_REACHED") {
        alert("Interview limit reached. Finalizing...");
        handleFinish();
      } else {
        alert("Failed to submit answer. Please try again.");
      }
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
          {currentQuestion?.text || "Loading question..."}
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
