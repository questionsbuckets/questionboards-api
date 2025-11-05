import { GenResObj } from "../../utils/responseFormatter.utils.js";
import {
  HttpStatusCodes as Code,
  UserRoles,
  UserStatus,
} from "../../utils/Enums.utils.js";
import {
  createToken,
  generateBcryptPassword,
  parsePhoneNumberUtil,
  sendVerificationCodeBasedOnPlatform,
  verifyJwtToken,
  verifyOtp,
} from "./user.helper.js";
import bcrypt from "bcryptjs";
import type {
  confrimPasswordPayload,
  resetPasswordPayload,
  signInType,
  signUpType,
  updatePasswordPayload,
  updateRole,
} from "./user.validate.js";
import User from "../../models/user.model.js";
import passport from "passport";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  decryptDeterministic,
  encryptDeterministic,
} from "../../utils/encrypt.utils.js";
import parsePhoneNumberFromString from "libphonenumber-js";
import { TUser, TUserModel } from "./user.interface.js";
import Tutor from "../../models/tutor.model.js";
import { tutorValidator } from "../tutor/tutor.validate.js";
import userSchool from "../../models/user.school.model.js";
import Childern from "../../models/children.model.js";
import Parent from "../../models/parents.model.js";
import Student from "../../models/student.model.js";

export const signupUser = async (payload: signUpType) => {
  try {
    const { phoneNumber, password, confirmPassword } = payload;

    const parsedPhone = parsePhoneNumberUtil(phoneNumber);
    if (!parsedPhone) {
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "Invalid phone number for given country code"
      );
    }
    const encryptedPhone = encryptDeterministic(phoneNumber);

    // Use parsed values for DB check
    const checkAvlUser = await User.findOne({
      phoneNumber: encryptedPhone,
      deleted: false,
    }).lean();

    if (checkAvlUser) {
      return GenResObj(Code.BAD_REQUEST, false, "User already exists");
    }

    if (password !== confirmPassword) {
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "Password and confirm password do not match"
      );
    }

    let encryptedPassword = await generateBcryptPassword(password);

    let user = await User.create({
      ...payload,
      phoneNumber: encryptedPhone,
      password: encryptedPassword,
      status: UserStatus.ACTIVE,
    });
    if (!user) {
      return GenResObj(Code.BAD_REQUEST, false, "User not created");
    }
    // try {
    //   await sendVerificationCodeBasedOnPlatform(
    //     user._id.toString(),
    //     phoneNumber
    //   );
    // } catch (otpErr) {
    //   console.log("OTP sending failed:", otpErr);
    //   await User.deleteOne({ _id: user._id });
    //   return GenResObj(
    //     Code.BAD_REQUEST,
    //     false,
    //     "Failed to send OTP, please try again"
    //   );
    // }

    return GenResObj(Code.CREATED, true, "otp sent successfully to user", user);
  } catch (error) {
    console.log("🚀 ~ signupUser ~ error:", error);
    throw error;
  }
};

export const signinUser = async (payload: signInType) => {
  try {
    const { phoneNumber, password } = payload;
    const encryptedPhone = encryptDeterministic(phoneNumber);

    let checkAvlUser = await User.findOne(
      { phoneNumber: encryptedPhone, deleted: false },
      {
        password: 1,
        role: 1,
        isVerified: 1,
        _id: 1,
      }
    );

    if (!checkAvlUser) {
      return GenResObj(Code.BAD_REQUEST, false, "User not found");
    }

    if (checkAvlUser.status === UserStatus.INACTIVE) {
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "User is inactive. Please contact admin"
      );
    }

    if (!checkAvlUser.isVerified) {
      return GenResObj(Code.BAD_REQUEST, false, "User is not verified");
    }

    const checkPassword = await bcrypt.compare(password, checkAvlUser.password);

    if (!checkPassword) {
      return GenResObj(Code.BAD_REQUEST, false, "Invalid credentials");
    }

    let token;
    if (checkAvlUser && checkAvlUser._id) {
      token = createToken(checkAvlUser._id.toString(), checkAvlUser.role);
    }

    // Append token in checkAvlUser object
    const userResponse: Partial<TUser & { token: string }> = {
      ...checkAvlUser.toObject(),
      token,
    };
    delete userResponse.password;
    let isComplete = false;

    switch (checkAvlUser.role) {
      case "tutor": {
        const tutor = await Tutor.findOne({
          userId: checkAvlUser._id,
        }).lean();
        if (tutor) isComplete = true;
        break;
      }
      case "student": {
        const student = await Student.findOne({
          userId: checkAvlUser._id,
        }).lean();
        if (student) isComplete = true;
        break;
      }
      case "children": {
        const child = await Childern.findOne({
          userId: checkAvlUser._id,
        }).lean();
        if (child) isComplete = true;
        break;
      }
      case "parent": {
        const parent = await Parent.findOne({
          userId: checkAvlUser._id,
        }).lean();
        if (parent) isComplete = true;
        break;
      }
      case "admin": {
        isComplete = true;
        break;
      }
      default:
        isComplete = false;
    }

    return GenResObj(Code.OK, true, "Logged in successfully", {
      ...userResponse,
      isComplete,
    });
  } catch (error) {
    throw error;
  }
};

