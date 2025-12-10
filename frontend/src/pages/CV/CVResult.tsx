import React from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import AssignmentIcon from "@mui/icons-material/Assignment";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useNavigate, useLocation } from "react-router-dom";

const CVResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const filename = location.state?.filename || "my-cv.pdf";

  // Mock data - in a real app this would come from the backend/state
  const analysisResults = [
    "Resume parsed successfully.",
    "Detected 5 years of experience in Frontend Development.",
    "Strong skills in React, TypeScript, and Node.js.",
    "Ready for technical interview generation.",
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 6,
          borderRadius: 4,
          background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
        }}
      >
        <Box textAlign="center" mb={4}>
          <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            CV Analysis Complete
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your resume has been processed. Here is what we found:
          </Typography>
        </Box>

        {/* Uploaded Files Section */}
        <Box sx={{ mb: 4, p: 3, border: "1px solid #e0e0e0", borderRadius: 2, bgcolor: "#fff" }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <UploadFileIcon color="primary" /> Uploaded Files
          </Typography>
          <List dense>
            <ListItem sx={{ bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <ListItemIcon>
                <PictureAsPdfIcon color="error" />
              </ListItemIcon>
              <ListItemText primary={filename} secondary="Uploaded just now" />
            </ListItem>
          </List>
          <Button
            variant="outlined"
            size="small"
            startIcon={<UploadFileIcon />}
            onClick={() => navigate("/cv/upload")}
            sx={{ mt: 2 }}
          >
            Upload New File
          </Button>
        </Box>

        <Box sx={{ mb: 4, bgcolor: "background.paper", borderRadius: 2, p: 2, boxShadow: 1 }}>
          <Typography variant="h6" sx={{ mb: 2, px: 2 }}>Analysis Details</Typography>
          <List>
            {analysisResults.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <AssignmentIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
                {index < analysisResults.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Box>

        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            size="large"
            endIcon={<AutoFixHighIcon />}
            onClick={() => navigate("/cv/optimize")}
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: 2,
              fontSize: "1.1rem",
              textTransform: "none",
              mr: 2,
              background: "linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)",
            }}
          >
            Optimize CV with AI
          </Button>

          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/interview/start")}
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: 2,
              fontSize: "1.1rem",
              textTransform: "none",
            }}
          >
            Skip to Interview
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CVResult;
