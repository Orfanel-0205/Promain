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

  // Unwrap nested API envelopes:
  // - { ...actual }
  // - { data: ...actual }
  // - { data: { data: ...actual } }
  let current = payload;
  while (
    current &&
    typeof current === "object" &&
    "data" in current &&
    current.data !== undefined
  ) {
    current = current.data;
  }
  return current as T;
}

export async function requestOtp(phone: string): Promise<{ message: string }> {
  const payloadVariants = [{ phone }, { mobile: phone }];
  let lastError: unknown;
  for (const payload of payloadVariants) {
    try {
      const { data } = await api.post<{ message: string }>("/resend-otp", payload);
      return normalizeApiPayload(data);
    } catch (error: unknown) {
      lastError = error;
    }
  }
  throw lastError;
}

export async function register(
  input: RegisterInput,
): Promise<RegisterResponse> {
  const payloadVariants = [
    input,
    {
      mobile: input.phone,
      name: `${input.firstName} ${input.lastName}`.trim(),
      password: input.pin,
    },
    {
      phone: input.phone,
      name: `${input.firstName} ${input.lastName}`.trim(),
      password: input.pin,
    },
  ];

  let lastError: unknown;
  for (const payload of payloadVariants) {
    try {
      const { data } = await api.post<
        RegisterResponse | { data: RegisterResponse }
      >("/register", payload);
      return normalizeApiPayload(data);
    } catch (error: unknown) {
      lastError = error;
    }
  }
  throw lastError;
}

export async function verifyOtp(
  input: VerifyOtpInput,
): Promise<VerifyOtpResponse> {
  const payloadVariants = [
    { phone: input.phone, otp: input.otp },
    { mobile: input.phone, otp: input.otp },
    { phone: input.phone, code: input.otp },
    { mobile: input.phone, code: input.otp },
  ];
  let lastError: unknown;
  for (const payload of payloadVariants) {
    try {
      const { data } = await api.post<
        VerifyOtpResponse | { data: VerifyOtpResponse }
      >("/verify-otp", payload);
      return normalizeApiPayload(data);
    } catch (error: unknown) {
      lastError = error;
    }
  }
  throw lastError;
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const payloadVariants = [
    { phone: input.phone, pin: input.pin },
    { mobile: input.phone, pin: input.pin },
    { phone: input.phone, password: input.pin },
    { mobile: input.phone, password: input.pin },
  ];

  let lastError: unknown;
  for (const payload of payloadVariants) {
    try {
      const { data } = await api.post<LoginResponse | { data: LoginResponse }>(
        "/login",
        payload,
      );
      return normalizeApiPayload(data);
    } catch (error: unknown) {
      lastError = error;
    }
  }

  throw lastError;
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get<User>("/me");
  return normalizeApiPayload(data);
}
