import { Model, Schema, Types, model } from "mongoose";
import { IAccount } from "../Types/AccountTypes";

const AccountDataSchema = new Schema<IAccount, Model<IAccount>>(
  {
    _id: {
      type: String,
      required: true,
    },
    totalBalance: { type: Number, default: 0 },
    wallet: { type: [Types.ObjectId], ref: "Wallets" },
    transaction: {
      type: [{ _id: Schema.Types.ObjectId, type: String, date: Date }],
      ref: "Transactions",
    },
  },
  { timestamps: true }
);

AccountDataSchema.set("toJSON", {
  virtuals: true,
});

export default model<IAccount>("Account", AccountDataSchema);
