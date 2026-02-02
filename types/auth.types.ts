export type Sex = 'male' | 'female' | 'other';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  barangay: string;
  birthdate: string;
  sex: Sex;
  isSeniorOrPwd: boolean;
  createdAt: string;
};

export type RegisterInput = {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  barangay: string;
  birthdate: string;
  sex: Sex;
  isSeniorOrPwd: boolean;
  pin: string;
};

export type LoginInput = {
  phone: string;
  pin: string;
};

export type VerifyOtpInput = {
  phone: string;
  otp: string;
};
