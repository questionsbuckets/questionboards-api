import mongoose, { Document, Schema } from "mongoose";
import {
  TExamQuestion,
  TExamQuestionModel,
} from "../services/examQuestion/exam.question.interface";

const examQuestionSchema = new Schema<TExamQuestionModel>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    optionId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userExamId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    isFlag: {
      type: Boolean,
      default: false,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    answerAt: {
      type: Date,
      default: null,
    },
  },
  { strict: true, timestamps: true }
);

const examQuestion = mongoose.model<TExamQuestionModel>(
  "examQuestion",
  examQuestionSchema
);

export default examQuestion;
