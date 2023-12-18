import { Router } from "express";
import FirebaseAuthVerification from "@Middlewares/FirebaseAuthVerification";

import MonstUserRoute from "./User/MonstUserRoute";
import MonstWalletRoute from "./Wallet/MonstWalletRoute";

const MonstV1Router = Router();

const branchTest = "/test";
const userBranch = "/user";
const walletBranch = "/wallet";

MonstV1Router.get(branchTest, (req, res) => {
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname });
});

MonstV1Router.use(FirebaseAuthVerification.decodeToken);

MonstV1Router.use(userBranch, MonstUserRoute);
MonstV1Router.use(walletBranch, MonstWalletRoute);

export default MonstV1Router;
