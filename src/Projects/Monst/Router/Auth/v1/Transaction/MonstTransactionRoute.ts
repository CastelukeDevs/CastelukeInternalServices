import { NextFunction, Request, Response, Router } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { IWalletCreateUpdateRequest } from "@Projects/Monst/Types/WalletTypes";
import {
  ITransactionCreateUpdateRequest,
  ITransactionItems,
  ITransactionMini,
} from "@Projects/Monst/Types/TransactionTypes";
import TransactionModel from "@Projects/Monst/Models/TransactionModel";
import WalletModel from "@Projects/Monst/Models/WalletModel";
import AccountModel from "@Projects/Monst/Models/AccountModel";
import { ErrorDescription, ObjectId } from "mongodb";
import StatusCode from "@Utilities/StatusCode";
import getTransactionCategory from "@Projects/Monst/Utilities/getTransactionCategory";
import getTransactionAmount from "@Projects/Monst/Utilities/getTransactionAmount";

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

  //Check if transfer form is properly filled
  if (
    reqBody.transactionType === "Transfer" &&
    reqBody.targetWallet == undefined
  ) {
    return res.status(StatusCode.badRequest).send({
      message: "Missing/Missing targetWallet",
      status: StatusCode.badRequest,
    });
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

  const createTransaction = newTransaction.save();

  const updateWallet = WalletModel.findByIdAndUpdate(newTransaction.walletId, {
    $push: {
      transaction: miniTransaction,
    },
    $inc: {
      balance: getTransactionAmount(
        newTransaction.amount,
        newTransaction.transactionType !== "Transfer"
          ? newTransaction.transactionType
          : "Expense"
      ),
    },
  });

  const targetWallet = WalletModel.findByIdAndUpdate(
    newTransaction.targetWallet,
    {
      $push: {
        transaction: miniTransaction,
      },
      $inc: {
        balance: getTransactionAmount(newTransaction.amount, "Income"),
      },
    }
  );

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
    targetWallet,
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
});

export default MonstTransactionRoute;
