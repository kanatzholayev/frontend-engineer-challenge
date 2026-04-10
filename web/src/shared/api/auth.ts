import { http } from './http';

export type RegisterPayload = {
  email: string;
  password: string;
  displayName: string;
};

export type RegisterResponse = { userId: string };

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await http.post<RegisterResponse>('/v1/register', payload);
  return data;
}

export type LoginPayload = { email: string; password: string };

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>('/v1/login', payload);
  return data;
}

export type ForgotPasswordPayload = { email: string };

export type ForgotPasswordResponse = { success: boolean };

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> {
  const { data } = await http.post<ForgotPasswordResponse>('/v1/forgot-password', payload);
  return data;
}

export type ResetPasswordPayload = { token: string; newPassword: string };

export type ResetPasswordResponse = { success: boolean };

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> {
  const { data } = await http.post<ResetPasswordResponse>('/v1/reset-password', payload);
  return data;
}
