import AccountModel from "@Projects/Monst/Models/AccountModel";
import { IWallet } from "@Projects/Monst/Types/WalletTypes";
import StatusCode from "@Utilities/StatusCode";
import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

const refreshUserAccount = async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;

  const userAccount = await AccountModel.findById(tokenData.uid).populate({
    path: "wallet",
  });

  if (userAccount == null) {
    res.status(StatusCode.notFound).send({
      message: "User account not found",
      status: StatusCode.notFound,
    });
    return;
  }

  const userWallets = userAccount.wallet as unknown as IWallet[];

  let newBalance = 0;
  userWallets.forEach((item) => {
    newBalance += item.balance;
  });

  console.log("account balance recalculated", {
    before: userAccount.totalBalance,
    after: newBalance,
  });

  const newUserBalance = await userAccount.updateOne({
    totalBalance: newBalance.toFixed(2),
  });

  res.send(newUserBalance);
};

export default refreshUserAccount;
