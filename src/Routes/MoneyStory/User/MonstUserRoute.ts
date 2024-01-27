import getUserAccount from "@Controllers/MoneyStory/Account/getUserAccount";
import refreshUserAccount from "@Controllers/MoneyStory/Account/refreshUserAccount";
import createUser from "@Controllers/MoneyStory/User/createUser";
import getMonstUser from "@Controllers/MoneyStory/User/getUser";
import updateUser from "@Controllers/MoneyStory/User/updateUser";
import { Router } from "express";

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
