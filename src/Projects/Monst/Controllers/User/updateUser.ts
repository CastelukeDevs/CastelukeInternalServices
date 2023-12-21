import { Request, Response } from "express";
import { ErrorDescription } from "mongodb";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import UploadFile from "@Utilities/UploadFile";
import StatusCode from "@Utilities/StatusCode";
import UserModel from "@Projects/Monst/Models/UserModel";
import { ICreateUserRequest } from "@Projects/Monst/Types/UserTypes";

const updateUser = async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqForm: Partial<ICreateUserRequest> = req.body;

  const test = req.files;
  const files = req.files as Express.Multer.File[];
  const file: Express.Multer.File = files[0];
  console.log("file", files);

  if (file) {
    await UploadFile(file, { path: "user/avatar/", uid: tokenData.uid })
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
      status: StatusCode.generalError,
      error,
    });
  });

  res.send(user);
};

export default updateUser;
