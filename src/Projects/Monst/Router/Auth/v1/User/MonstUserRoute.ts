import createUser from "@Projects/Monst/Controllers/User/createUser";
import getMonstUser from "@Projects/Monst/Controllers/User/getUser";
import updateUser from "@Projects/Monst/Controllers/User/updateUser";
import { Router } from "express";

const MonstUserRoute = Router();

const branchTest = "/test";
const branchBalance = "/balance";

MonstUserRoute.get(branchTest, (req, res) => {
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname });
});

//Get user profile
MonstUserRoute.get("/", getMonstUser);
MonstUserRoute.post("/", createUser);
MonstUserRoute.put("/", updateUser);

export default MonstUserRoute;
