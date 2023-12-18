import type { RequestHandler } from "express";
import Admin from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import StatusCode from "../Utilities/StatusCode";

class FirebaseAuthVerification {
  decodeToken: RequestHandler = async (req, res, next) => {
    // console.log("new request", req.headers);

    if (req.headers.authorization == null) {
      console.log("Unauthorized request");

      return res.status(StatusCode.unauthorized).send({
        message: "Unauthorized: Auth null",
        code: StatusCode.unauthorized,
      });
    }
    const userToken = req.headers.authorization.split(" ")[1];
    await Admin.auth()
      .verifyIdToken(userToken)
      .then((userFromToken: DecodedIdToken) => {
        if (userFromToken) {
          res.locals.authData = userFromToken;
          return next();
        }
        console.log("Unauthorized request");
        return res.status(StatusCode.unauthorized).send({
          message: "Unauthorized: Unauthorized request",
          code: StatusCode.unauthorized,
        });
      })
      .catch((err) => {
        console.error("Firebase Auth error", err);
        //   throw res.json({ message: "Getting Authorization Error: " + error });
        return res.status(StatusCode.generalError).send({
          message: "Firebase authentication error",
          error: err,
          code: StatusCode.generalError,
        });
      });
  };
}

declare global {
  namespace Express {
    interface Locals {
      authData?: DecodedIdToken;
    }
  }
}

export default new FirebaseAuthVerification();
