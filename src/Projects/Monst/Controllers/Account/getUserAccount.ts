import AccountModel from "@Projects/Monst/Models/AccountModel";
import { omitObject } from "@Utilities/PickObject";
import StatusCode from "@Utilities/StatusCode";
import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

const getUserAccount = async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const userAccount = await AccountModel.findById(tokenData.uid);
  console.log("get user account", userAccount);

  if (userAccount) {
    const dataPayload = omitObject(userAccount.toObject(), [
      "transaction",
      "wallet",
    ]);
    return res.send(dataPayload);
  }

  res.status(StatusCode.notFound).send({
    message: "User account not found",
    status: StatusCode.notFound,
  });
};

export default getUserAccount;
