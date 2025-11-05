import { type } from "arktype";
import { UserRoles } from "../../utils/Enums.utils.js";
import { limitValidate, mongoIdValidate, pageValidate } from "../../utils/validate.utils.js";

const nonAdminRoles = Object.values(UserRoles).filter(
  (role) => role !== UserRoles.ADMIN
);

const userRoleValidate = type.enumerated(...nonAdminRoles);

export const createSupportValidator = type({
  role: userRoleValidate,
  fullName: "string",
  email: "string",
  contactNumber: "string",
  subject: "string",
  message: "string"
});

export type CreateSupportType = typeof createSupportValidator.infer;

export const getSupportRequestsValidator = type({
  page: pageValidate,
  limit: limitValidate,
  "status?": type.enumerated("pending", "resolved", "closed"),
});

export type GetSupportRequestsType = typeof getSupportRequestsValidator.infer;

export const updateSupportStatusValidator = type({
  supportId: mongoIdValidate,
  status: type.enumerated("resolved", "closed"),
});

export type UpdateSupportStatusType = typeof updateSupportStatusValidator.infer;

export const getSupportDetailsValidator = type({
  supportId: mongoIdValidate,
});

export type GetSupportDetailsType = typeof getSupportDetailsValidator.infer;