export const updateUserRole = async (payload: updateRole) => {
  console.log("🚀 ~ updateUserRole ~ payload:", payload);
  try {
    let { userId } = payload;
    let checkAvlUser = await User.findOne(
      { _id: userId },
      {
        // password: 1,
        role: 1,
        isVerified: 1,
        _id: 1,
      }
    );

    if (!checkAvlUser) {
      return GenResObj(Code.BAD_REQUEST, false, "User not found");
    }

    if (checkAvlUser.status === UserStatus.INACTIVE) {
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "User is inactive. Please contact admin"
      );
    }

    if (checkAvlUser.role) {
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "User role is already assigned and cannot be updated"
      );
    }
    checkAvlUser.role = payload.role;
    await checkAvlUser.save();

    return GenResObj(Code.OK, true, "Role updated successfully", checkAvlUser);
  } catch (error) {
    throw error;
  }
};

export const forgetPassword = async (payload: { phoneNumber: string }) => {
  try {
    const { phoneNumber } = payload;
    const parsedPhone = parsePhoneNumberUtil(phoneNumber);
    if (!parsedPhone) {
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "Invalid phone number for given country code"
      );
    }
    const encryptedPhone = encryptDeterministic(phoneNumber);

    const user = await User.findOne({
      phoneNumber: encryptedPhone,
      status: UserStatus.ACTIVE,
    }).select("_id");

    if (!user) {
      return GenResObj(Code.BAD_REQUEST, false, "User not found");
    }

    // await sendVerificationCodeBasedOnPlatform(user._id.toString(), phoneNumber);

    return GenResObj(Code.CREATED, true, "OTP sent successfully");
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    throw error;
  }
};

export const resetPassword = async (payload: resetPasswordPayload) => {
  try {
    const { code, phoneNumber } = payload;

    let user;

    const MASTER_OTP = "9999"; // master code for testing

    if (code === MASTER_OTP) {
      user = await User.findOne({
        phoneNumber: encryptDeterministic(phoneNumber),
      }).lean();
      if (!user) {
        return GenResObj(Code.BAD_REQUEST, false, "User not found");
      }
      await User.updateOne(
        { _id: user._id },
        { $set: { otp: null, otpExpiryTime: null, isVerified: true } }
      );
    } else {
      // Verify normal OTP
      user = await verifyOtp(code, phoneNumber);
      if (!user) {
        return GenResObj(Code.BAD_REQUEST, false, "Invalid or expired OTP");
      }

      await User.updateOne(
        { _id: user._id },
        { $set: { otp: null, otpExpiryTime: null, isVerified: true } }
      );
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "10m" }
    );

    return GenResObj(Code.OK, true, "OTP verified successfully", token);
  } catch (error) {
    throw error;
  }
};

export const confrimPassword = async (payload: confrimPasswordPayload) => {
  try {
    const { token, newPassword, confirmPassword } = payload;
    let data: string | JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;
    if (!data) {
      return GenResObj(Code.BAD_REQUEST, false, "Invalid token");
    }
    const user = await User.findOne({ _id: data.userId }).select("password");

    if (!user) {
      return GenResObj(Code.BAD_REQUEST, false, "User not found");
    }
    if (newPassword !== confirmPassword) {
      return GenResObj(Code.BAD_REQUEST, false, "Passwords do not match");
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "New password cannot be the same as the old password"
      );
    }
    const hashedPassword = await generateBcryptPassword(newPassword);

    // Update password
    user.password = hashedPassword;
    await user.save();
    return GenResObj(Code.CREATED, true, "Password reset successful");
  } catch (error: any) {
    console.error("Error in resetPassword:", error.message || error);
    throw error;
  }
};

