import mongoose, { Document, Schema } from "mongoose";
import { TTutor } from "../services/tutor/tutor.interface";

const tutorSchema = new Schema<TTutor>(
  {
    tutorImage: {
      type: String,
      required: false,
      default: null,
    },
    aboutMe: {
      type: String,
      default: null,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    yearsOfExpirince: {
      type: String,
      required: true,
    },
    skillArea: {
      type: String,
      required: true,
    },
    grade: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    hourlyRate: {
      type: String,
      default: null,
    },
    setDay: [
      {
        day: { type: String, required: true },
        fromTime: { type: String, required: false, default: null },
        toTime: { type: String, required: false, default: null },
        available: { type: String, required: true },
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    uploadDocuments: {
      type: String,
      required: false,
      default: null,
    },
  },
  { strict: true, timestamps: true }
);

const Tutor = mongoose.model<TTutor>("Tutor", tutorSchema);

export default Tutor;
