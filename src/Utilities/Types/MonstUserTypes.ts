import { ICurrencyTypes } from "./MonstCommonTypes";

export type ICreateUserProp = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  defaultCurrency: ICurrencyTypes;
  avatarUrl: string;
  avatar?: File;
};
