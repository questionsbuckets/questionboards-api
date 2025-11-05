import type { Document, SchemaTimestampsConfig } from "mongoose";
import { Types } from "mongoose";
import { MongooseId } from "../../utils/commonInterface.utils";

export type TParent = {
  firstName: string;
  lastName: string;
  parentImage: string;
  email: string;
  userId: MongooseId;
  _id: MongooseId;
  state: string;
  country: string;
};

export type TParentModel = TParent & Document & SchemaTimestampsConfig;
