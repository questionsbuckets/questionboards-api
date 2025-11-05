import { Types } from "mongoose";
import { MongooseId } from "../../utils/commonInterface.utils";
import { SchemaTimestampsConfig } from "mongoose";

export type TQuestionBoard = {
  questionBoardTitle: string;
  questionBoardImgae?: string | null;
  questionDescription?: string;
  topic: MongooseId;
  subTopic: MongooseId;
  grade: MongooseId;
  userId: MongooseId;
  durationTime: string;
  level: string;
  status: string;
  passPacentage: number;
  country: string;
  createdAt?: Date;
  updatedAt?: Date;
  subject: string;
  type: "live" | "practice";
};

export type TQuestionBoardModel = TQuestionBoard &
  Document &
  SchemaTimestampsConfig;

export type TQuestionGroup = {
  questionBoardId: MongooseId;
  isQuestionGroup: boolean;
  paragraph?: string;
  number: number;
  questionTitle?: string;
};

export type TQuestionGroupModel = TQuestionGroup &
  Document &
  SchemaTimestampsConfig;

export type TQuestion = {
  questionBoardId: MongooseId;
  question: string;
  questionNumber: number;
  questionType: string;
  questionImage?: string;
  questionDescription?: string;
  questionGroupId?: MongooseId;
  explanation?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isFlagged?: boolean;
};

export type TQuestionModel = TQuestion & Document & SchemaTimestampsConfig;

export type TOption = {
  questionId: MongooseId;
  option: string;
  isCorrect?: boolean;
  optionImage?: string;
};

export type TOptionModel = TOption & Document & SchemaTimestampsConfig;
