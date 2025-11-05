import { type } from "arktype";
import {
  limitValidate,
  mongoIdValidate,
  pageValidate,
} from "../../utils/validate.utils.js";

export const tutorDayValidator = type({
  day: "string",
  "fromTime?": "string",
  "toTime?": "string",
  available: "string",
});

export const tutorValidator = type({
  firstName: "2 <= string <= 20",
  lastName: "2 <= string <= 20",
  "tutorImage?": "string",
  email: "string.email",
  userId: mongoIdValidate,
  country: "string",
  zipcode: "string",
  aboutMe: "2 <= string <= 300",
  qualification: "string",
  yearsOfExpirince: "string",
  skillArea: "string",
  grade: "string",
  subject: "string",
  hourlyRate: "string",
  setDay: [tutorDayValidator, "[]"],
  "uploadDocuments?": "string",
});

export type TutorType = typeof tutorValidator.infer;

export const getTutorsValidator = type({
  page: pageValidate,
  limit: limitValidate,
  userId: mongoIdValidate,
  role: "string",
});

export type GetTutorsType = typeof getTutorsValidator.infer;
