import { Request, Response } from "express";
import { Types } from "mongoose";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import BalanceModel from "@Projects/Monst/Models/AccountModel";

const getWallet = async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const walletId = req.query.id as unknown as Types.ObjectId;

  const wallet = await BalanceModel.findById(tokenData.uid)
    .populate({ path: "wallet", match: { _id: walletId } })
    .then((result) => result?.wallet);

  res.send(wallet);
};

export default getWallet;
