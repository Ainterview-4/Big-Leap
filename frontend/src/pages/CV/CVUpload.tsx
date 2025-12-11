import React, { useState, useRef } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    CircularProgress,
    Fade,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { uploadCVRequest } from "../../api/cv";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CVUpload: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState<string | null>(null); // Removed in favor of toast
    const [success, setSuccess] = useState(false);

    // Handle file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];

            // Validate PDF
            if (selectedFile.type !== "application/pdf") {
                toast.error("Please upload a valid PDF file.");
                setFile(null);
                return;
            }

            setFile(selectedFile);
            // setError(null);
            setSuccess(false);
        }
    };

    // Trigger file input click
    const handleBoxClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle Upload
    const handleUpload = async () => {
        if (!file) return;

        try {
            setLoading(true);
            // setError(null);

            await uploadCVRequest(file);

            toast.success("CV Uploaded Successfully!");
            setSuccess(true);
            // Navigate to result page
            setTimeout(() => {
                navigate("/cv/result", { state: { filename: file.name } });
            }, 1000);

        } catch (err: unknown) {
            console.error(err);
            toast.error("Failed to upload CV. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 6,
                    borderRadius: 4,
                    textAlign: "center",
                    background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
                }}
            >
                <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
                    Upload Your CV
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                    To start your AI interview preparation, please upload your resume (PDF only).
                </Typography>

                {/* Error Alert Removed */}

                {/* Upload Area */}
                <Box
                    onClick={loading ? undefined : handleBoxClick}
                    sx={{
                        border: "2px dashed",
                        borderColor: file ? "success.main" : "primary.main",
                        borderRadius: 3,
                        p: 6,
                        cursor: loading ? "default" : "pointer",
                        backgroundColor: file ? "action.hover" : "background.paper",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                            borderColor: loading ? "primary.main" : "secondary.main",
                            backgroundColor: loading ? "background.paper" : "action.selected",
                            transform: loading ? "none" : "scale(1.01)",
                        },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "250px",
                    }}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />

                    {loading ? (
                        <CircularProgress size={60} thickness={4} />
                    ) : success ? (
                        <Fade in>
                            <Box textAlign="center">
                                <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                                <Typography variant="h5" color="success.main">
                                    Upload Successful!
                                </Typography>
                            </Box>
                        </Fade>
                    ) : (
                        <>
                            <CloudUploadIcon
                                color={file ? "success" : "disabled"}
                                sx={{ fontSize: 80, mb: 2, color: file ? undefined : "primary.light" }}
                            />
                            <Typography variant="h6" color="text.primary">
                                {file ? file.name : "Click or Drag to Upload PDF"}
                            </Typography>
                            {!file && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                    Maximum file size: 5MB
                                </Typography>
                            )}
                        </>
                    )}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
                    {file && !success && (
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleUpload}
                            disabled={loading}
                            sx={{
                                px: 5,
                                py: 1.5,
                                borderRadius: 2,
                                fontSize: "1.1rem",
                                textTransform: "none",
                            }}
                        >
                            {loading ? "Uploading..." : "Start Analysis"}
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default CVUpload;
