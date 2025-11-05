import mongoose, { Document, Schema, SchemaTimestampsConfig, Types } from "mongoose";
import { UserRoles } from "../utils/Enums.utils.js";

export type TSupport = {
  userId: Types.ObjectId;
  role: UserRoles;
  fullName: string;
  email: string;
  contactNumber: string;
  subject: string;
  message: string;
  status: "pending" | "resolved" | "closed";
  deleted: boolean;
  deletedAt?: Date;
};

export type TSupportModel = TSupport & Document & SchemaTimestampsConfig;

const supportSchema = new Schema<TSupportModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "closed"],
      default: "pending",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Support = mongoose.model<TSupportModel>("Support", supportSchema);

export default Support;
