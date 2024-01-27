import createTransaction from "@Controllers/MoneyStory/Transaction/createTransaction";
import deleteTransaction from "@Controllers/MoneyStory/Transaction/deleteTransaction";
import getTransaction from "@Controllers/MoneyStory/Transaction/getTransaction";
import updateTransaction from "@Controllers/MoneyStory/Transaction/updateTransaction";
import { Router } from "express";

const MonstTransactionRoute = Router();

const branchTest = "/test";

MonstTransactionRoute.get(branchTest, (req, res) => {
  console.log(branchTest + " branch || received!");
  res.send({ message: "test ok!", dir: __dirname });
});

//Base Transaction Route
MonstTransactionRoute.post("/", createTransaction);
MonstTransactionRoute.get("/", getTransaction);
MonstTransactionRoute.put("/", updateTransaction);
MonstTransactionRoute.delete("/", deleteTransaction);

export default MonstTransactionRoute;
