import React from "react";
import { Box, Container, Typography, IconButton, Stack, useTheme, alpha } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

const Footer: React.FC = () => {
    const theme = useTheme();

    return (
        <Box
            component="footer"
            sx={{
                py: 4,
                px: 2,
                mt: "auto",
                backgroundColor: alpha(theme.palette.background.paper, 0.4),
                backdropFilter: "blur(20px)",
                borderTop: "1px solid",
                borderColor: "divider",
            }}
        >
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={3}
                >
                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                mb: 1,
                            }}
                        >
                            PrePath AI
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            © {new Date().getFullYear()} PrePath AI. All rights reserved.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <IconButton
                            aria-label="GitHub"
                            color="inherit"
                            sx={{
                                color: "text.secondary",
                                transition: "all 0.2s",
                                "&:hover": { color: theme.palette.primary.main, transform: "translateY(-2px)" },
                            }}
                        >
                            <GitHubIcon />
                        </IconButton>
                        <IconButton
                            aria-label="LinkedIn"
                            color="inherit"
                            sx={{
                                color: "text.secondary",
                                transition: "all 0.2s",
                                "&:hover": { color: "#0077b5", transform: "translateY(-2px)" },
                            }}
                        >
                            <LinkedInIcon />
                        </IconButton>
                        <IconButton
                            aria-label="Twitter"
                            color="inherit"
                            sx={{
                                color: "text.secondary",
                                transition: "all 0.2s",
                                "&:hover": { color: "#1DA1F2", transform: "translateY(-2px)" },
                            }}
                        >
                            <TwitterIcon />
                        </IconButton>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;
