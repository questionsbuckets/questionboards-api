import { Schema, model, type Document } from "mongoose";

export interface IPopUp extends Document {
  name: string;
  description: string;
  descriptionFileUrl?: string; // Added for file URL
  createdAt: Date;
  validTill: Date;
}

const popUpSchema = new Schema<IPopUp>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    descriptionFileUrl: {
      type: String,
      required: false, // Optional, as description might be text-only
    },
    validTill: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const PopUp = model<IPopUp>("PopUp", popUpSchema);

export default PopUp;
