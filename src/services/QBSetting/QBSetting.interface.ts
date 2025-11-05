import type { Document, SchemaTimestampsConfig } from "mongoose";
import { MongooseId } from "../../utils/commonInterface.utils";

export type TCompletionMessages = {
  hundred: string;
  eightyPlus: string;
  sixtyPlus: string;
  belowSixty: string;
};

export type TMusic = {
  hundred: string;
  eightyPlus: string;
  sixtyPlus: string;
  belowSixty: string;
};

export type TStar = {
  hundred: number;
  eightyPlus: number;
  sixtyPlus: number;
  fortyPlus: number;
  belowforty: number;
};

export type TQBSetting = {
  completionMessages: TCompletionMessages;
  music: TMusic;
  star: TStar;
  background: string;
  signature: string;
  _id: MongooseId;
};

export type TQBSettingModel = TQBSetting & Document & SchemaTimestampsConfig;
