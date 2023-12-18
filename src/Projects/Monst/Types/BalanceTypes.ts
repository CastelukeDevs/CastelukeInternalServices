import { ObjectId, Types } from "mongoose";
import { ICurrencyTypes } from "./CurrencyTypes";

export type IBalance = {
  _id: string;
  totalBalance: number;
  wallet: Types.Array<Types.ObjectId>;
  defaultCurrency: ICurrencyTypes;
  id: string;
};
