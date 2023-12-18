import { Router } from "express";

const MonstAccountRoute = Router();

const branchTest = "/test";

MonstAccountRoute.get(branchTest, (req, res) => {
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname });
});

export default MonstAccountRoute;
