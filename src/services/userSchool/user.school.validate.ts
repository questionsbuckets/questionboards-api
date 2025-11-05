import { type } from "arktype";
import {
  limitValidate,
  mongoIdValidate,
  pageValidate,
} from "../../utils/validate.utils.js";

const passwordValidate =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

export const contactPersonValidator = type({
  firstName: "2 <= string <= 20",
  lastName: "2 <= string <= 20",
  email: "string.email",
  phoneNumber: "string",
  password: passwordValidate,
  confrimPassword: passwordValidate,
});

export const questionBoardTrialValidator = type({
  userName: "2 <= string <= 20",
  email: "string.email",
  adminEmail: "string.email",
  subject: "string",
  "comments?": "string",
});

export const userSchoolInformationValidator = type({
  schoolName: "2 <= string <= 20",
  "schoolImage?": "string",
  schoolISD: "string",
  addressLine1: "string",
  "addressLine2?": "string",
  city: "string",
  state: "string",
  country: "string",
  zipcode: "string",
  "uploadDocuments?": "string",
  schoolInformationEmail: "string.email",
  phoneNumber: "string",
});

export const userSchoolValidator = type({
  firstName: "2 <= string <= 20",
  lastName: "2 <= string <= 20",
  email: "string.email",
  position: "string",
  "userImage?": "string",
  userId: mongoIdValidate,
  schoolInfo: userSchoolInformationValidator,
  contactPerson: contactPersonValidator,
  questionBoardTrial: questionBoardTrialValidator,
});

export type userSchoolType = typeof userSchoolValidator.infer;

export const getuserSchoolDetailsValidator = type({
  userId: mongoIdValidate,
  role: "string",
});

export type getuserSchoolDetailsType =
  typeof getuserSchoolDetailsValidator.infer;
