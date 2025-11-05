import { type } from "arktype";
import {
  limitValidate,
  mongoIdValidate,
  pageValidate,
} from "../../utils/validate.utils.js";

export const studentValidator = type({
  firstName: "2 <= string <= 20",
  lastName: "2 <= string <= 20",
  "studentImage?": "string",
  email: "string.email",
  userId: mongoIdValidate,
  state: "string",
  country: "string",
});

export type studentType = typeof studentValidator.infer;
