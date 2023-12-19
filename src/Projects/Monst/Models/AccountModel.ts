import { Model, Schema, Types, model } from "mongoose";
import { IAccount } from "../Types/BalanceTypes";

const AccountDataSchema = new Schema<IAccount, Model<IAccount>>(
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

AccountDataSchema.set("toJSON", {
  virtuals: true,
});

export default model<IAccount>("Account", AccountDataSchema);
