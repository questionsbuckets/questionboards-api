import mongoose, { Document, Schema } from "mongoose";
import { TParentModel } from "../services/parents/parents.interface.js";

const parentSchema = new Schema<TParentModel>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    parentImage: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  { strict: true, timestamps: true }
);

const Parent = mongoose.model<TParentModel>("parent", parentSchema);

export default Parent;
