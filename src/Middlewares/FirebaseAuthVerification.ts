import type { RequestHandler } from "express";
import FirebaseAdmin from "../Config/Firebase/FirebaseAdmin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

class FirebaseAuthVerification {
  decodeToken: RequestHandler = async (req, res, next) => {
    // console.log("new request", req.headers);

    if (req.headers.authorization == null) {
      console.log("Unauthorized request");

      return res.status(401).send({
        message: "Unauthorized: Auth null",
      });
    }
    const userToken = req.headers.authorization.split(" ")[1];
    await FirebaseAdmin.auth()
      .verifyIdToken(userToken)
      .then((userFromToken: DecodedIdToken) => {
        if (userFromToken) {
          res.locals.authData = userFromToken;
          return next();
        }
        console.log("Unauthorized request");
        return res
          .status(401)
          .send({ message: "Unauthorized: Unauthorized request" });
      })
      .catch((err) => {
        console.error("Firebase Auth error", err);
        //   throw res.json({ message: "Getting Authorization Error: " + error });
        return res.status(500).send(err);
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
