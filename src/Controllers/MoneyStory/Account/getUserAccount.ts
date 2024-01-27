import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import { omitObject } from "@Utilities/PickObject";
import StatusCode from "@Utilities/StatusCode";

import AccountModel from "@Models/MoneyStory/AccountModel";

const getUserAccount = async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const userAccount = await AccountModel.findById(tokenData.uid);

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
