import mongoose, { Document, Schema } from "mongoose";
import { TOptionModel } from "../services/questionBoard/question.board.interface";

const optionSchema = new Schema<TOptionModel>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    option: {
      type: String,
      required: true,
    },
    optionImage: {
      type: String,
      default: null,
    },
    isCorrect: {
      type: Boolean,
      required: false,
    },
  },
  { strict: true, timestamps: true }
);

const Option = mongoose.model<TOptionModel>("option", optionSchema);

export default Option;
