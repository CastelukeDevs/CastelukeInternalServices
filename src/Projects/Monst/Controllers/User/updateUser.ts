import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Request, Response } from "express";
import { ICreateUserProp } from "../../../../Utilities/Types/MonstUserTypes";
import UploadFile from "../../../../Utilities/UploadFile";
import UserModel from "../../Models/UserModel";
import { ErrorDescription } from "mongodb";
import StatusCode from "../../../../Utilities/StatusCode";

const updateUser = async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqForm: Partial<ICreateUserProp> = req.body;

  const file = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (file[0]) {
    await UploadFile(file[0])
      .then((url) => {
        reqForm.avatarUrl = url;
      })
      .catch((err: any) => {
        console.log("error uploading files", err);

        // return res.status(StatusCode.generalError).send({
        //   message: err,
        //   code: StatusCode.generalError,
        // });
      });
  }

  const user = await UserModel.findByIdAndUpdate(tokenData.uid, reqForm, {
    returnDocument: "after",
  }).catch((error: ErrorDescription) => {
    res.status(StatusCode.generalError).send({
      message: error.errmsg,
      code: StatusCode.generalError,
    });
  });

  res.send(user);
};

export default updateUser;
