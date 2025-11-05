import { type } from "arktype";
import {
  limitValidate,
  mongoIdValidate,
  pageValidate,
} from "../../utils/validate.utils.js";

export const parentsValidator = type({
  firstName: "2 <= string <= 20",
  lastName: "2 <= string <= 20",
  "parentImage?": "string",
  email: "string.email",
  userId: mongoIdValidate,
  state: "string",
  country: "string",
});

export type ParentsType = typeof parentsValidator.infer;

export const getParentsValidator = type({
  page: pageValidate,
  limit: limitValidate,
  userId: mongoIdValidate,
  role: "string",
});

export type getParentsType = typeof getParentsValidator.infer;
