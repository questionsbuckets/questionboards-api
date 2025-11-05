import type { Document, SchemaTimestampsConfig } from "mongoose";
import { Types } from "mongoose";
import { MongooseId } from "../../utils/commonInterface.utils";

export type TStudent = {
  firstName: string;
  lastName: string;
  studentImage: string;
  email: string;
  userId: MongooseId;
  _id: MongooseId;
  state: string;
  country: string;
};

export type TStudentModel = TStudent & Document & SchemaTimestampsConfig;
