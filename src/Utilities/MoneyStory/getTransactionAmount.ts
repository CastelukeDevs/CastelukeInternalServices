import {
  ITransaction,
  ITransactionType,
} from "../../Types/MoneyStory/TransactionTypes";

type ITransactionMode = "add" | "subtract" | ITransactionType;
const getTransactionAmount = (
  amount: number,
  mode?: ITransactionMode
): number => {
  if (mode === "Expense" || mode === "subtract") {
    return -amount;
  }

  return +amount;
};

export default getTransactionAmount;
