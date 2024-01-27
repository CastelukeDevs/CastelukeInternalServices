import { Model, Schema, Types, model } from "mongoose";
import { IAccount } from "../../Types/MoneyStory/AccountTypes";

const AccountDataSchema = new Schema<IAccount, Model<IAccount>>(
  {
    _id: {
      type: String,
      required: true,
    },
    totalBalance: { type: Number, default: 0 },
    wallet: { type: [Types.ObjectId], ref: "Wallets" },
    transaction: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Transactions" },
        transactionType: String,
        date: Date,
      },
    ],
  },
  { timestamps: true }
);

AccountDataSchema.set("toJSON", {
  virtuals: true,
});

export default model<IAccount>("Account", AccountDataSchema);
