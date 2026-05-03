// types/index.ts
export type Sex = "male" | "female" | "other";

export interface RegisterInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  email?: string;
  barangay: string;
  birthdate: string;
  sex: Sex;
  isSeniorOrPwd?: boolean;
  pin: string;
}

export interface User {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  email: string;
  barangay?: string;
  account_status?: string;
}

export interface ChatMessage {
  role: "assistant" | "user" | "system";
  content: string;
  timestamp: string;
}

export interface LoginInput {
  phone: string;
  pin: string;
}

export interface VerifyOtpInput {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  data: {
    token: string;
    user: User;
  };
  message?: string;
}

export interface RegisterResponse extends AuthResponse {}
