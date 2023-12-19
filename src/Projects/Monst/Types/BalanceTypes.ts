import { ObjectId, Types } from "mongoose";
import { ICurrencyTypes } from "./CurrencyTypes";

export type IAccount = {
  _id: string;
  totalBalance: number;
  wallet: Types.Array<Types.ObjectId>;
  defaultCurrency: ICurrencyTypes;
  id: string;
};
