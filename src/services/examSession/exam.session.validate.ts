import { type } from "arktype";
import {
  limitValidate,
  mongoIdValidate,
  pageValidate,
} from "../../utils/validate.utils.js";

export const examSessionValidator = type({
  questionBoardId: mongoIdValidate,
  userId: mongoIdValidate,
});

export type examSessionType = typeof examSessionValidator.infer;
