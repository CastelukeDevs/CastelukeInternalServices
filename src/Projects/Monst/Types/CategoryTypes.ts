import { Types } from "mongoose";
import { ITransactionType } from "./TransactionTypes";

export type ICategories = {
  category: string;
  icon: string;
  type?: ITransactionType;
  _id: Types.ObjectId;
};
