import { ICurrencyTypes } from "./CurrencyTypes";

export type IUserMain = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  defaultCurrency: ICurrencyTypes;
  avatarUrl: string;
};
export type IUser = {
  _id: string;
  email: string;
  firebaseUID: string;
  lastSignIn: Date;
  level: number;
  points: number;
  createdAt: number;
  updatedAt: number;
  id: string;
} & IUserMain;

export type IUserCreateUpdateRequest = {
  avatar?: File;
} & IUserMain;
