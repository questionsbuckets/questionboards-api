import type { Document, SchemaTimestampsConfig } from "mongoose";
import { MongooseId } from "../../utils/commonInterface.utils";

export type TExamQuestion = {
  questionId: MongooseId;
  optionId: MongooseId;
  userId: MongooseId;
  userExamId: MongooseId;
  isFlag: boolean;
  isCorrect: boolean;
  answerAt: Date;
};

export type TExamQuestionModel = TExamQuestion &
  Document &
  SchemaTimestampsConfig;
