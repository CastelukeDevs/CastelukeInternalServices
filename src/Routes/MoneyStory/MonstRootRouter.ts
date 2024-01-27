import { Router } from "express";
import MonstUserRoute from "./User/MonstUserRoute";
import MonstWalletRoute from "./Wallet/MonstWalletRoute";
import MonstTransactionRoute from "./Transaction/MonstTransactionRoute";
import FirebaseAuthVerification from "@Middlewares/FirebaseAuthVerification";

/**
 * Authenticated Money Story route
 */
const MonstRootRouter = Router();

MonstRootRouter.use(FirebaseAuthVerification.decodeToken);

const branchTest = "/test";
const userBranch = "/user";
const walletBranch = "/wallet";
const transactionBranch = "/transaction";

MonstRootRouter.get(branchTest, (req, res) => {
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname });
});

MonstRootRouter.use(userBranch, MonstUserRoute);
MonstRootRouter.use(walletBranch, MonstWalletRoute);
MonstRootRouter.use(transactionBranch, MonstTransactionRoute);

export default MonstRootRouter;
