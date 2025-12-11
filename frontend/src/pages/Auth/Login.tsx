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

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        setServerError("Login failed. Please try again.");
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message =
        axiosError?.response?.data?.message ||
        "Login failed. Please check your credentials.";
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

          {/* Şifremi Unuttum */}
          <Button
            fullWidth
            sx={{ mt: 1 }}
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
