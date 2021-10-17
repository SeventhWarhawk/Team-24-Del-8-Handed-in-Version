export interface User {
  Token?: string;
  EmailAddress: string;
  Password: string;
  displayName?: string;
  BranchId?: number;
  Name?: string;
  employeeId?: number;
  branchId?: number;
}

export interface UserInfo {
  emailAddress: string;
  displayName: string;
  branchId?: number;
  branchName: string;
  employeeId?: number;
  customerId?: number;
  roles: string[];
}
export interface ResetPassword {

  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetForgottenPassword {

  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserRole {
  name: string;
  ID?: number;
  description: string;
}

export interface ForgotPassword {
  Email: string;
}
export interface OTP {
  user: string;
  OTP: number;
}
