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
    .email("Geçerli bir email girin")
    .required("Email gerekli"),
  password: yup.string().required("Şifre gerekli"),
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
        navigate("/cv/upload");
      } else {
        setServerError("Giriş başarısız. Tekrar deneyin.");
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message =
        axiosError?.response?.data?.message ||
        "Giriş yapılamadı. Bilgilerinizi kontrol edin.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={2}>
          Giriş Yap
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
            label="Şifre"
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
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>

          {/* Şifremi Unuttum */}
          <Button
            fullWidth
            sx={{ mt: 1 }}
            variant="text"
            onClick={() => navigate("/auth/reset-password")}
          >
            Şifremi Unuttum
          </Button>

          {/* Kayıt Ol */}
          <Button
            fullWidth
            sx={{ mt: 1 }}
            variant="text"
            onClick={() => navigate("/auth/register")}
          >
            Hesabın yok mu? Kayıt Ol
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
