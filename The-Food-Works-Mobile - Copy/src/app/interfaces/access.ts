/* eslint-disable @typescript-eslint/naming-convention */
export interface IUser {
  Token?: string;
  EmailAddress: string;
  Password: string;
  Name?: string;
}

export interface IAuthResponse {
  userID: string;
  displayName: string;
  token: string;
  expiresIn: string;
  userRole: string;
}

export interface ICustomer {
  CustomerID?: number;
  CustomerName: string;
  CustomerSurname: string;
  CustomerDob: Date;
  CustomerTelephone: string;
  CustomerEmail?: string;
  IsLoyaltyProgram: boolean;
  StreetNumber: string;
  StreetName: string;
  City: string;
  PostalCode: string;
  Province: string;
  Lat: number;
  Lng: number;
  Password?: string;
}

export interface IResetPassword {
  CustomerID: number;
  CurrentPassword: string;
  NewPassword: string;
  email: string;
  ConfirmPassword: string;
}

export interface IResetForgottenPassword {
  email: string;
  NewPassword: string;
}
