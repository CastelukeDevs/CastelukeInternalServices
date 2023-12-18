import { ICurrencyTypes } from "./CurrencyTypes";

export type IUser = {
  _id: string;
  email: string;
  firebaseUID: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  avatarUrl?: string;
  lastSignIn: Date;
  level: number;
  points: number;
  createdAt: number;
  updatedAt: number;
  id: string;
};

export type ICreateUserRequest = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  defaultCurrency: ICurrencyTypes;
  avatarUrl: string;
  avatar?: File;
};
