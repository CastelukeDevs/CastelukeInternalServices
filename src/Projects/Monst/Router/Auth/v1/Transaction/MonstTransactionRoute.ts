import { Router } from "express";

import createTransaction from "@Projects/Monst/Controllers/Transaction/createTransaction";
import getTransaction from "@Projects/Monst/Controllers/Transaction/getTransaction";
import updateTransaction from "@Projects/Monst/Controllers/Transaction/updateTransaction";
import deleteTransaction from "@Projects/Monst/Controllers/Transaction/deleteTransaction";

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
