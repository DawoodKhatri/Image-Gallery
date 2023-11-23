import { Schema, model } from "mongoose";
import Image from "./image.js";

const { ObjectId, String } = Schema.Types;

const UserSchema = Schema(
  {
    name: { type: String },
    email: { type: String },
    picture: { type: String },
    images: [{ type: ObjectId, ref: "Image" }],
  },
  { versionKey: false }
);

const User = model("User", UserSchema);

export default User;
