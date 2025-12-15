import api from "./axiosInstance";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const registerRequest = (payload: RegisterPayload) =>
  api.post("/auth/register", payload);


export interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const loginRequest = (payload: LoginPayload) => {
  return api.post<LoginResponse>("/auth/login", payload);
};

export interface ResetPasswordPayload {
  email: string;
}

export const resetPasswordRequest = (payload: ResetPasswordPayload) => {
  return api.post<{ message: string }>("/auth/reset-password", payload);
};
