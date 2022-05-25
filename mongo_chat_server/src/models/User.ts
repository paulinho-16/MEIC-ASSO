import { Schema, model } from "mongoose";

import { IUser } from "@/@types/user";

const userSchema = new Schema<IUser>({
  number: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  online: { type: Boolean, required: true },
});

const User = model<IUser>("User", userSchema);
export default User;