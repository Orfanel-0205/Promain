import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
  VerifyOtpInput,
} from "@/types";
import { api } from "./client";

export type RegisterResponse = AuthResponse;
export type VerifyOtpResponse = { token: string; user: User };
export type LoginResponse = { token: string; user: User };

function normalizeApiPayload<T>(payload: any): T {
  if (!payload || typeof payload !== "object") {
    return payload as T;
  }

  // Backend may return either:
  // - { token, user }
  // - { data: { token, user } }
  // - { data: { data: { token, user } } }
  if (payload.data && payload.data.data !== undefined) {
    return payload.data as T;
  }
  if (payload.data && payload.data.token !== undefined) {
    return payload.data as T;
  }
  return payload as T;
}

export async function requestOtp(phone: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/resend-otp", {
    phone,
  });
  return normalizeApiPayload(data);
}

export async function register(
  input: RegisterInput,
): Promise<RegisterResponse> {
  const { data } = await api.post<
    RegisterResponse | { data: RegisterResponse }
  >("/register", input);
  return normalizeApiPayload(data);
}

export async function verifyOtp(
  input: VerifyOtpInput,
): Promise<VerifyOtpResponse> {
  const { data } = await api.post<
    VerifyOtpResponse | { data: VerifyOtpResponse }
  >("/verify-otp", input);
  return normalizeApiPayload(data);
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse | { data: LoginResponse }>(
    "/login",
    input,
  );
  return normalizeApiPayload(data);
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get<User>("/me");
  return data;
}
