import { Types } from "mongoose";
import { ICurrencyTypes } from "./CurrencyTypes";
import { ITransactionMini } from "./TransactionTypes";

export type IWalletType = "wallet" | "debit" | "credit";

export type IWalletMain = {
  logo: string;
  walletName: string;
  walletAbbreviation: string;
  holderName: string;
  holderNumber: string;
  balance: number;
  currency: ICurrencyTypes;
  type: IWalletType;
};

export type IWallet = {
  id: string;
  ownerUID: string;
  transaction: Types.DocumentArray<ITransactionMini>;
  imageUrl: string;
  monthDiff: number;
  percentDiff: number;
  createdAt: string;
  updatedAt: string;
} & IWalletMain;

export type IWalletCreateUpdateRequest = {
  image: File;
} & IWalletMain;
