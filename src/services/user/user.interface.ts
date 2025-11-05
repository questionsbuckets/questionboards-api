import type { Document, SchemaTimestampsConfig } from "mongoose";
import { UserRoles, UserStatus } from "../../utils/Enums.utils.js";
import { Types } from "mongoose";
export type TUser = {
  fullName: string;
  slug: string;
  role: UserRoles;
  password: string;
  email: string;
  otp?: string;
  otpExpiryTime?: Date;
  status: UserStatus;
  isVerified: boolean;
  profilePicture: string;
  lastLogin: Date;
  deleted: boolean;
  deletedAt: Date;
  phoneNumber: string;
  countryCode: string;
  comparePasswordMethod?: (userPassword: string) => Promise<any>;
  _id: Types.ObjectId | string;
  googleId?: string;
};

export type TUserModel = TUser & Document & SchemaTimestampsConfig;

export type TTokenUser = {
  userId: string;
  role: string;
};
