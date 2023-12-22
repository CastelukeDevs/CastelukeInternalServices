import { Router } from "express";
import FirebaseAuthVerification from "@Middlewares/FirebaseAuthVerification";

import MonstUserRoute from "./User/MonstUserRoute";
import MonstWalletRoute from "./Wallet/MonstWalletRoute";
import MonstTransactionRoute from "./Transaction/MonstTransactionRoute";

const MonstV1Router = Router();

const branchTest = "/test";
const userBranch = "/user";
const walletBranch = "/wallet";
const transactionBranch = "/transaction";

MonstV1Router.get(branchTest, (req, res) => {
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname });
});

MonstV1Router.use(FirebaseAuthVerification.decodeToken);

MonstV1Router.use(userBranch, MonstUserRoute);
MonstV1Router.use(walletBranch, MonstWalletRoute);
MonstV1Router.use(transactionBranch, MonstTransactionRoute);

export default MonstV1Router;
