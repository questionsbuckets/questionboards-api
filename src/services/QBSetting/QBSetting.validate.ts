import { type } from "arktype";
import {
  limitValidate,
  mongoIdValidate,
  pageValidate,
} from "../../utils/validate.utils.js";

export const commplateMessage = type({
  hundred: "string",
  eightyPlus: "string",
  sixtyPlus: "string",
  belowSixty: "string",
});
export const commplateMusic = type({
  hundred: "string",
  eightyPlus: "string",
  sixtyPlus: "string",
  belowSixty: "string",
});

export const starSetting = type({
  hundred: "string.integer",
  eightyPlus: "string.integer",
  sixtyPlus: "string.integer",
  fortyPlus: "string.integer",
  belowforty: "string.integer",
});

export const addQBSettingValidator = type({
  completionMessages: commplateMessage,
  music: commplateMusic,
  star: starSetting,
  background: "string",
  signature: "string",
});

export type addQBSettingType = typeof addQBSettingValidator.infer;

export const updateCommplateMessage = type({
  "hundred?": "string",
  "eightyPlus?": "string",
  "sixtyPlus?": "string",
  "belowSixty?": "string",
});
export const updateCommplateMusic = type({
  "hundred?": "string",
  "eightyPlus?": "string",
  "sixtyPlus?": "string",
  "belowSixty?": "string",
});

export const updateStarSetting = type({
  "hundred?": "string.integer",
  "eightyPlus?": "string.integer",
  "sixtyPlus?": "string.integer",
  "fortyPlus?": "string.integer",
  "belowforty?": "string.integer",
});

export const updateQBsettingValidator = type({
  QBSettingId: mongoIdValidate,
  "completionMessages?": updateCommplateMessage,
  "music?": updateCommplateMusic,
  "star?": updateStarSetting,
  "background?": "string",
  "signature?": "string",
});

export type updateQBSettingType = typeof updateQBsettingValidator.infer;
