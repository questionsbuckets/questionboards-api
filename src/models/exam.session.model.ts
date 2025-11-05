import mongoose, { Document, Schema } from "mongoose";
import {
  TExamSession,
  TExamSessionModel,
} from "../services/examSession/exam.session.interface";

const examSessionSchema = new Schema<TExamSessionModel>(
  {
    questionBoardId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      default: null,
    },
    finalScore: {
      type: String,
      default: null,
    },
    percentile: {
      type: String,
      default: null,
    },
    currentQuestion: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      required: true,
      default: "IN_PROGRESS",
    },
    durationTime: {
      type: String,
      default: null,
    },
  },
  { strict: true, timestamps: true }
);

const ExamSessions = mongoose.model<TExamSessionModel>(
  "examSession",
  examSessionSchema
);

export default ExamSessions;
