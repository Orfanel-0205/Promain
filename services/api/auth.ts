// services/api/auth.ts
import type { LoginInput, RegisterInput, User, VerifyOtpInput } from "@/types";
import { api } from "./client";

export type RegisterResponse = { userId: string; message: string };
export type VerifyOtpResponse = { token: string; user: User };
export type LoginResponse = { token: string; user: User };

export async function requestOtp(phone: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/resend-otp", {
    phone,
  }); // Using resend-otp as request-otp in backend
  return data;
}

export async function register(
  input: RegisterInput,
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/register", input);
  return data;
}

export async function verifyOtp(
  input: VerifyOtpInput,
): Promise<VerifyOtpResponse> {
  const { data } = await api.post<VerifyOtpResponse>("/verify-otp", input);
  return data;
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/login", input);
  return data;
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get<User>("/v1/me");
  return data;
}
