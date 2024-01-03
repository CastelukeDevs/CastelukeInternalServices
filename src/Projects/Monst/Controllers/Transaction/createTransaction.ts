import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ErrorDescription } from "mongodb";

import StatusCode from "@Utilities/StatusCode";

import {
  ITransactionCreateUpdateRequest,
  ITransactionMini,
} from "@Projects/Monst/Types/TransactionTypes";
import getTransactionAmount from "@Projects/Monst/Utilities/getTransactionAmount";
import getTransactionCategory from "@Projects/Monst/Utilities/getTransactionCategory";

import AccountModel from "@Projects/Monst/Models/AccountModel";
import TransactionModel from "@Projects/Monst/Models/TransactionModel";
import WalletModel from "@Projects/Monst/Models/WalletModel";

export default async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqBody: ITransactionCreateUpdateRequest = req.body;

  const isTransfer = reqBody.transactionType === "Transfer";

  //Check if transfer form is properly filled
  if (isTransfer && reqBody.targetWallet == undefined) {
    return res.status(StatusCode.badRequest).send({
      message: "Missing/Missing targetWallet",
      status: StatusCode.badRequest,
    });
  }

  if (!isTransfer) {
    delete reqBody.targetWallet;
    console.log("else");
  }

  const category = reqBody.category;

  const newTransaction = new TransactionModel(reqBody);
  newTransaction.ownerUID = tokenData.uid;
  newTransaction.category =
    typeof category != "string"
      ? category
      : getTransactionCategory(category as string, reqBody.transactionType);
  newTransaction.items?.push();

  const miniTransaction: ITransactionMini = {
    _id: newTransaction._id,
    transactionType: newTransaction.transactionType,
    date: newTransaction.date,
  };

  const wallet = await WalletModel.findById(newTransaction.walletId).where({
    ownerUID: tokenData.uid,
  });
  const targetWallet = await WalletModel.findById(
    newTransaction.targetWallet
  ).where({ ownerUID: tokenData.uid });

  if (wallet === null) {
    return res.status(StatusCode.badRequest).send({
      message: "Invalid/invalid walletId",
      status: StatusCode.badRequest,
    });
  }
  if (isTransfer && targetWallet === null) {
    return res.status(StatusCode.badRequest).send({
      message: "Invalid/invalid targetWallet",
      status: StatusCode.badRequest,
    });
  }

  const createTransaction = newTransaction.save();

  const updateWallet = wallet.updateOne({
    $push: {
      transaction: miniTransaction,
    },
    $inc: {
      balance: getTransactionAmount(
        newTransaction.amount,
        !isTransfer ? newTransaction.transactionType : "Expense"
      ),
    },
  });

  const updateTargetWallet = targetWallet?.updateOne({
    $push: {
      transaction: miniTransaction,
    },
    $inc: {
      balance: getTransactionAmount(newTransaction.amount, "Income"),
    },
  });

  const updateAccount = AccountModel.findByIdAndUpdate(
    newTransaction.ownerUID,
    {
      $push: {
        transaction: miniTransaction,
      },
    }
  );

  await Promise.all([
    createTransaction,
    updateWallet,
    isTransfer && updateTargetWallet,
    updateAccount,
  ])
    .then((result) => {
      console.log("Transaction creation success", result);

      res.send(result[0]);
    })
    .catch((error: ErrorDescription) => {
      console.error(
        "Transaction error create transaction / updating wallet",
        error
      );
      res.status(StatusCode.generalError).send({
        message: error.message,
        status: StatusCode.generalError,
        error,
      });
    });

  // res.send(results);
};
