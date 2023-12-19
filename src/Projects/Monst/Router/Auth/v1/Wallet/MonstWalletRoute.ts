import createWallet from "@Projects/Monst/Controllers/Wallet/createWallet";
import getWallet from "@Projects/Monst/Controllers/Wallet/getWallet";
import updateWallet from "@Projects/Monst/Controllers/Wallet/updateWallet";
import BalanceModel from "@Projects/Monst/Models/AccountModel";
import WalletModel from "@Projects/Monst/Models/WalletModel";
import {
  ICreateWalletRequest,
  IWallet,
} from "@Projects/Monst/Types/WalletTypes";
import StatusCode from "@Utilities/StatusCode";
import { Request, Response, Router } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ErrorDescription } from "mongodb";
import { Types } from "mongoose";

const MonstWalletRoute = Router();

const branchTest = "/test";

MonstWalletRoute.get(branchTest, (req, res) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname, user: tokenData });
});

MonstWalletRoute.post("/", createWallet);
MonstWalletRoute.get("/", getWallet);
MonstWalletRoute.put("/", updateWallet);

export default MonstWalletRoute;
