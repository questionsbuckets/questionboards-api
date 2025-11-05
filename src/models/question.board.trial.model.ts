import mongoose, { Document, Schema } from "mongoose";
import { TQuestionBoardTrialModel } from "../services/userSchool/user.school.interface";

const questionBoardTrialSchema = new Schema<TQuestionBoardTrialModel>(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    userSchoolId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
      required: false,
    },
  },
  { strict: true, timestamps: true }
);

const QuestionBoardTrial = mongoose.model<TQuestionBoardTrialModel>(
  "questionBoardTrial",
  questionBoardTrialSchema
);

export default QuestionBoardTrial;
