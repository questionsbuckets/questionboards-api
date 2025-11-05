import mongoose, { Document, Schema, SchemaTimestampsConfig } from "mongoose";
import { TGradeModel } from "../services/grade/grade.interface.js";

const gradeSchema = new Schema<TGradeModel>(
  {
    name: {
      type: String,
      required: true,
    },
    subjects: {
      type: [String],
      required: true,
    },
  },
  { strict: true, timestamps: true }
);

const Grade = mongoose.model<TGradeModel>("grade", gradeSchema);

export default Grade;
