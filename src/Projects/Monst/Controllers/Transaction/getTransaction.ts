import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import {
  ITransactionMini,
  ITransactionType,
} from "@Projects/Monst/Types/TransactionTypes";

import AccountModel from "@Projects/Monst/Models/AccountModel";
import TransactionModel from "@Projects/Monst/Models/TransactionModel";
import WalletModel from "@Projects/Monst/Models/WalletModel";

type ITransactionQuery = {
  walletId?: string;
  transactionId?: string;
  transactionType?: ITransactionType;
};

export default async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqQuery: ITransactionQuery = req.query;

  let TransactionList: ITransactionMini[] = [];

  if (reqQuery.walletId) {
    const wallet = await WalletModel.findById(reqQuery.walletId);
    TransactionList = wallet?.transaction || [];
  } else {
    const account = await AccountModel.findById(tokenData.uid);
    TransactionList = account?.transaction || [];
  }

  const accountTransactionID = TransactionList.map((trans) => trans._id);

  const options = reqQuery.transactionType && {
    transactionType: reqQuery.transactionType,
  };

  const transactionList = await TransactionModel.find({
    _id: reqQuery.transactionId || { $in: accountTransactionID },
    ...options,
  });

  res.send(reqQuery.transactionId ? transactionList[0] : transactionList);
};
