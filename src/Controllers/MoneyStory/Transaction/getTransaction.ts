import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import {
  ITransactionMini,
  ITransactionQuery,
} from "@Types/MoneyStory/TransactionTypes";

import AccountModel from "@Models/MoneyStory/AccountModel";
import TransactionModel from "@Models/MoneyStory/TransactionModel";
import WalletModel from "@Models/MoneyStory/WalletModel";

export default async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqQuery: ITransactionQuery = req.query;

  console.log("getting transaction", reqQuery);

  if (reqQuery.limit === undefined) reqQuery.limit = 20;
  if (reqQuery.page === undefined) reqQuery.page = 1;

  const limit = +reqQuery.limit; //parseFloat(reqQuery.limit || "20");
  const page = +reqQuery.page; //parseFloat(reqQuery.page || "1");
  const elementSkip = (page - 1) * limit;

  let TransactionList: ITransactionMini[] = [];

  if (reqQuery.walletId) {
    const wallet = await WalletModel.findById(reqQuery.walletId).slice(
      "transaction",
      [elementSkip, limit]
    );
    TransactionList = wallet?.transaction || [];
  } else {
    const account = await AccountModel.findById(tokenData.uid).slice(
      "transaction",
      [elementSkip, limit]
    );
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

  res.send({ transactionList, limit, page });
};
