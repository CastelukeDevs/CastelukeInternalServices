import { Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import UserModel from "../../Models/UserModel";
import StatusCode from "../../../../Utilities/StatusCode";

const getMonstUser = async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;

  try {
    const user = await UserModel.findById(tokenData.uid);

    if (user) {
      console.log("user fetch", user);

      return res.send(user);
    }

    res.status(StatusCode.notFound).send({
      message: "User not found",
      code: StatusCode.notFound,
    });
  } catch (error: any) {
    return res.status(StatusCode.generalError).send({
      message: error.message,
      error: error,
      code: StatusCode.generalError,
    });
  }
};

export default getMonstUser;
