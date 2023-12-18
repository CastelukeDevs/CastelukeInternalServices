import BalanceModel from "@Projects/Monst/Models/BalanceModel";
import StatusCode from "@Utilities/StatusCode";
import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

const getUserBalance = async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const userBalance = await BalanceModel.findById(tokenData.uid);

  if (userBalance) return res.send(userBalance);

  res.status(StatusCode.notFound).send({
    message: "User balance not found",
    code: StatusCode.notFound,
  });
};

export default getUserBalance;
