import mongoose, { Document, Schema } from "mongoose";
import { TQuestionModel } from "../services/questionBoard/question.board.interface";

const questionSchema = new Schema<TQuestionModel>(
  {
    questionBoardId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    questionNumber: {
      type: Number,
      required: true,
    },
    questionType: {
      type: String,
      required: true,
    },
    questionImage: {
      type: String,
      default: null,
    },
    questionDescription: {
      type: String,
      required: false,
    },
    explanation: {
      type: String,
      required: false,
    },
    questionGroupId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    isFlagged: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { strict: true, timestamps: true }
);

const Question = mongoose.model<TQuestionModel>("question", questionSchema);

export default Question;
