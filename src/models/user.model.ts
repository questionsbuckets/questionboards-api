import mongoose, { Document, Schema } from "mongoose";
import type { TUserModel } from "../services/user/user.interface.js";
import { getEnumValues, UserRoles, UserStatus } from "../utils/Enums.utils.js";

const userSchema = new Schema<TUserModel>(
  {
    role: {
      type: String,
      enum: getEnumValues(UserRoles),
      default: null,
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: false,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiryTime: {
      type: Date,
      default: null,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: UserStatus.ACTIVE,
      enum: getEnumValues(UserStatus),
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },
  },
  { strict: true, timestamps: true }
);
userSchema.index({ email: 1 }, { sparse: true, unique: true });
userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret, options) => {
    delete ret.otp;
    delete ret.otpExpiryTime;
  },
});

const User = mongoose.model<TUserModel>("user", userSchema);

export default User;
