import createWallet from "@Projects/Monst/Controllers/Wallet/createWallet";
import deleteWallet from "@Projects/Monst/Controllers/Wallet/deleteWallet";
import getWallet from "@Projects/Monst/Controllers/Wallet/getWallet";
import updateWallet from "@Projects/Monst/Controllers/Wallet/updateWallet";
import { Router } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

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
