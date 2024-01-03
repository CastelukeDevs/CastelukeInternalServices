import createUser from "@Projects/Monst/Controllers/User/createUser";
import getMonstUser from "@Projects/Monst/Controllers/User/getUser";
import getUserAccount from "@Projects/Monst/Controllers/Account/getUserAccount";
import updateUser from "@Projects/Monst/Controllers/User/updateUser";

import { Router } from "express";
import refreshUserAccount from "@Projects/Monst/Controllers/Account/refreshUserAccount";

const MonstUserRoute = Router();

const branchTest = "/test";
const accountBranch = "/account";
const refreshAccountBranch = accountBranch + "/refresh";

MonstUserRoute.get(branchTest, (req, res) => {
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname });
});

//Base User Route
MonstUserRoute.get("/", getMonstUser);
MonstUserRoute.post("/", createUser);
MonstUserRoute.put("/", updateUser);

//User Balance Route
MonstUserRoute.get(accountBranch, getUserAccount);
MonstUserRoute.get(refreshAccountBranch, refreshUserAccount);

export default MonstUserRoute;
