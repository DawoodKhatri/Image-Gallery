import { Schema, model } from "mongoose";

const { String, Number } = Schema.Types;

const ImageSchema = Schema(
  {
    name: { type: String },
    path: { type: String },
    size: { type: Number },
    mimeType: { type: String },
  },
  { versionKey: false }
);

const Image = model("Image", ImageSchema);

export default Image;
