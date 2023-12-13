import { Router } from "express";
import MonstUserRoute from "./v1/MonstUserRoute";
import FirebaseAuthVerification from "../../../../Middlewares/FirebaseAuthVerification";

const MonstAuthenticatedRoute = Router();

const branchTest = "/test";
const v1Route = "/v1";

MonstAuthenticatedRoute.get(branchTest, (req, res) => {
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname });
});

MonstAuthenticatedRoute.use(FirebaseAuthVerification.decodeToken);
MonstAuthenticatedRoute.use(v1Route, MonstUserRoute);

export default MonstAuthenticatedRoute;
