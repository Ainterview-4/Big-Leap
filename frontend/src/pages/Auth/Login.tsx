import React from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { AxiosError } from "axios";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { loginRequest } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Divider } from "@mui/material";

// --- Form tipi ---
type FormValues = {
  email: string;
  password: string;
};

// --- Validasyon şeması ---
const schema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  // --- Form submit ---
  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      setServerError(null);

      const response = await loginRequest(data);
      // Backend sends { success: true, data: { token: ... } }
      const loginData = response.data?.data;

      if (loginData?.token) {
        localStorage.setItem("token", loginData.token);
        navigate("/dashboard");
      } else {
        setServerError("Login failed. Please try again.");
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      let message =
        axiosError?.response?.data?.message ||
        "Login failed. Please check your credentials.";

      // Frontend translation for backend Turkish errors
      if (message === "Geçersiz email veya şifre") {
        message = "Invalid email or password";
      } else if (message === "Email ve şifre gerekli") {
        message = "Email and password are required";
      }

      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={2}>
          Login
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />


          {/* Giriş Yap Butonu */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Divider sx={{ my: 3, color: "text.secondary" }}>OR</Divider>

          <Box display="flex" flexDirection="column" gap={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => console.log("Google Login clicked")}
              sx={{
                textTransform: "none",
                borderColor: "divider",
                color: "text.primary",
                "&:hover": { bgcolor: "action.hover", borderColor: "text.primary" }
              }}
            >
              Login with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHubIcon />}
              onClick={() => console.log("GitHub Login clicked")}
              sx={{
                textTransform: "none",
                borderColor: "divider",
                color: "text.primary",
                "&:hover": { bgcolor: "action.hover", borderColor: "text.primary" }
              }}
            >
              Login with GitHub
            </Button>
          </Box>

          {/* Şifremi Unuttum */}
          <Button
            fullWidth
            sx={{ mt: 3 }}
            variant="text"
            onClick={() => navigate("/auth/reset-password")}
          >
            Forgot Password?
          </Button>

          {/* Kayıt Ol */}
          <Button
            fullWidth
            sx={{ mt: 1 }}
            variant="text"
            onClick={() => navigate("/auth/register")}
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
