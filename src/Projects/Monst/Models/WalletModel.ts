import { Model, Schema, Types, model } from "mongoose";
import { IWallet } from "../Types/WalletTypes";

const WalletDataSchema = new Schema<IWallet, Model<IWallet>>(
  {
    logo: { type: String, default: "card-outline" },
    ownerUID: { type: String, required: true },
    walletName: { type: String, required: true },
    walletAbbreviation: { type: String, required: true },
    holderName: { type: String, required: true },
    holderNumber: { type: String, required: true },
    balance: { type: Number, default: 0 },
    currency: {
      type: String,
      default: "IDR",
    },
    imageUrl: String,
    monthDiff: { type: Number, default: 0 },
    percentDiff: { type: Number, default: 0 },
    transaction: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Transactions" },
        transactionType: String,
        date: Date,
      },
    ],
    type: { type: String, default: "wallet" },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

WalletDataSchema.set("toJSON", {
  virtuals: true,
});

export default model<IWallet>("Wallets", WalletDataSchema);
