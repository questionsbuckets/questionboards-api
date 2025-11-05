import mongoose, { Document, Schema } from "mongoose";
import { TUserSchoolContactPersonModel } from "../services/userSchool/user.school.interface";

const contactPersonSchema = new Schema<TUserSchoolContactPersonModel>(
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
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userSchoolId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { strict: true, timestamps: true }
);

const ContactPerson = mongoose.model<TUserSchoolContactPersonModel>(
  "contactPerson",
  contactPersonSchema,
  "contactPerson"
);

export default ContactPerson;
