import { Router } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { ErrorDescription } from "mongodb";

import UserModel from "../../../../../Models/UserModel";

import { ICreateUserProp } from "../../../../../Utilities/Types/MonstUserTypes";
import ValidateEmptyObject from "../../../../../Utilities/ValidateEmptyObject";
import StatusCode from "../../../../../Utilities/StatusCode";

const MonstUserRoute = Router();

const branchTest = "/test";
const userRoute = "/user";

MonstUserRoute.get(branchTest, (req, res) => {
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname });
});

//Get user profile
MonstUserRoute.get(userRoute, async (req, res) => {
  const tokenData: DecodedIdToken = res.locals.authData!;

  try {
    const user = await UserModel.findById(tokenData.uid);
    if (user) return res.send(user);
    setTimeout(() => {
      res.status(StatusCode.notFound).send({
        message: "User not found",
        code: StatusCode.notFound,
      });
    }, 5000);
    // res.status(StatusCode.notFound).send({
    //   message: "User not found",
    //   code: StatusCode.notFound,
    // });
  } catch (error: any) {
    return res.status(StatusCode.generalError).send({
      message: error.message,
      error: error,
      code: StatusCode.generalError,
    });
  }
});

//Create new User
MonstUserRoute.post(userRoute, async (req, res) => {
  const tokenData: DecodedIdToken = res.locals.authData!;
  const reqForm: ICreateUserProp = req.body;

  const testObject = {
    1: reqForm.firstName,
    2: reqForm.lastName,
    3: reqForm.DOB,
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
  newUser.dateOfBirth = reqForm.DOB;
  newUser.defaultCurrency = reqForm.defaultCurrency;
  newUser.avatarUrl = reqForm.avatarUrl;

  await newUser
    .save()
    .then((response) => {
      console.log("resp", response);

      res.send({
        message: "Success",
        user: response.toJSON(),
      });
    })
    .catch((err: ErrorDescription) => {
      return res.status(StatusCode.generalError).send({
        message: err.message,
        error: err,
        code: StatusCode.generalError,
      });
    });
});

export default MonstUserRoute;
