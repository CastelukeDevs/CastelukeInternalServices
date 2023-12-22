import { Model, Schema, model } from "mongoose";
import { IUser } from "../Types/UserTypes";

const UserDataSchema = new Schema<IUser, Model<IUser>>(
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
    defaultCurrency: { type: String, default: "IDR" },
  },
  { timestamps: true }
);

UserDataSchema.set("toJSON", {
  virtuals: true,
});

export default model<IUser>("User", UserDataSchema);
