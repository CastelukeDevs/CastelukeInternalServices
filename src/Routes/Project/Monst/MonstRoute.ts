import { Router } from "express";
import MonstAuthenticatedRoute from "./Auth/MonstAuthenticatedRoute";

const MonstRoute = Router();

const branchTest = "/test";
const authenticatedRoute = "/auth";

MonstRoute.get(branchTest, (req, res) => {
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname });
});

MonstRoute.use(authenticatedRoute, MonstAuthenticatedRoute);

export default MonstRoute;
