import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Request, Response } from "express";
import { ErrorDescription } from "mongodb";
import { ICreateUserProp } from "@Utilities/Types/MonstUserTypes";
import ValidateEmptyObject from "@Utilities/ValidateEmptyObject";
import StatusCode from "@Utilities/StatusCode";
import UserModel from "@Projects/Monst/Models/UserModel";
import UploadFile from "@Utilities/UploadFile";

const createUser = async (req: Request, res: Response) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqForm: ICreateUserProp = req.body;

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

  newUser._id = tokenData.uid;
  newUser.firebaseUID = tokenData.uid;
  newUser.email = tokenData.email!;
  newUser.firstName = reqForm.firstName;
  newUser.lastName = reqForm.lastName;
  newUser.dateOfBirth = reqForm.dateOfBirth;
  newUser.defaultCurrency = reqForm.defaultCurrency;
  // newUser.avatarUrl = reqForm.avatarUrl;

  const file = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (file[0]) {
    await UploadFile(file[0])
      .then((url) => {
        newUser.avatarUrl = url;
      })
      .catch((err: any) => {
        res.status(StatusCode.generalError).send({
          message: err,
          code: StatusCode.generalError,
        });
      });
  }

  await newUser
    .save()
    .then((response) => {
      console.log("resp", response);

      res.send(response);
    })
    .catch((err: ErrorDescription) => {
      return res.status(StatusCode.generalError).send({
        message: err.message,
        error: err,
        code: StatusCode.generalError,
      });
    });
};

export default createUser;
