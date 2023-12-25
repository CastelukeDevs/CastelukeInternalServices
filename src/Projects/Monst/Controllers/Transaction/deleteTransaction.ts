import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import StatusCode from "@Utilities/StatusCode";
import getTransactionAmount from "@Projects/Monst/Utilities/getTransactionAmount";

import TransactionModel from "@Projects/Monst/Models/TransactionModel";
import WalletModel from "@Projects/Monst/Models/WalletModel";
import AccountModel from "@Projects/Monst/Models/AccountModel";

export default async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqQuery = req.query;

  const transaction = await TransactionModel.findById(reqQuery.id).where({
    ownerUID: tokenData.uid,
  });
  const wallet = await WalletModel.findById(transaction?.walletId);
  const targetWallet = await WalletModel.findById(transaction?.targetWallet);
  const account = await AccountModel.findById(tokenData.uid);

  const isTransfer = transaction?.transactionType === "Transfer";

  if (transaction === null) {
    return res.status(StatusCode.badRequest).send({
      message: "Invalid/invalid transaction id",
      status: StatusCode.badRequest,
    });
  }

  const lastAmount = transaction?.amount || 0;
  const newBalance = getTransactionAmount(
    lastAmount,
    isTransfer ? "subtract" : transaction?.transactionType
  );

  const pullTransaction = {
    $pull: {
      transaction: { _id: transaction.id },
    },
  };

  await account?.updateOne({
    ...pullTransaction,
  });
  await wallet?.updateOne({
    ...pullTransaction,
    $inc: {
      balance: -newBalance,
    },
  });
  await targetWallet?.updateOne({
    ...pullTransaction,
    $inc: {
      balance: newBalance,
    },
  });

  await transaction?.deleteOne().then((result) => {
    const message = `transaction: ${transaction.id} of type ${transaction.transactionType} deleted`;
    console.log(message, result);
    res.send({ message: message });
  });
};
