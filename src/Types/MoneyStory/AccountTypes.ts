import { Types } from "mongoose";
import { ITransactionMini } from "./TransactionTypes";

export type IAccount = {
  _id: string;
  totalBalance: number;
  wallet: Types.Array<Types.ObjectId>;
  transaction: Types.DocumentArray<ITransactionMini>;
  id: string;
};
