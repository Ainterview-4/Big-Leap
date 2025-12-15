import React, { useState } from "react";
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    Avatar,
    Divider,
    Switch,
    Alert,
    useTheme,
    alpha
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useColorMode } from "../../theme/ThemeContext";

const Profile: React.FC = () => {
    const theme = useTheme();
    const { mode, toggleColorMode } = useColorMode();
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Mock User Data
    const [formData, setFormData] = useState({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = () => {
        // API Call Simulation
        setSuccessMsg("Profile information updated successfully.");
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    const handlePasswordChange = () => {
        // Password Change Simulation
        setSuccessMsg("Password changed successfully.");
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Settings & Profile
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your account settings and preferences.
                </Typography>
            </Box>

            {successMsg && (
                <Alert severity="success" sx={{ mb: 4 }}>
                    {successMsg}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Left Column: General Info */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            textAlign: "center",
                            borderRadius: 4,
                            border: "1px solid",
                            borderColor: "divider",
                            background: alpha(theme.palette.background.paper, 0.6),
                            backdropFilter: "blur(20px)",
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                margin: "0 auto",
                                mb: 2,
                                bgcolor: theme.palette.primary.main,
                                fontSize: "2.5rem",
                            }}
                        >
                            {formData.firstName[0]}
                            {formData.lastName[0]}
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">
                            {formData.firstName} {formData.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {formData.email}
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Box textAlign="left">
                            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                                Appearance
                            </Typography>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box display="flex" alignItems="center" gap={1}>
                                    {mode === 'dark' ? <DarkModeIcon color="primary" /> : <LightModeIcon color="warning" />}
                                    <Typography variant="body2">Dark Mode</Typography>
                                </Box>
                                <Switch
                                    checked={mode === 'dark'}
                                    onChange={toggleColorMode}
                                    color="primary"
                                />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Column: Forms */}
                <Grid size={{ xs: 12, md: 8 }}>
                    {/* Personal Information */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            mb: 4,
                            borderRadius: 4,
                            border: "1px solid",
                            borderColor: "divider",
                            background: alpha(theme.palette.background.paper, 0.6),
                            backdropFilter: "blur(20px)",
                        }}
                    >
                        <Box display="flex" alignItems="center" mb={3}>
                            <PersonIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6" fontWeight="bold">
                                Personal Information
                            </Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled
                                    helperText="Email cannot be changed."
                                />
                            </Grid>
                        </Grid>
                        <Box mt={3} display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSaveProfile}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    </Paper>

                    {/* Change Password */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            border: "1px solid",
                            borderColor: "divider",
                            background: alpha(theme.palette.background.paper, 0.6),
                            backdropFilter: "blur(20px)",
                        }}
                    >
                        <Box display="flex" alignItems="center" mb={3}>
                            <LockIcon color="secondary" sx={{ mr: 1 }} />
                            <Typography variant="h6" fontWeight="bold">
                                Change Password
                            </Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Current Password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="New Password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                        <Box mt={3} display="flex" justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handlePasswordChange}
                            >
                                Update Password
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;
