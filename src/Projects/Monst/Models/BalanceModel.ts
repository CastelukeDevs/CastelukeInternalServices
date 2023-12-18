import { Model, Schema, Types, model } from "mongoose";
import { IBalance } from "../Types/BalanceTypes";

const BalanceDataSchema = new Schema<IBalance, Model<IBalance>>(
  {
    _id: {
      type: String,
      required: true,
    },
    totalBalance: { type: Number, default: 0 },
    wallet: { type: [Types.ObjectId], ref: "Wallets" },
    defaultCurrency: {
      type: Object,
      default: {
        currency: "US Dollar",
        abbreviation: "USD",
        sign: "$",
      },
    },
  },
  { timestamps: true }
);

BalanceDataSchema.set("toJSON", {
  virtuals: true,
});

export default model<IBalance>("Balance", BalanceDataSchema);
