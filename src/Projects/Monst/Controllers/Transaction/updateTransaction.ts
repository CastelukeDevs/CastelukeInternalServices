import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ErrorDescription } from "mongodb";

import { ITransactionCreateUpdateRequest } from "@Projects/Monst/Types/TransactionTypes";
import StatusCode from "@Utilities/StatusCode";
import getTransactionAmount from "@Projects/Monst/Utilities/getTransactionAmount";

import TransactionModel from "@Projects/Monst/Models/TransactionModel";
import WalletModel from "@Projects/Monst/Models/WalletModel";

type IUpdateTransactionQuery = {
  id: string;
};
export default async (req: Request<IUpdateTransactionQuery>, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqBody: ITransactionCreateUpdateRequest = req.body;
  const reqQuery = req.query;

  console.log("body", reqBody);

  const transaction = await TransactionModel.findById(reqQuery.id).where({
    ownerUID: tokenData.uid,
  });
  const wallet = await WalletModel.findById(transaction?.walletId);
  const targetWallet = await WalletModel.findById(transaction?.targetWallet);
  const isTransfer = transaction?.transactionType === "Transfer";

  if (transaction === null) {
    return res.status(StatusCode.badRequest).send({
      message: "Invalid/invalid transaction id",
      status: StatusCode.badRequest,
    });
  }

  if (
    reqBody.transactionType &&
    transaction.transactionType !== reqBody.transactionType
    //  ||(reqBody.id && transaction.id !== reqBody.id)
  ) {
    return res.status(StatusCode.forbidden).send({
      message: "Forbidden/cannot change transaction types / id",
      status: StatusCode.forbidden,
    });
  }

  if (reqBody.amount) {
    const lastAmount = transaction?.amount || 0;
    const newAmount = parseFloat(reqBody.amount as unknown as string);
    const diff = -lastAmount + newAmount;

    const newBalance = getTransactionAmount(
      diff,
      !isTransfer ? transaction?.transactionType : "subtract"
    );

    await wallet?.updateOne({
      $inc: {
        balance: newBalance,
      },
    });
    await targetWallet?.updateOne({
      $inc: {
        balance: -newBalance,
      },
    });
  }

  await transaction
    ?.updateOne(reqBody)
    .then((result) => {
      const message = `transaction: ${transaction.id} of type ${transaction.transactionType} updated`;
      console.log(message, result);
      res.send({ message: message });
    })
    .catch((error: ErrorDescription) => {
      console.error("update transaction error:", error);
      res.status(StatusCode.generalError).send({
        message: error.message,
        status: StatusCode.generalError,
        error,
      });
    });
};
