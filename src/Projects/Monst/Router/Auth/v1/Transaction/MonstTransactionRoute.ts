import { NextFunction, Request, Response, Router } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { IWalletCreateUpdateRequest } from "@Projects/Monst/Types/WalletTypes";
import {
  ITransactionCreateUpdateRequest,
  ITransactionItems,
} from "@Projects/Monst/Types/TransactionTypes";
import TransactionModel from "@Projects/Monst/Models/TransactionModel";
import WalletModel from "@Projects/Monst/Models/WalletModel";
import AccountModel from "@Projects/Monst/Models/AccountModel";
import { ErrorDescription } from "mongodb";
import StatusCode from "@Utilities/StatusCode";
import getTransactionCategory from "@Projects/Monst/Utilities/getTransactionCategory";

const MonstTransactionRoute = Router();

const branchTest = "/test";
const accountBranch = "/account";

MonstTransactionRoute.get(branchTest, (req, res) => {
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname });
});

//Base Transaction Route
MonstTransactionRoute.post("/", async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqBody: ITransactionCreateUpdateRequest = req.body;

  const category = reqBody.category;

  const newTransaction = new TransactionModel(reqBody);
  newTransaction.ownerUID = tokenData.uid;
  newTransaction.category =
    typeof category != "string"
      ? category
      : getTransactionCategory(category as string, reqBody.type);
  newTransaction.items?.push();

  const miniTransaction = {
    _id: newTransaction._id,
    type: newTransaction.type,
    date: newTransaction.date,
  };

  console.log(
    "new transaction creation request",
    reqBody,
    newTransaction.toJSON(),
    req.files
  );
  return res.send(newTransaction.toJSON());
  const createTransaction = newTransaction
    .save()
    .catch((error: ErrorDescription) => {
      console.error("error create wallet / updating files", error);
      res.status(StatusCode.generalError).send({
        message: error.message,
        status: StatusCode.generalError,
        error,
      });
    });

  const updateWallet = WalletModel.findByIdAndUpdate(newTransaction.walletId, {
    $push: {
      transaction: miniTransaction,
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

  await Promise.all([createTransaction, updateWallet, updateAccount])
    .then((result) => {
      res.send(result[0]);
    })
    .catch((error: ErrorDescription) => {
      console.error("error create wallet / updating transaction", error);
      res.status(StatusCode.generalError).send({
        message: error.message,
        status: StatusCode.generalError,
        error,
      });
    });

  res.send(newTransaction);
});

export default MonstTransactionRoute;
