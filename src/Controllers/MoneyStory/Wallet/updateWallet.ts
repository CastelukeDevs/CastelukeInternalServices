import { Request, Response } from "express";
import { Types } from "mongoose";
import { ErrorDescription } from "mongodb";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import { IWallet } from "@Types/MoneyStory/WalletTypes";

import StatusCode from "@Utilities/StatusCode";
import UploadFile from "@Utilities/UploadFile";

import WalletModel from "@Models/MoneyStory/WalletModel";

export default async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const walletId = req.query.id as unknown as Types.ObjectId;
  const walletData: Partial<IWallet> = req.body;

  const files = req.files as Express.Multer.File[];
  const file: Express.Multer.File = files[0];

  if (walletId == null) {
    return res.status(StatusCode.badRequest).send({
      message: "Missing/Missing wallet id",
      status: StatusCode.badRequest,
    });
  }

  const wallet = await WalletModel.findById(walletId).catch(
    (error: ErrorDescription) => {
      console.error("get wallet error:", error);

      res.status(StatusCode.generalError).send({
        message: error.message,
        status: StatusCode.badRequest,
        error,
      });
      return null;
    }
  );

  if (wallet?.ownerUID != tokenData.uid) {
    return res.status(StatusCode.unauthorized).send({
      message: "Unauthorized/Wallet is not owned by user",
      status: StatusCode.unauthorized,
    });
  }

  if (file) {
    await UploadFile(file, { path: "user/wallet/", uid: tokenData.uid })
      .then((url) => {
        walletData.imageUrl = url;
      })
      .catch((err: any) => {
        console.log("error uploading files", err);
      });
  }

  await wallet
    .updateOne(walletData, { returnDocument: "after" })
    .then((result) => {
      const message = `wallet: ${walletId} updated`;
      console.log(message, result);

      res.send({ message: message });
    })
    .catch((error: ErrorDescription) => {
      console.error("update wallet error:", error);
      res.status(StatusCode.generalError).send({
        message: error.message,
        status: StatusCode.generalError,
        error,
      });
    });
};
