import { Router } from "express";
import MonstV1Router from "./v1/MonstV1Route";

const MonstAuthenticatedRoute = Router();

const branchTest = "/test";
const v1Route = "/v1";

MonstAuthenticatedRoute.get(branchTest, (req, res) => {
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname });
});

MonstAuthenticatedRoute.use(v1Route, MonstV1Router);

export default MonstAuthenticatedRoute;
