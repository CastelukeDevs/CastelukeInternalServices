import { Types } from "mongoose";
import { ICurrencyTypes } from "./CurrencyTypes";

export type IWalletType = "wallet" | "debit" | "credit";

export type ITransaction = {
  value: number;
  note: string;
};

export type IWallet = {
  name: string;
  ownerUID: string;
  cardNumber: string;
  logo?: string;
  balance: number;
  currency: ICurrencyTypes;
  transaction: Types.Array<Types.ObjectId>;
  type: IWalletType;
  createdAt: number;
  updatedAt: number;
};

export type ICreateWalletRequest = {
  name: string;
  ownerUID: string;
  cardNumber: string;
  type?: IWalletType;
};
