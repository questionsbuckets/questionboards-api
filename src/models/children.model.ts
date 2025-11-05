import mongoose, { Document, Schema } from "mongoose";
import { TChildrenModel } from "../services/children/children.interface.js";

const childrenSchema = new Schema<TChildrenModel>(
  {
    childrenName: {
      type: String,
      required: true,
    },
    childrenImage: {
      type: String,
      default: null,
    },
    realtionship: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    // userId: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    // },
  },
  { strict: true, timestamps: true }
);

const Childern = mongoose.model<TChildrenModel>("children", childrenSchema);

export default Childern;
