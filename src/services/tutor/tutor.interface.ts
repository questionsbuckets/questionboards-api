import type { Document, SchemaTimestampsConfig } from "mongoose";
import { MongooseId } from "../../utils/commonInterface.utils";

export type TTutor = {
  tutorImage?: string;
  aboutMe?: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode?: string;
  mobileNo?: string;
  country?: string;
  zipcode?: string;
  qualification?: string;
  yearsOfExpirince?: number;
  skillArea?: string;
  grade?: MongooseId;
  subject?: string;
  hourlyRate?: number;
  setDay?: string[];
  fromTime?: string;
  toTime?: string;
  userId: MongooseId;
  uploadDocuments?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TTutorModel = TTutor & Document & SchemaTimestampsConfig;
