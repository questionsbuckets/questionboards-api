import { type } from "arktype";
import {
  limitValidate,
  mongoIdValidate,
  pageValidate,
} from "../../utils/validate.utils.js";

export const examQuestionValidator = type({
  questionId: mongoIdValidate,
  userExamId: mongoIdValidate,
  optionId: mongoIdValidate,
  userId: mongoIdValidate,
  "isFlag?": "boolean",
});

export type examQuestionType = typeof examQuestionValidator.infer;

export const endExamQuestionValidator = type({
  userExamId: mongoIdValidate,
});

export type endExamQuestionType = typeof endExamQuestionValidator.infer;
