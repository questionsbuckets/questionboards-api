import { type } from "arktype";
import {
  limitValidate,
  mongoIdValidate,
  pageValidate,
} from "../../utils/validate.utils.js";
import { string } from "arktype/out/keywords/string.js";

export const allowedStatus = [
  "APPROVED",
  "PUBLISHED",
  "UNPUBLISHED",
  "PENDING",
] as const;
const statusValidate = type.enumerated(...allowedStatus);

export const adminApproveQuestionBoardValidator = type({
  questionBoardId: mongoIdValidate,
  status: statusValidate,
});

export type adminApproveQuestionBoardType =
  typeof adminApproveQuestionBoardValidator.infer;

export const createPopUpValidator = type({
  name: "string",
  description: "string",
  validTill: "string",
  descriptionFileUrl: "string?",
});

export type createPopUpType = typeof createPopUpValidator.infer;

export const updatePopUpValidator = type({
  popUpId: mongoIdValidate,
  name: "string?",
  description: "string?",
  validTill: "string?",
  descriptionFileUrl: "string?",
});

export type updatePopUpType = typeof updatePopUpValidator.infer;

export const getPopUpsValidator = type({
  page: pageValidate,
  limit: limitValidate,
});

export type getPopUpsType = typeof getPopUpsValidator.infer;

export const deletePopUpValidator = type({
  popUpId: mongoIdValidate,
});

export type deletePopUpType = typeof deletePopUpValidator.infer;
export const AddTopicNameValidator = type({
  gradeId: mongoIdValidate,
  subject: "string",
  topicName: "string",
});

export type AddTopicNameType = typeof AddTopicNameValidator.infer;

export const updateTopicNameValidator = type({
  topicId: mongoIdValidate,
  "subject?": "string",
  topicName: "string",
});

export type updateTopicNameType = typeof updateTopicNameValidator.infer;

export const getTopicValidator = type({
  page: pageValidate,
  limit: limitValidate,
  userId: mongoIdValidate,
  role: "string",
  "searchQuery?": "string",
  "topicId?": mongoIdValidate,
  "subject?": "string",
});

export type getTopicType = typeof getTopicValidator.infer;

export const deleteTopicNameValidator = type({
  topicId: mongoIdValidate,
});

export type deleteTopicNameType = typeof deleteTopicNameValidator.infer;

export const AddSubTopicNameValidator = type({
  topicId: mongoIdValidate,
  subTopicName: "string",
});

export type AddSubTopicNameType = typeof AddSubTopicNameValidator.infer;

export const findAllQuestionBoardForAdminValidator = type({
  page: pageValidate,
  limit: limitValidate,
  userId: mongoIdValidate,
  role: "string",
  "search?": "string",
  "gradeId?": mongoIdValidate,
  "subject?": "string",
  "topicId?": mongoIdValidate,
  "type?": "string",
});

export type findAllQuestionBoardForAdminType =
  typeof findAllQuestionBoardForAdminValidator.infer;
export const createFlashcardValidator = type({
  title: "string",
  description: "string",
  gradeId: mongoIdValidate,
  subject: "string",
  topicId: mongoIdValidate,
  subTopicId: mongoIdValidate,
  "previewImage?": "string",
  "file?": "string",
});

export type createFlashcardType = typeof createFlashcardValidator.infer;

export const updateFlashcardValidator = type({
  flashcardId: mongoIdValidate,
  "title?": "string",
  "description?": "string",
  "gradeId?": mongoIdValidate,
  "subject?": "string",
  "topicId?": mongoIdValidate,
  "subTopicId?": mongoIdValidate,
  "previewImage?": "string",
  "file?": "string",
});

export type updateFlashcardType = typeof updateFlashcardValidator.infer;

export const getFlashcardsValidator = type({
  page: pageValidate,
  limit: limitValidate,
  "searchQuery?": "string",
  "gradeId?": mongoIdValidate,
  "subject?": "string",
  "topicId?": mongoIdValidate,
  "subTopicId?": mongoIdValidate,
});

export type getFlashcardsType = typeof getFlashcardsValidator.infer;

export const deleteFlashcardValidator = type({
  flashcardId: mongoIdValidate,
});

export type deleteFlashcardType = typeof deleteFlashcardValidator.infer;

export const createUserGuideValidator = type({
  title: "string",
  description: "string",
  "image?": "string",
  "file?": "string",
});

export type createUserGuideType = typeof createUserGuideValidator.infer;

export const updateUserGuideValidator = type({
  userGuideId: mongoIdValidate,
  "title?": "string",
  "description?": "string",
  "image?": "string",
  "file?": "string",
});

export type updateUserGuideType = typeof updateUserGuideValidator.infer;

export const getUserGuidesValidator = type({
  page: pageValidate,
  limit: limitValidate,
  "searchQuery?": "string",
});

export type getUserGuidesType = typeof getUserGuidesValidator.infer;

export const deleteUserGuideValidator = type({
  userGuideId: mongoIdValidate,
});

export type deleteUserGuideType = typeof deleteUserGuideValidator.infer;

export const createResourceValidator = type({
  title: "string",
  description: "string",
  "image?": "string",
  "file?": "string",
});
export type createResourceType = typeof createResourceValidator.infer;

export const updateResourceValidator = type({
  resourceId: mongoIdValidate,
  "title?": "string",
  "description?": "string",
  "image?": "string",
  "file?": "string",
});
export type updateResourceType = typeof updateResourceValidator.infer;

export const getResourcesValidator = type({
  page: pageValidate,
  limit: limitValidate,
  "searchQuery?": "string",
});
export type getResourcesType = typeof getResourcesValidator.infer;

export const deleteResourceValidator = type({
  resourceId: mongoIdValidate,
});
export type deleteResourceType = typeof deleteResourceValidator.infer;

export const viewResourceValidator = type({
  resourceId: mongoIdValidate,
});
export type viewResourceType = typeof viewResourceValidator.infer;

export const createSample40DayPlanValidator = type({
  planName: "string",
  planType: "string",
  gradeId: mongoIdValidate,
  subject: "string",
  topicId: mongoIdValidate,
  subTopicId: mongoIdValidate,
  "displayImage?": "string",
  "videoUrl?": "string",
});

export type createSample40DayPlanType = typeof createSample40DayPlanValidator.infer;

export const updateSample40DayPlanValidator = type({
  sample40DayPlanId: mongoIdValidate,
  "planName?": "string",
  "planType?": "string",
  "gradeId?": mongoIdValidate,
  "subject?": "string",
  "topicId?": mongoIdValidate,
  "subTopicId?": mongoIdValidate,
  "displayImage?": "string",
  "videoUrl?": "string",
});

export type updateSample40DayPlanType = typeof updateSample40DayPlanValidator.infer;

export const getSample40DayPlansValidator = type({
  page: pageValidate,
  limit: limitValidate,
  "searchQuery?": "string",
  "gradeId?": mongoIdValidate,
  "subject?": "string",
  "topicId?": mongoIdValidate,
  "subTopicId?": mongoIdValidate,
});

export type getSample40DayPlanType = typeof getSample40DayPlansValidator.infer; 


export const deleteSample40DayPlanValidator = type({
  sample40DayPlanId: mongoIdValidate,
});

export type deleteSample40DayPlanType = typeof deleteSample40DayPlanValidator.infer;

