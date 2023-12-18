import createUser from "@Projects/Monst/Controllers/User/createUser";
import getMonstUser from "@Projects/Monst/Controllers/User/getUser";
import getUserBalance from "@Projects/Monst/Controllers/User/getUserBalance";
import updateUser from "@Projects/Monst/Controllers/User/updateUser";

import { Router } from "express";

const MonstUserRoute = Router();

const branchTest = "/test";
const branchBalance = "/balance";

MonstUserRoute.get(branchTest, (req, res) => {
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname });
});

//Base User Route
MonstUserRoute.get("/", getMonstUser);
MonstUserRoute.post("/", createUser);
MonstUserRoute.put("/", updateUser);

//User Balance Route
MonstUserRoute.get(branchBalance, getUserBalance);

export default MonstUserRoute;
