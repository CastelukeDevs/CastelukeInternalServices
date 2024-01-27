import { Router } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import createWallet from "@Controllers/MoneyStory/Wallet/createWallet";
import deleteWallet from "@Controllers/MoneyStory/Wallet/deleteWallet";
import getWallet from "@Controllers/MoneyStory/Wallet/getWallet";
import updateWallet from "@Controllers/MoneyStory/Wallet/updateWallet";

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
MonstWalletRoute.delete("/", deleteWallet);

export default MonstWalletRoute;
