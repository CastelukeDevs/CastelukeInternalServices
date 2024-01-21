import { Request, Response } from "express";
import { ErrorDescription } from "mongodb";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import BalanceModel from "@Projects/Monst/Models/AccountModel";
import WalletModel from "@Projects/Monst/Models/WalletModel";
import { IWalletCreateUpdateRequest } from "@Projects/Monst/Types/WalletTypes";
import StatusCode from "@Utilities/StatusCode";
import UploadFile from "@Utilities/UploadFile";
import UserModel from "@Projects/Monst/Models/UserModel";

export default async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqBody: IWalletCreateUpdateRequest = req.body;

  console.log("wallet creation", reqBody);

  const files = req.files as Express.Multer.File[];
  const file: Express.Multer.File = files[0];

  const user = await UserModel.findById(tokenData.uid); //Getting user data

  const newWallet = new WalletModel(reqBody);

  newWallet.ownerUID = tokenData.uid;
  newWallet.type = reqBody.type || "wallet";
  newWallet.currency = reqBody.currency || user?.defaultCurrency || "IDR";

  const updateBalanceWallet = BalanceModel.findByIdAndUpdate(tokenData.uid, {
    $push: { wallet: newWallet.id },
  });

  if (file) {
    await UploadFile(file, { path: "user/wallet/", uid: tokenData.uid })
      .then((url) => {
        newWallet.imageUrl = url;
      })
      .catch((err: any) => {
        console.warn("error uploading files", err);
      });
  }

  const createNewWallet = newWallet.save();

  await Promise.all([createNewWallet, updateBalanceWallet])
    .then((result) => {
      console.log("wallet created", result[0]);
      res.send(result[0]);
    })
    .catch((error: ErrorDescription) => {
      console.error("error create wallet / updating files", error);
      res.status(StatusCode.generalError).send({
        message: error.message,
        status: StatusCode.generalError,
        error,
      });
    });
};
