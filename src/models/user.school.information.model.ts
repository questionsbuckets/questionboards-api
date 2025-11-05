import mongoose, { Document, Schema } from "mongoose";
import { TUserSchoolInformationModel } from "../services/userSchool/user.school.interface";

const userSchoolInformationSchema = new Schema<TUserSchoolInformationModel>(
  {
    schoolName: {
      type: String,
      required: true,
    },
    schoolImage: {
      type: String,
      default: null,
    },
    schoolISD: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
      required: true,
    },
    city: {
      type: String,
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
    zipcode: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userSchoolId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    uploadDocuments: {
      type: String,
      default: null,
    },
  },
  { strict: true, timestamps: true }
);

const userSchoolInformation = mongoose.model<TUserSchoolInformationModel>(
  "userSchoolInformation",
  userSchoolInformationSchema
);

export default userSchoolInformation;
