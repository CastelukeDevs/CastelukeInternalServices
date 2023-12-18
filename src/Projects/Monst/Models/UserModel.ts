import mongoose, { InferSchemaType, Schema, model } from "mongoose";

const UserDataSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    firebaseUID: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    avatarUrl: String,
    lastSignIn: { type: Date, default: new Date() },
    level: { type: Number, default: 0 },
    points: { type: Number, default: 0 },

    //Wallet
    totalBalance: Number,
    wallet: { type: Array, default: [] },
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

export type IUser = InferSchemaType<typeof UserDataSchema>;

export default model<IUser>("User", UserDataSchema);
