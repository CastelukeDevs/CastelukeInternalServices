import { Request, Response } from "express";
import { ErrorDescription } from "mongodb";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import StatusCode from "@Utilities/StatusCode";
import WalletModel from "@Models/MoneyStory/WalletModel";
import AccountModel from "@Models/MoneyStory/AccountModel";

export default async (req: Request<{ id: string }>, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqQuery = req.query;

  console.log("wallet deletion", reqQuery);

  // const user = await UserModel.findById(tokenData.uid); //Getting user data

  const wallet = await WalletModel.findById(reqQuery.id).where({
    ownerUID: tokenData.uid,
  });
  const account = await AccountModel.findById(tokenData.uid);

  if (wallet === null) {
    const message = "Missing/Wallet not found";
    console.error(message);
    return res.status(StatusCode.notFound).send({
      message,
      status: StatusCode.notFound,
    });
  }

  await account
    ?.updateOne({
      $pull: {
        wallet: wallet?._id,
      },
    })
    .catch((error: ErrorDescription) => {
      const message = "Error/update account error";
      console.error(message + ":", error);
      res.status(StatusCode.generalError).send({
        message,
        status: StatusCode.generalError,
        error,
      });
    });

  await wallet.updateOne({ status: "deleted" });

  const message = `wallet: ${wallet.id} of type ${wallet.type} deleted`;
  console.log(message);
  res.send({ message: message });
};
