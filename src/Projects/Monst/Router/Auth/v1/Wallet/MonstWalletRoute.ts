import BalanceModel from "@Projects/Monst/Models/BalanceModel";
import WalletModel from "@Projects/Monst/Models/WalletModel";
import { ICreateWalletRequest } from "@Projects/Monst/Types/WalletTypes";
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

MonstWalletRoute.post("/", async (req, res) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqBody: ICreateWalletRequest = req.body;

  const newWallet = new WalletModel();
  newWallet.name = reqBody.name;
  newWallet.ownerUID = tokenData.uid;
  newWallet.cardNumber = reqBody.cardNumber;
  newWallet.type = reqBody.type || "debit";

  const wallet = newWallet.save();
  // const balance = BalanceModel.findById(tokenData.uid).then((result) => {
  //   return result?.updateOne(
  //     { $push: { wallet: newWallet.id } },
  //     { returnDocument: "after" }
  //   );
  // });
  const balance = BalanceModel.findByIdAndUpdate(tokenData.uid, {
    $push: { wallet: newWallet.id },
  });

  await Promise.all([wallet, balance])
    .then((result) => {
      res.send(result[0]);
    })
    .catch((error: ErrorDescription) => {
      res.status(StatusCode.generalError).send({
        message: error.message,
        code: StatusCode.generalError,
        error,
      });
    });
});

MonstWalletRoute.get("/", async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;

  const wallet = await BalanceModel.findById(tokenData.uid)
    .populate("wallet")
    .then((result) => result?.wallet);

  res.send(wallet);
});

MonstWalletRoute.get("/:walletID", async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;

  const walletID = req.params.walletID as unknown as Types.ObjectId;

  const wallet = await WalletModel.findById(walletID).catch(
    (error: ErrorDescription) => {
      console.error("get wallet error:", error);
    }
  );

  if (wallet == null) {
    return res.status(StatusCode.badRequest).send({
      message: "Unknown/Unknown user wallet",
      code: StatusCode.badRequest,
    });
  }

  if (wallet?.ownerUID != tokenData.uid) {
    return res.status(StatusCode.unauthorized).send({
      message: "Unauthorized/Wallet is not owned by user",
      code: StatusCode.unauthorized,
    });
  }

  res.send(wallet);
});

export default MonstWalletRoute;
