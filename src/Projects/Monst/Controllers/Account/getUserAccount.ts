import AccountModel from "@Projects/Monst/Models/AccountModel";
import StatusCode from "@Utilities/StatusCode";
import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

const getUserAccount = async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const userBalance = await AccountModel.findById(tokenData.uid);

  if (userBalance) return res.send(userBalance);

  res.status(StatusCode.notFound).send({
    message: "User account not found",
    code: StatusCode.notFound,
  });
};

export default getUserAccount;
