import type { Document, SchemaTimestampsConfig } from "mongoose";
import { Types } from "mongoose";
import { MongooseId } from "../../utils/commonInterface.utils";

export type TUserschool = {
  firstName: string;
  lastName: string;
  email: "string.email";
  userId: MongooseId;
  _id: MongooseId;
  position: string;
  userImage?: string;
};

export type TUserSchoolModel = TUserschool & Document & SchemaTimestampsConfig;

export type TUserSchoolInformation = {
  schoolName: string;
  schoolImage?: string;
  schoolISD: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  userId: MongooseId;
  userSchoolId: MongooseId;
  _id: MongooseId;
  uploadDocuments?: string;
  email: string;
  phoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TUserSchoolInformationModel = TUserSchoolInformation &
  Document &
  SchemaTimestampsConfig;

export type TUserSchoolContactPerson = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  userSchoolId: MongooseId;
  _id: MongooseId;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TUserSchoolContactPersonModel = TUserSchoolContactPerson &
  Document &
  SchemaTimestampsConfig;

export type TQuestionBoardTrial = {
  userName: string;
  email: string;
  adminEmail: string;
  userSchoolId: MongooseId;
  subject: string;
  comments?: string;
  _id: MongooseId;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TQuestionBoardTrialModel = TQuestionBoardTrial &
  Document &
  SchemaTimestampsConfig;
