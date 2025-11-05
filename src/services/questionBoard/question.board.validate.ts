import { type } from "arktype";
import {
  limitValidate,
  mongoIdValidate,
  pageValidate,
} from "../../utils/validate.utils.js";

export const allowedLeavel = ["Hard", "Medium", "Easy"] as const;
const levelValidate = type.enumerated(...allowedLeavel);

export const allowedStatus = [
  "APPROVED",
  "PUBLISHED",
  "UNPUBLISHED",
  "DARFT",
  "PENDING",
] as const;
const statusValidate = type.enumerated(...allowedStatus);

export const allowedLive = ["live", "practice"] as const;
const allowedType = type.enumerated(...allowedLive);

export const optionValidator = type({
  option: "string",
  isCorrect: "boolean",
  "optionImage?": "string",
});

export const questionValidator = type({
  question: "20 <= string <= 2000",
  questionNumber: "number",
  questionType: "string",
  "questionImage?": "string",
  "questionDescription?": "20 <= string <= 2000",
  "explanation?": "string",
  "isQuestionGroup?": "boolean",
  "paragraph?": "string",
  "questionGroupId?": "number",
  // options: [optionValidator, "[]"],
  options: optionValidator.array().atLeastLength(2).atMostLength(4),
  number: "number",
  "questionTitle?": "string",
});

export const addQuestionBoardValidate = type({
  questionBoardTitle: "2 <= string <= 20",
  "questionBoardImgae?": "string",
  "questionDescription?": "2 <= string <= 500",
  "questionImage?": "string",
  topicId: mongoIdValidate,
  subTopic: mongoIdValidate,
  grade: mongoIdValidate,
  userId: mongoIdValidate,
  durationTime: "string",
  level: levelValidate,
  "status?": statusValidate,
  passPacentage: "number",
  country: "string",
  questions: questionValidator.array().atLeastLength(20).atMostLength(100),
  // questions: [questionValidator, "[]"],
  role: "string",
  subject: "string",
  type: allowedType,
  "isMultipleOptions?": "boolean",
});

export type addQuestionBoardType = typeof addQuestionBoardValidate.infer;

export const getQuestionBoardValidator = type({
  questionBoardId: mongoIdValidate,
  page: pageValidate,
  limit: limitValidate,
  userId: mongoIdValidate,
  role: "string",
  "country?": "string",
  "isDraft?": "boolean",
  "status?": statusValidate,
});

export type getQuestionBoardType = typeof getQuestionBoardValidator.infer;

export const getAllQuestionBoardValidator = type({
  page: pageValidate,
  limit: limitValidate,
  userId: mongoIdValidate,
  role: "string",
  "searchQuery?": "string",
  "gradeId?": mongoIdValidate,
  "subject?": "string",
  "topicId?": mongoIdValidate,
  "type?": allowedType,
  "country?": "string",
});

export type getAllQuestionBoardType = typeof getAllQuestionBoardValidator.infer;

export const uploadImageValidator = type({
  "image?": "string",
});
export type uploadImageType = typeof uploadImageValidator.infer;

export const remvoeImageValidator = type({
  imageUrl: "string",
});
export type removeImageType = typeof remvoeImageValidator.infer;

export const updateQuestionValidator = type({
  questionId: mongoIdValidate,
  "question?": "20 <= string <= 2000",
  "questionNumber?": "number",
  "questionType?": "string",
  "questionImage?": "string",
  "questionDescription?": "20 <= string <= 2000",
  "explanation?": "string",
  "isQuestionGroup?": "boolean",
  "paragraph?": "string",
  "questionGroupId?": "number",
  "number?": "number",
});

export type updateQuestionType = typeof updateQuestionValidator.infer;

export const deleteQuestionValidator = type({
  questionId: mongoIdValidate,
});

export type deleteQuestionType = typeof deleteQuestionValidator.infer;

export const updateOptionValidator = type({
  optionId: mongoIdValidate,
  "option?": "string",
  "isCorrect?": "boolean",
});

export type updateOptionType = typeof updateOptionValidator.infer;

export const deleteOptionValidator = type({
  optionId: mongoIdValidate,
});

export type deleteOptionType = typeof deleteOptionValidator.infer;

export const updateQuestionBoardItemValidator = type({
  questionBoardId: mongoIdValidate,
  "questionBoardTitle?": "2 <= string <= 20 ",
  "questionBoardImgae?": "string",
  "questionDescription?": "2 <= string <= 500",
  "questionImage?": "string",
  "topicId?": mongoIdValidate,
  "subTopic?": mongoIdValidate,
  "grade?": mongoIdValidate,
  userId: mongoIdValidate,
  "durationTime?": "string",
  "level?": levelValidate,
  "status?": statusValidate,
  role: "string",
});

export type updateQuestionBoardItemType =
  typeof updateQuestionBoardItemValidator.infer;

export const deleteQuestionBoardValidator = type({
  questionBoardId: mongoIdValidate,
});

export type deleteQuestionBoardType = typeof deleteQuestionBoardValidator.infer;

export const updateQuestionBoardValidate = type({
  questionBoardId: mongoIdValidate,
  questionBoardTitle: "2 <= string <= 100",
  "questionBoardImgae?": "string",
  "questionDescription?": "string",
  "questionImage?": "string",
  topicId: mongoIdValidate,
  subTopic: mongoIdValidate,
  grade: mongoIdValidate,
  userId: mongoIdValidate,
  durationTime: "string",
  level: levelValidate,
  "status?": statusValidate,
  passPacentage: "number",
  country: "string",
  questions: questionValidator.array().atLeastLength(20).atMostLength(100),
  role: "string",
  subject: "string",
  type: allowedType,
  "isMultipleOptions?": "boolean",
});

export type updateQuestionBoardType = typeof updateQuestionBoardValidate.infer;

export const getUserQuestionBoardValidator = type({
  page: pageValidate,
  limit: limitValidate,
  userId: mongoIdValidate,
  role: "string",
  "country?": "string",
  "type?": allowedType,
  "status?": statusValidate,
  "subject?": "string",
});

export type getUserQuestionBoardType =
  typeof getUserQuestionBoardValidator.infer;
