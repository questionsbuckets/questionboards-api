import mongoose, { Document, Schema } from "mongoose";
import type { TQuestionBoardModel } from "../services/questionBoard/question.board.interface";
import {
  allowedLeavel,
  allowedStatus,
} from "../services/questionBoard/question.board.validate.js";

const questionBoardSchema = new Schema<TQuestionBoardModel>(
  {
    questionBoardTitle: {
      type: String,
      required: true,
    },
    questionBoardImgae: {
      type: String,
      default: null,
    },
    questionDescription: {
      type: String,
      required: false,
    },
    topic: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    subTopic: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    grade: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    durationTime: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: allowedLeavel,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: allowedStatus,
      default: "PENDING",
    },
    passPacentage: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["live", "practice"],
    },
  },
  { strict: true, timestamps: true }
);

// // Helpful indexes for common queries
// questionBoardSchema.index({ userId: 1, createdAt: -1 });
// questionBoardSchema.index({ grade: 1, subject: 1, createdAt: -1 });
// questionBoardSchema.index({ topic: 1, createdAt: -1 });
// questionBoardSchema.index({ type: 1, createdAt: -1 });

const QuestionBoard = mongoose.model<TQuestionBoardModel>(
  "questionBoard",
  questionBoardSchema
);

export default QuestionBoard;
