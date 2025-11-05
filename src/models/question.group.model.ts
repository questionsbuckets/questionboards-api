import mongoose, { Document, Schema } from "mongoose";
import { TQuestionGroupModel } from "../services/questionBoard/question.board.interface";

const questionGroupSchema = new Schema<TQuestionGroupModel>(
  {
    questionBoardId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    isQuestionGroup: {
      type: Boolean,
      required: true,
      default: false,
    },
    paragraph: {
      type: String,
      required: false,
    },
    questionTitle: {
      type: String,
      required: false,
    },
    number: {
      type: Number,
      required: true,
    },
  },
  { strict: true, timestamps: true }
);

const QuestionGroup = mongoose.model<TQuestionGroupModel>(
  "questionGroup",
  questionGroupSchema
);

export default QuestionGroup;
