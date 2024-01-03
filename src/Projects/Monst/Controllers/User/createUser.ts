import { Request, Response } from "express";
import { ErrorDescription } from "mongodb";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

import ValidateEmptyObject from "@Utilities/ValidateEmptyObject";
import StatusCode from "@Utilities/StatusCode";
import UploadFile from "@Utilities/UploadFile";
import UserModel from "@Projects/Monst/Models/UserModel";
import BalanceModel from "@Projects/Monst/Models/AccountModel";
import { IUserCreateUpdateRequest } from "@Projects/Monst/Types/UserTypes";

const createUser = async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqForm: IUserCreateUpdateRequest = req.body;

  const testObject = {
    1: reqForm.firstName,
    2: reqForm.lastName,
    3: reqForm.dateOfBirth,
  };

  const test = ValidateEmptyObject(testObject);

  if (test)
    return res.status(StatusCode.badRequest).send({
      message: "Empty Field | Some required field is empty",
      code: StatusCode.badRequest,
    });

  const newUser = new UserModel();
  const newBalance = new BalanceModel();

  newUser._id = tokenData.uid;
  newUser.firebaseUID = tokenData.uid;
  newUser.email = tokenData.email!;
  newUser.firstName = reqForm.firstName;
  newUser.lastName = reqForm.lastName;
  newUser.dateOfBirth = reqForm.dateOfBirth;
  newUser.defaultCurrency = reqForm.defaultCurrency || "IDR";

  newBalance._id = tokenData.uid;

  const file = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (file[0]) {
    await UploadFile(file[0], { path: "user/avatar/", uid: tokenData.uid })
      .then((url) => {
        newUser.avatarUrl = url;
      })
      .catch((err: any) => {
        console.log("upload error", err);
      });
  }

  const createUserDB = newUser.save();
  const createBalanceDB = newBalance.save();

  await Promise.all([createUserDB, createBalanceDB])
    .then((result) => {
      console.log("user created", result);
      res.send(result[0]);
    })
    .catch((err: ErrorDescription) => {
      console.log("user creation error", err);

      if (err.message?.includes("E11000")) {
        return res.status(StatusCode.generalError).send({
          message: "Exist/User data already exist",
          error: err,
          status: StatusCode.generalError,
        });
      }

      return res.status(StatusCode.generalError).send({
        message: err.message,
        error: err,
        status: StatusCode.generalError,
      });
    });
};

export default createUser;
