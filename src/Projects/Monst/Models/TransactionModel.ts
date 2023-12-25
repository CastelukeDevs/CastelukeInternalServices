import { Model, Schema, Types, model } from "mongoose";
import { IAccount } from "../Types/AccountTypes";
import { ITransaction } from "../Types/TransactionTypes";

const TransactionDataSchema = new Schema<ITransaction, Model<ITransaction>>(
  {
    ownerUID: { type: String, required: true },
    walletId: { type: Schema.Types.ObjectId, required: true, ref: "Wallets" },
    type: { type: String, required: true },
    category: { type: Schema.Types.Mixed, required: true },
    subCategories: { type: [String], default: [] },
    amount: { type: Number, required: true },
    targetWallet: { type: Schema.Types.ObjectId },
    date: { type: Date, default: new Date() },
    note: { type: String },
    tags: { type: [String], default: [] },
    items: {
      type: [
        {
          name: String,
          quantity: Number,
          piecePrice: Number,
          subTotal: Number,
        },
      ],
      default: [],
    },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

TransactionDataSchema.set("toJSON", {
  virtuals: true,
});

export default model<ITransaction>("Transactions", TransactionDataSchema);
