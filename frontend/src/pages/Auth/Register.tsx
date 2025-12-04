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

import { registerRequest } from "../../api/auth";
import { useNavigate } from "react-router-dom";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object({
  name: yup.string().required("İsim gerekli"),
  email: yup
    .string()
    .email("Geçerli bir email girin")
    .required("Email gerekli"),
  password: yup
    .string()
    .min(6, "Şifre en az 6 karakter olmalı")
    .required("Şifre gerekli"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Şifreler uyuşmuyor")
    .required("Şifre tekrarı gerekli"),
});

const Register: React.FC = () => {
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

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      setServerError(null);

      await registerRequest({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // Kayıt başarılı -> login ekranına yönlendir
      navigate("/auth/login");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message =
        axiosError?.response?.data?.message ||
        "Kayıt yapılamadı. Bilgilerinizi kontrol edin.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={2}>
          Kayıt Ol
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="İsim"
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Şifre"
            type="password"
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            fullWidth
            label="Şifre Tekrar"
            type="password"
            margin="normal"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
          </Button>

          <Button
            fullWidth
            sx={{ mt: 1 }}
            variant="text"
            onClick={() => navigate("/auth/login")}
          >
            Zaten hesabın var mı? Giriş Yap
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
