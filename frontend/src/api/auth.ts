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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: any;
}

export const registerRequest = (payload: RegisterPayload) =>
  api.post<ApiResponse<any>>("/auth/register", payload);


export interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const loginRequest = (payload: LoginPayload) => {
  return api.post<ApiResponse<LoginResponse>>("/auth/login", payload);
};

export interface ResetPasswordPayload {
  email: string;
}

export const resetPasswordRequest = (payload: ResetPasswordPayload) => {
  return api.post<ApiResponse<{ message: string }>>("/auth/reset-password", payload);
};
