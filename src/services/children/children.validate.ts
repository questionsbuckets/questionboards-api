import { type } from "arktype";
import { UserRoles, UserStatus } from "../../utils/Enums.utils.js";
import {
  limitValidate,
  mongoIdValidate,
  pageValidate,
} from "../../utils/validate.utils.js";

const allowedRelationships = [
  "Father",
  "Mother",
  "Guardian",
  "Sibling",
] as const;
const realtionsRoleValidate = type.enumerated(...allowedRelationships);

export const childrenValidator = type({
  childrenName: "2 <= string <= 20",
  childrenImage: "string",
  realtionship: realtionsRoleValidate,
  parentId: mongoIdValidate,
  grade: "string",
  "phoneNumber?": "string",
});

export type childrenType = typeof childrenValidator.infer;
