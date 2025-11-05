import type { Document, SchemaTimestampsConfig } from "mongoose";
import { Types } from "mongoose";
import { MongooseId } from "../../utils/commonInterface.utils";

export type TExamSession = {
  questionBoardId: MongooseId;
  userId: MongooseId;
  startTime: Date;
  endTime: Date;
  finalScore: string;
  percentile: string;
  currentQuestion: number;
  status: "IN_PROGRESS" | "COMPLETED";
  durationTime: string;
};

export type TExamSessionModel = TExamSession &
  Document &
  SchemaTimestampsConfig;
