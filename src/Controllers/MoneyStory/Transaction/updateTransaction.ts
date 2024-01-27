import { Request, Response } from "express";
import { ErrorDescription } from "mongodb";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import { ITransactionCreateUpdateRequest } from "@Types/MoneyStory/TransactionTypes";

import getTransactionAmount from "@Utilities/MoneyStory/getTransactionAmount";
import StatusCode from "@Utilities/StatusCode";

import TransactionModel from "@Models/MoneyStory/TransactionModel";
import WalletModel from "@Models/MoneyStory/WalletModel";

type IUpdateTransactionQuery = {
  id: string;
};
/**
 * //TODO: date update case
 */
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
    const newAmount = +reqBody.amount; //parseFloat( as unknown as string);
    const diff = -lastAmount + newAmount;

    console.log(newAmount);

    const newBalance = getTransactionAmount(
      diff,
      !isTransfer ? transaction?.transactionType : "subtract"
    );

    const updateWallet = wallet?.updateOne({
      $inc: {
        balance: newBalance,
      },
    });

    const updateTargetWallet = targetWallet?.updateOne({
      $inc: {
        balance: -newBalance,
      },
    });

    await Promise.all([updateWallet, updateTargetWallet]).catch((error) => {
      const message = "Error/update wallet error";
      console.error(message + ":", error);
      res.status(StatusCode.generalError).send({
        message,
        status: StatusCode.generalError,
        error,
      });
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
      const message = "Error/update transaction error";
      console.error(message + ":", error);
      res.status(StatusCode.generalError).send({
        message,
        status: StatusCode.generalError,
        error,
      });
    });
};
