import { Router } from "express";
import MonstAuthenticatedRoute from "./Auth/MonstAuthenticatedRoute";

const MonstRouter = Router();

const branchTest = "/test";
const authenticatedRoute = "/auth";

MonstRouter.get(branchTest, (req, res) => {
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname });
});

MonstRouter.use(authenticatedRoute, MonstAuthenticatedRoute);

export default MonstRouter;
