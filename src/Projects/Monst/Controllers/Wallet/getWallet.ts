import { Request, Response } from "express";
import { Types } from "mongoose";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import AccountModel from "@Projects/Monst/Models/AccountModel";

export default async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const walletId = req.query.id as unknown as Types.ObjectId;

  const wallet = await AccountModel.findById(tokenData.uid)
    .populate({ path: "wallet", match: { _id: walletId } })
    .then((result) => result?.wallet || []);

  res.send(walletId ? wallet[0] : wallet);
};
