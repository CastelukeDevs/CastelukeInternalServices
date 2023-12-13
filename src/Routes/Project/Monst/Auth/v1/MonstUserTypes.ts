import { ICurrencyTypes } from "../../../../../Utilities/Types/MonstCommonTypes";

export type ICreateUserProp = {
  firstName: string;
  lastName: string;
  DOB: string;
  defaultCurrency: ICurrencyTypes;
  avatarUrl: string;
};
