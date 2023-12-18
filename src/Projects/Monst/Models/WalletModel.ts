import { Model, Schema, model } from "mongoose";
import { IWallet } from "../Types/WalletTypes";

const WalletDataSchema = new Schema<IWallet, Model<IWallet>>(
  {
    name: { type: String, required: true },
    ownerUID: { type: String, required: true },
    cardNumber: { type: String, required: true },
    logo: { type: String, default: "logo-default" },
    balance: { type: Number, default: 0 },
    currency: {
      type: Object,
      default: {
        currency: "US Dollar",
        abbreviation: "USD",
        sign: "$",
      },
    },
    transaction: [{ value: Number, note: String }],
    type: { type: String, default: "wallet" },
  },
  { timestamps: true }
);

WalletDataSchema.set("toJSON", {
  virtuals: true,
});

export default model<IWallet>("Wallets", WalletDataSchema);
