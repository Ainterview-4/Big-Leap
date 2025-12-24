import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SettingsVoiceIcon from "@mui/icons-material/SettingsVoice";
import { useNavigate } from "react-router-dom";
import { createInterview, startInterviewSession } from "../../services/interviewApi";
import { AxiosError } from "axios";

const InterviewStart: React.FC = () => {
  const navigate = useNavigate();

  // State for form fields
  const [role, setRole] = useState("Frontend Developer");
  const [experience, setExperience] = useState("Mid-Level");
  const [focusArea, setFocusArea] = useState("Technical Skills");
  const [isLoading, setIsLoading] = useState(false);

  /* 
   * Updated handleStart to integrate with backend API
   */
  const handleStart = async () => {
    try {
      setIsLoading(true);

      // 1. Create Interview
      const interviewParams = {
        title: `${role} Interview`,
        role,
        level: experience,
        // company: "Self-Practice",
      };

      console.log("Creating interview...", interviewParams);
      const interviewRes = await createInterview(interviewParams);
      console.log("Interview response:", interviewRes);

      // Axios interceptor unwraps: response.data.data → response.data
      // interviewApi.ts returns: res.data (the unwrapped object)
      // So interviewRes IS the interview object directly
      const interview = interviewRes;

      console.log("Extracted interview:", interview);

      if (!interview?.id) {
        console.error("No interview ID found:", interview);
        throw new Error("Failed to create interview - no ID returned");
      }

      // 2. Start Session
      console.log("Starting session for interview:", interview.id);
      const sessionRes = await startInterviewSession(interview.id);
      console.log("Session response:", sessionRes);

      // Same: sessionRes IS the session object directly
      const session = sessionRes;

      console.log("Extracted session:", session);

      if (!session?.id) {
        console.error("No session ID found:", session);
        throw new Error("Failed to start session - no ID returned");
      }

      console.log("✅ Session created successfully:", session.id);

      // 3. Navigate
      navigate("/interview/qna", {
        state: {
          role,
          experience,
          focusArea,
          interviewId: interview.id,
          sessionId: session.id,
          session
        }
      });
    } catch (err: unknown) {
      const error = err as AxiosError<{ error?: { message?: string } }>;
      console.error("❌ Start Error:", error);
      console.error("Error details:", error.response?.data || error.message);
      alert(`Failed to start interview session: ${error.response?.data?.error?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 6,
          borderRadius: 4,
          background: "linear-gradient(135deg, #ffffff 0%, #fff5f8 100%)", // Light pink/red tint for Interview theme
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box textAlign="center" mb={6}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "secondary.light",
              color: "secondary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 3,
            }}
          >
            <SettingsVoiceIcon sx={{ fontSize: 40, color: "#fff" }} />
          </Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom color="text.primary">
            Interview Simulator
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Customize your session to practice exactly what you need.
          </Typography>
        </Box>

        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={4}>
            {/* Role Selection */}
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                label="Target Role"
                fullWidth
                value={role}
                onChange={(e) => setRole(e.target.value)}
                variant="outlined"
                helperText="Select the job position you are applying for"
              >
                <MenuItem value="Frontend Developer">Frontend Developer</MenuItem>
                <MenuItem value="Backend Developer">Backend Developer</MenuItem>
                <MenuItem value="Full Stack Developer">Full Stack Developer</MenuItem>
                <MenuItem value="DevOps Engineer">DevOps Engineer</MenuItem>
                <MenuItem value="Product Manager">Product Manager</MenuItem>
                <MenuItem value="UI/UX Designer">UI/UX Designer</MenuItem>
              </TextField>
            </Grid>

            {/* Experience Level */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="experience-label">Experience Level</InputLabel>
                <Select
                  labelId="experience-label"
                  value={experience}
                  label="Experience Level"
                  onChange={(e: SelectChangeEvent) => setExperience(e.target.value)}
                >
                  <MenuItem value="Intern">Intern (0-1 years)</MenuItem>
                  <MenuItem value="Junior">Junior (1-3 years)</MenuItem>
                  <MenuItem value="Mid-Level">Mid-Level (3-5 years)</MenuItem>
                  <MenuItem value="Senior">Senior (5+ years)</MenuItem>
                  <MenuItem value="Lead">Lead / Manager</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Focus Area */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="focus-label">Focus Area</InputLabel>
                <Select
                  labelId="focus-label"
                  value={focusArea}
                  label="Focus Area"
                  onChange={(e: SelectChangeEvent) => setFocusArea(e.target.value)}
                >
                  <MenuItem value="Technical Skills">Technical Coding Questions</MenuItem>
                  <MenuItem value="System Design">System Design & Architecture</MenuItem>
                  <MenuItem value="Behavioral">Behavioral (Culture Fit)</MenuItem>
                  <MenuItem value="Mixed">Mixed (All Categories)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="center" mt={6}>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              onClick={handleStart}
              disabled={isLoading}
              startIcon={isLoading ? null : <PlayArrowIcon />}
              sx={{
                px: 8,
                py: 1.5,
                fontSize: "1.2rem",
                borderRadius: 3,
                fontWeight: "bold",
                boxShadow: "0 8px 16px rgba(220, 0, 78, 0.2)",
                "&:hover": {
                  boxShadow: "0 12px 20px rgba(220, 0, 78, 0.3)",
                  transform: "translateY(-2px)"
                },
                transition: "all 0.2s"
              }}
            >
              {isLoading ? "Starting..." : "Start Session"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default InterviewStart;
