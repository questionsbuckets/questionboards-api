import type { Document, SchemaTimestampsConfig } from "mongoose";
import { Types } from "mongoose";
import { MongooseId } from "../../utils/commonInterface.utils";

export type TChildren = {
  childrenName: string;
  childrenImage: string;
  realtionship: string;
  parentId: MongooseId;
  _id: MongooseId;
  grade: string;
  userId: MongooseId;
};

export type TChildrenModel = TChildren & Document & SchemaTimestampsConfig;
