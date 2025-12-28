import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Paper,
    Box,
    Chip,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";
import { listInterviews } from "../../services/interviewApi";
import type { Interview } from "../../api/types";

const InterviewHistory: React.FC = () => {
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await listInterviews();
                // Axios wraps response in data.data usually, assuming our api interceptor handles it or we do it here.
                // check response structure from interviewApi.ts -> it returns res.data.
                // If res.data is { status: "success", data: [...] } or just [...]
                // Based on controller: return ok(res, interviews) -> { status: "success", data: interviews }
                // So here response might be the full object or just data depending on previous usage.
                // Let's safe check.
                const data = (response as any).data || response;
                if (Array.isArray(data)) {
                    setInterviews(data);
                }
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleViewResults = (interview: Interview) => {
        // If we have sessions, pick the latest one
        if (interview.sessions && interview.sessions.length > 0) {
            const lastSession = interview.sessions[0];
            // If it is finished, go to results. If started, maybe go to qna?
            if (lastSession.status === "FINISHED") {
                navigate("/interview/results", { state: { sessionId: lastSession.id } });
            } else {
                // Resume functionality not fully tested yet, but we can try redirecting to QnA
                // QnA needs: role, experience, focusArea, sessionId, session?
                // It might need to fetch session first. 
                // For now, let's just send them to results if finished.
                navigate("/interview/results", { state: { sessionId: lastSession.id } });
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Interview History
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Review your past interview sessions, scores, and feedback.
                </Typography>
            </Box>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : interviews.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: "center" }}>
                    <Typography>No interviews found.</Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/interview/start")}
                    >
                        Start New Interview
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    <Table>
                        <TableHead sx={{ bgcolor: "background.default" }}>
                            <TableRow>
                                <TableCell>Role / Company</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Score</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {interviews.map((interview) => {
                                const session = interview.sessions?.[0];
                                const score = session?.score;
                                const date = new Date(interview.createdAt).toLocaleDateString();

                                return (
                                    <TableRow key={interview.id} hover>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {interview.role || interview.title}
                                                </Typography>
                                                {interview.company && (
                                                    <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                                                        <BusinessIcon sx={{ fontSize: 16 }} />
                                                        <Typography variant="caption">{interview.company}</Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                                                <CalendarTodayIcon sx={{ fontSize: 16 }} />
                                                <Typography variant="body2">{date}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={session ? (session.status === "FINISHED" ? "Completed" : "In Progress") : "Not Started"}
                                                size="small"
                                                color={session ? (session.status === "FINISHED" ? "success" : "warning") : "default"}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {score ? (
                                                <Typography fontWeight="bold" color={score >= 70 ? "success.main" : "warning.main"}>
                                                    {score}/100
                                                </Typography>
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {session ? (
                                                <Box display="flex" justifyContent="flex-end" gap={1}>
                                                    {/* Always allow viewing results if session exists, or at least try */}
                                                    <Tooltip title="View Results">
                                                        <IconButton onClick={() => handleViewResults(interview)} color="primary">
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                    {session.status !== "FINISHED" && (
                                                        <Tooltip title="Resume Interview">
                                                            <IconButton
                                                                onClick={() => navigate("/interview/qna", {
                                                                    state: {
                                                                        sessionId: session.id,
                                                                        interviewId: interview.id, // Ensure we pass necessary state
                                                                        role: interview.role || "Software Engineer", // Fallback
                                                                        company: interview.company || "Google"
                                                                    }
                                                                })}
                                                                color="warning"
                                                            >
                                                                <PlayArrowIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">No Session</Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default InterviewHistory;
