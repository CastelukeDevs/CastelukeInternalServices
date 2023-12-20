import { Types } from "mongoose";
import { ICurrencyTypes } from "./CurrencyTypes";

export type IWalletType = "wallet" | "debit" | "credit";

export type ITransaction = {
  value: number;
  note: string;
};

export type IWallet = {
  id: string;
  ownerUID: string;
  logo: string;
  walletName: string;
  walletAbbreviation: string;
  holderName: string;
  holderNumber: string;
  balance: number;
  currency: ICurrencyTypes;
  transaction: String[];
  imageUrl: string;
  monthDiff: number;
  percentDiff: number;
  type: IWalletType;
  createdAt: string;
  updatedAt: string;
};

export type ICreateWalletRequest = {
  logo: string;
  walletName: string;
  walletAbbreviation: string;
  holderName: string;
  holderNumber: string;
  balance: number;
  currency: ICurrencyTypes;
  type: IWalletType;
  image: File;
};