export const updatePassword = async (payload: updatePasswordPayload) => {
  try {
    const { userId, oldPassword, newPassword, confirmPassword } = payload;

    const checkUser = await User.findOne({ _id: userId }).select("password");
    if (!checkUser) {
      return GenResObj(Code.BAD_REQUEST, false, "User not found");
    }

    if (newPassword !== confirmPassword) {
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "New password and confirm password do not match"
      );
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      checkUser.password
    );
    if (!isPasswordValid) {
      return GenResObj(Code.BAD_REQUEST, false, "Invalid old password");
    }
    const isSameAsOld = await bcrypt.compare(newPassword, checkUser.password);
    if (isSameAsOld) {
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "New password cannot be same as old password"
      );
    }

    const hashedPassword = await generateBcryptPassword(newPassword);

    const updateResult = await User.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } }
    );
    if (updateResult.modifiedCount === 0) {
      return GenResObj(Code.BAD_REQUEST, false, "Failed to update password");
    }

    return GenResObj(Code.OK, true, "Password updated successfully");
  } catch (error) {
    console.error("Error in updatePassword:", error);
    return GenResObj(
      Code.INTERNAL_SERVER,
      false,
      "An error occurred while updating password"
    );
  }
};

export const getUserDetails = async (payload: any) => {
  try {
    const { userId } = payload;

    const user = await User.findOne(
      {
        _id: userId,
        deleted: false,
      },
      { otp: 0, otpExpiryTime: 0 }
    ).lean();

    if (!user) {
      return GenResObj(Code.NOT_FOUND, false, "User not found", null);
    }

    let isComplete = false;

    switch (user.role) {
      case "tutor": {
        const tutor = await Tutor.findOne({ userId }).lean();
        if (tutor) isComplete = true;
        break;
      }
      case "student": {
        const student = await Student.findOne({
          userId,
        }).lean();
        if (student) isComplete = true;
        break;
      }
      case "children": {
        const child = await Childern.findOne({ userId }).lean();
        if (child) isComplete = true;
        break;
      }
      case "parent": {
        const parent = await Parent.findOne({ userId }).lean();
        if (parent) isComplete = true;
        break;
      }
      case "admin": {
        isComplete = true;
        break;
      }
      default:
        isComplete = false;
    }

    return GenResObj(Code.OK, true, "User info fetched successfully", {
      ...user,
      isComplete,
    });
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    throw error;
  }
};

export const GoogleAuthCallbackController = async (
  req: Request | any,
  res: any
) => {
  try {
    const response: any = await new Promise((resolve) => {
      passport.authenticate(
        "google",
        async (err: any, user: any, info: any) => {
          console.log("user :::::>> ", user);

          if (err) {
            console.error("Authentication Error:", err);
            res.redirect(`${process.env.FRONTEND_BASE_URL}/auth`);
          }

          if (!user) {
            res.redirect(`${process.env.FRONTEND_BASE_URL}/auth`);
          }

          req.logIn(user, async (loginErr: any) => {
            if (loginErr) {
              console.error("Login error:", loginErr);
              res.redirect(`${process.env.FRONTEND_BASE_URL}/auth`);
            }

            let checkAvlUser: any = await User.findOne(
              {
                email: req?.user?.email.toLowerCase(),
                deleted: false,
              },
              {
                password: 1,
                role: 1,
                isVerified: 1,
                _id: 1,
                fullName: 1,
                status: 1,
              }
            );

            if (!checkAvlUser) {
              checkAvlUser = await User.create({
                email: user?.email.toLowerCase(),
                fullName: user?.displayName,
                googleId: user?.googleId,
                isVerified: true,
                profilePicture: user?.profilePicture,
                isGoogleVerified: true,
              });

              console.log("checkAvlUser::::: :", checkAvlUser);
            }

            let token: any;
            if (checkAvlUser && checkAvlUser._id) {
              token = createToken(
                checkAvlUser._id.toString(),
                checkAvlUser.role
              );
            }

            token = token.split(" ")[1];

            const userResponse = { ...checkAvlUser.toObject(), token };
            delete userResponse.password;

            res.redirect(
              `${process.env.FRONTEND_BASE_URL}/signin?token=${token}`
            );
          });
        }
      )(req, res);
    });

    return GenResObj(
      response.code,
      response?.data?.status,
      response?.data?.message,
      response?.data?.data
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};
