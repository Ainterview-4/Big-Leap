import React, { useState, useEffect } from "react";
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
import { listMyCVs } from "../../api/cv";
import { AxiosError } from "axios";
import type { CV } from "../../api/types";

const InterviewStart: React.FC = () => {
  const navigate = useNavigate();

  // State for form fields
  const [role, setRole] = useState("Software Engineer");
  const [company, setCompany] = useState("Google");
  const [experience, setExperience] = useState("Mid-Level");
  const [difficulty, setDifficulty] = useState("Medium");

  const [cvList, setCvList] = useState<CV[]>([]);
  const [selectedCvId, setSelectedCvId] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  // Load CVs on mount
  useEffect(() => {
    const loadCVs = async () => {
      try {
        const res = await listMyCVs();
        // Adjust based on your API response wrapper
        // listMyCVs returns Promise<AxiosResponse<CV[]>> BUT our axiosInstance might intercept.
        // Let's assume standard axios response
        const data = res.data;
        if (Array.isArray(data)) {
          setCvList(data);
          // Auto-select first CV if available
          if (data.length > 0) {
            setSelectedCvId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load CVs", err);
      }
    };
    loadCVs();
  }, []);

  /* 
   * Updated handleStart to integrate with backend API
   */
  const handleStart = async () => {
    try {
      setIsLoading(true);

      if (!selectedCvId) {
        alert("Please upload or select a CV first.");
        return;
      }

      // 1. Create Interview
      const interviewParams = {
        title: `${role} Interview at ${company}`,
        role,
        level: experience,
        difficulty,
        company,
        cvId: selectedCvId
      };

      console.log("Creating interview...", interviewParams);
      const interviewRes = await createInterview(interviewParams);
      console.log("Interview response:", interviewRes);

      // Axios interceptor unwraps: response.data.data → response.data
      const interview = interviewRes;

      if (!interview?.id) {
        throw new Error("Failed to create interview - no ID returned");
      }

      // 2. Start Session
      console.log("Starting session for interview:", interview.id);
      const sessionRes = await startInterviewSession(interview.id);
      console.log("Session response:", sessionRes);

      // Backend returns { sessionId, question } inside sessionRes
      // sessionRes is likely { status: "success", data: { sessionId, question } } OR just data if unwrapped
      const sessionData = sessionRes;

      if (!sessionData?.sessionId) {
        throw new Error("Failed to start session - no ID returned");
      }

      console.log("✅ Session created successfully:", sessionData.sessionId);

      // 3. Navigate
      navigate("/interview/qna", {
        state: {
          role,
          experience,
          company,
          interviewId: interview.id,
          sessionId: sessionData.sessionId, // Correct ID
          session: sessionData // Pass full object containing initial question
        }
      });
    } catch (err: unknown) {
      const error = err as AxiosError<{ error?: { message?: string } }>;
      console.error("❌ Start Error:", error);
      alert(`Failed to start interview session: ${error.response?.data?.error?.message || (error as any).message}`);
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
            {/* CV Selection */}
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                label="Select CV"
                fullWidth
                value={selectedCvId}
                onChange={(e) => setSelectedCvId(e.target.value)}
                variant="outlined"
                helperText="Select the CV you want the interviewer to focus on"
                error={cvList.length === 0}
              >
                {cvList.length > 0 ? (
                  cvList.map((cv) => (
                    <MenuItem key={cv.id} value={cv.id}>
                      {cv.fileName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No CVs found. Please upload one first.
                  </MenuItem>
                )}
              </TextField>
            </Grid>

            {/* Role Selection */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Target Role"
                fullWidth
                value={role}
                onChange={(e) => setRole(e.target.value)}
                variant="outlined"
                helperText="Select the job position you are applying for"
              >
                <MenuItem value="Software Engineer">Software Engineer</MenuItem>
                <MenuItem value="Frontend Developer">Frontend Developer</MenuItem>
                <MenuItem value="Backend Developer">Backend Developer</MenuItem>
                <MenuItem value="Full Stack Developer">Full Stack Developer</MenuItem>
                <MenuItem value="DevOps Engineer">DevOps Engineer</MenuItem>
                <MenuItem value="Product Manager">Product Manager</MenuItem>
                <MenuItem value="Data Scientist">Data Scientist</MenuItem>
              </TextField>
            </Grid>

            {/* Company Selection */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Target Company"
                fullWidth
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                variant="outlined"
                helperText="Select the company style you want to practice"
              >
                <MenuItem value="Google">Google</MenuItem>
                <MenuItem value="Amazon">Amazon</MenuItem>
                <MenuItem value="Meta">Meta</MenuItem>
                <MenuItem value="Microsoft">Microsoft</MenuItem>
                <MenuItem value="IBM">IBM</MenuItem>
                <MenuItem value="Cisco">Cisco</MenuItem>
                <MenuItem value="Apple">Apple</MenuItem>
                <MenuItem value="Netflix">Netflix</MenuItem>
                <MenuItem value="Tesla">Tesla</MenuItem>
                <MenuItem value="OpenAI">OpenAI</MenuItem>
                <MenuItem value="Oracle">Oracle</MenuItem>
                <MenuItem value="Salesforce">Salesforce</MenuItem>
                <MenuItem value="Uber">Uber</MenuItem>
                <MenuItem value="Adobe">Adobe</MenuItem>
                <MenuItem value="Spotify">Spotify</MenuItem>
                <MenuItem value="Airbnb">Airbnb</MenuItem>
                <MenuItem value="Intel">Intel</MenuItem>
                <MenuItem value="Nvidia">Nvidia</MenuItem>
                <MenuItem value="General">General / Other</MenuItem>
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

            {/* Difficulty */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="difficulty-label">Difficulty</InputLabel>
                <Select
                  labelId="difficulty-label"
                  value={difficulty}
                  label="Difficulty"
                  onChange={(e: SelectChangeEvent) => setDifficulty(e.target.value)}
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
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
              disabled={isLoading || !selectedCvId}
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
