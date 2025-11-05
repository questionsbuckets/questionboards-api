import { type } from "arktype";
import { UserRoles, UserStatus } from "../../utils/Enums.utils.js";
import {
  limitValidate,
  mongoIdValidate,
  pageValidate,
} from "../../utils/validate.utils.js";

const passwordValidate =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
const userRoleValidate = type.enumerated(...Object.values(UserRoles));

// Validate register request
export const signUpValidator = type({
  password: passwordValidate,
  phoneNumber: "string",
  confirmPassword: passwordValidate,
});

export type signUpType = typeof signUpValidator.infer;

export const signInValidator = type({
  password: passwordValidate,
  phoneNumber: "string",
});

export type signInType = typeof signInValidator.infer;

export const updateRoleValidator = type({
  role: userRoleValidate,
  userId: mongoIdValidate,
});

export type updateRole = typeof updateRoleValidator.infer;

export const forgetPasswordValidator = type({
  phoneNumber: "string",
});

export type ForgetPasswordPayload = typeof forgetPasswordValidator.infer;

export const resetPasswordValidator = type({
  code: "string",
  phoneNumber: "string",
});

export type resetPasswordPayload = typeof resetPasswordValidator.infer;

export const confrimPasswordValidator = type({
  newPassword: passwordValidate,
  confirmPassword: passwordValidate,
  token: "string",
});

export type confrimPasswordPayload = typeof confrimPasswordValidator.infer;

export const updatePasswordValidator = type({
  oldPassword: passwordValidate,
  newPassword: passwordValidate,
  confirmPassword: passwordValidate,
  userId: mongoIdValidate,
});

export type updatePasswordPayload = typeof updatePasswordValidator.infer;
