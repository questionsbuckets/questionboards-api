import mongoose, { Document, Schema } from "mongoose";
import { TStudentModel } from "../services/student/student.interface";

const studentSchema = new Schema<TStudentModel>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    studentImage: {
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

const Student = mongoose.model<TStudentModel>("student", studentSchema);

export default Student;
