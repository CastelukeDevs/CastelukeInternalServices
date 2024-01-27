import { Request, Response } from "express";
import { ErrorDescription } from "mongodb";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import UploadFile from "@Utilities/UploadFile";
import StatusCode from "@Utilities/StatusCode";
import { IUserCreateUpdateRequest } from "@Types/MoneyStory/UserTypes";
import UserModel from "@Models/MoneyStory/UserModel";

const updateUser = async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqForm: Partial<IUserCreateUpdateRequest> = req.body;

  const files = req.files as Express.Multer.File[];
  const file: Express.Multer.File = files[0];
  console.log("file", files);

  //TODO: Refine upload file
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
