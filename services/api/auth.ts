import { api } from './client';
import type { User, RegisterInput, LoginInput, VerifyOtpInput } from '@/types';

export type RegisterResponse = { userId: string; message: string };
export type VerifyOtpResponse = { token: string; user: User };
export type LoginResponse = { token: string; user: User };

export async function requestOtp(phone: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/request-otp', { phone });
  return data;
}

export async function register(input: RegisterInput): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>('/auth/register', input);
  return data;
}

export async function verifyOtp(input: VerifyOtpInput): Promise<VerifyOtpResponse> {
  const { data } = await api.post<VerifyOtpResponse>('/auth/verify-otp', input);
  return data;
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', input);
  return data;
}

export async function getProfile(): Promise<User> {
  const { data } = await api.get<User>('/user/profile');
  return data;
}
