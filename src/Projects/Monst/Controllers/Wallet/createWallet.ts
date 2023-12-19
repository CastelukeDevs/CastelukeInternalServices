import BalanceModel from "@Projects/Monst/Models/AccountModel";
import WalletModel from "@Projects/Monst/Models/WalletModel";
import { ICreateWalletRequest } from "@Projects/Monst/Types/WalletTypes";
import StatusCode from "@Utilities/StatusCode";
import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ErrorDescription } from "mongodb";

const createWallet = async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqBody: ICreateWalletRequest = req.body;

  const newWallet = new WalletModel();
  newWallet.name = reqBody.name;
  newWallet.ownerUID = tokenData.uid;
  newWallet.cardNumber = reqBody.cardNumber;
  newWallet.type = reqBody.type || "debit";

  const createNewWallet = newWallet.save();

  const updateBalanceWallet = BalanceModel.findByIdAndUpdate(tokenData.uid, {
    $push: { wallet: newWallet.id },
  });

  await Promise.all([createNewWallet, updateBalanceWallet])
    .then((result) => {
      res.send(result[0]);
    })
    .catch((error: ErrorDescription) => {
      res.status(StatusCode.generalError).send({
        message: error.message,
        code: StatusCode.generalError,
        error,
      });
    });
};

export default createWallet;
