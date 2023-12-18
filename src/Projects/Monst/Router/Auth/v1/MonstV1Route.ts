import { Router } from "express";
import FirebaseAuthVerification from "@Middlewares/FirebaseAuthVerification";

import MonstUserRoute from "./User/MonstUserRoute";
import MonstAccountRoute from "./Account/MonstAccountRoute";

const MonstV1Router = Router();

const branchTest = "/test";

MonstV1Router.get(branchTest, (req, res) => {
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname });
});

MonstV1Router.use(FirebaseAuthVerification.decodeToken);

MonstV1Router.use("/user", MonstUserRoute);
MonstV1Router.use("/account", MonstAccountRoute);

export default MonstV1Router;
