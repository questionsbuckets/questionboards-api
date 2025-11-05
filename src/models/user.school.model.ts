import mongoose, { Document, Schema } from "mongoose";
import { TUserSchoolModel } from "../services/userSchool/user.school.interface";

const userSchoolSchema = new Schema<TUserSchoolModel>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      default: null,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { strict: true, timestamps: true }
);

const userSchool = mongoose.model<TUserSchoolModel>(
  "userSchool",
  userSchoolSchema
);

export default userSchool;
