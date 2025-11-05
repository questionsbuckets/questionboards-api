import { type } from "arktype";
import {
  limitValidate,
  mongoIdValidate,
  pageValidate,
} from "../../utils/validate.utils.js";

export const getGradesValidator = type({
  page: pageValidate,
  limit: limitValidate,
  // userId: mongoIdValidate,
  // role: "string",
  "gradeId?": mongoIdValidate,
  "country?": "string",
});

export type getGradesType = typeof getGradesValidator.infer;
