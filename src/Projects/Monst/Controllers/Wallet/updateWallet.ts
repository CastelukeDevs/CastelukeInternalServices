import WalletModel from "@Projects/Monst/Models/WalletModel";
import { IWallet } from "@Projects/Monst/Types/WalletTypes";
import StatusCode from "@Utilities/StatusCode";
import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ErrorDescription } from "mongodb";
import { Types } from "mongoose";

const updateWallet = async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const walletId = req.query.id as unknown as Types.ObjectId;
  const walletData: Partial<IWallet> = req.body;

  if (walletId == null) {
    return res.status(StatusCode.badRequest).send({
      message: "Missing/Missing wallet id",
      code: StatusCode.badRequest,
    });
  }

  const wallet = await WalletModel.findById(walletId).catch(
    (error: ErrorDescription) => {
      console.error("get wallet error:", error);

      res.status(StatusCode.generalError).send({
        message: error.message,
        code: StatusCode.badRequest,
        error,
      });
      return null;
    }
  );

  if (wallet?.ownerUID != tokenData.uid) {
    return res.status(StatusCode.unauthorized).send({
      message: "Unauthorized/Wallet is not owned by user",
      code: StatusCode.unauthorized,
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
        code: StatusCode.badRequest,
        error,
      });
    });
};

export default updateWallet;
