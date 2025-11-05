import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import User from "../../models/user.model.js";
import { SendMail } from "../../helper/mail.helper.js";
import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import Twilio from "twilio";
import { encryptDeterministic } from "../../utils/encrypt.utils.js";
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;

const client = Twilio(accountSid, authToken);
export const OTP_EXPIRY_MINUTE = 15;

// Hash the password :
export const generateBcryptPassword = async (
  password: string
): Promise<string> => {
  try {
    if (!password) {
      throw new Error("Password is required");
    }
    const salt = await bcrypt.genSalt(10);
    const bcryptedPassowrd = await bcrypt.hash(password, 10);
    return bcryptedPassowrd;
  } catch (error) {
    throw error;
  }
};

// Create Json-Web Token :
export const createToken = (id: string, role: string) => {
  const maxAge = 30 * 24 * 60 * 60; //valid for 30days
  const secretKey = process.env.JWT_SECRET_KEY as string;
  return `Bearer ${jwt.sign({ id, role }, secretKey, { expiresIn: maxAge })}`;
};

// Generate code for user verification :
export const generateTokenForEmailVerification = (
  code: number,
  userId: string
) => {
  try {
    const maxAge = 48 * 60 * 60; //valid for 48 hours
    const secretKey = process.env.JWT_SECRET_KEY as string;
    return `${jwt.sign({ code, userId }, secretKey, { expiresIn: maxAge })}`;
  } catch (error) {
    throw error;
  }
};

export async function sendVerificationCodeBasedOnPlatform(
  userId: string,
  phoneNumber: string
) {
  try {
    const code = await generateOTPForPlatform(userId);

    const message = `Your OTP is ${code}. Use this to reset your password on the app. It is valid for 15 minutes.`;

    if (phoneNumber) {
      await sendTwilioOTP(phoneNumber, message);
    }
  } catch (error) {
    console.error("Error in sendVerificationCodeBasedOnPlatform:", error);
    throw error;
  }
}
export async function generateOTPForPlatform(userId: string) {
  try {
    const code = Math.floor(1000 + Math.random() * 9000); // 6-digit OTP

    const result = await User.updateOne(
      { _id: userId },
      {
        $set: {
          otp: code,
          otpExpiryTime: new Date(Date.now() + OTP_EXPIRY_MINUTE * 60 * 1000),
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new Error("User not found");
    }

    return code;
  } catch (error) {
    throw new Error("Unable to generate OTP");
  }
}

export async function verifyJwtToken(code: string): Promise<boolean> {
  try {
    const secret = process.env.JWT_SECRET_KEY!;
    return new Promise<boolean>((resolve) => {
      jwt.verify(code, secret, (err: any, decoded: any) => {
        console.log("decoded", decoded);
        if (err) {
          console.log("err", err);

          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

export const sendTwilioOTP = async (phoneNumber: string, otp: string) => {
  try {
    let sendOTP = await client.messages.create({
      body: otp,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });
    return sendOTP;
  } catch (error: any) {
    // Log the error for debugging (do not log OTP or sensitive info)
    console.error("Twilio OTP send error:", {
      code: error.code,
      message: error.message,
      moreInfo: error.moreInfo,
      status: error.status,
    });

    // Twilio-specific error handling
    if (error.code) {
      switch (error.code) {
        case 20429: // Too many requests
          throw new Error(
            "Too many OTP requests. Please wait and try again later."
          );
        case 21610: // User has replied with STOP
          throw new Error(
            "This phone number has opted out of receiving messages."
          );
        case 21614: // Invalid phone number
          throw new Error("Invalid phone number.");

        case 21608: // Unverified number (trial account limitation)
          throw new Error(
            "This phone number is not verified. Please contact support or try with a verified number."
          );
        case 63038: // Daily message limit exceeded
          throw new Error(
            "Daily SMS limit exceeded. Please try again tomorrow or contact support."
          );
        case 21612: // Number not SMS-capable
          throw new Error("This number cannot receive SMS.");
        default:
          // For other Twilio errors, provide a generic message
          throw new Error("Failed to send OTP. Please try again later.");
      }
    }

    // Network/timeout errors
    if (error.code === "ETIMEDOUT" || error.code === "ECONNRESET") {
      throw new Error("Network error. Please try again later.");
    }

    // General catch-all
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

export const parsePhoneNumberUtil = (phoneNumber: string) => {
  if (!phoneNumber) return null;

  try {
    const parsed = parsePhoneNumberFromString(phoneNumber);
    if (parsed && parsed.isValid()) {
      return {
        phoneNumber: parsed.nationalNumber,
        countryCode: parsed.countryCallingCode,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error parsing phone number ${phoneNumber}:`, error);
    return null;
  }
};

export async function verifyOtp(code: string, phoneNumber: string) {
  try {
    const user = await User.findOne({
      phoneNumber: encryptDeterministic(phoneNumber),
      otp: code,
      otpExpiryTime: { $gt: new Date() },
    }).lean();

    if (!user) {
      throw new Error("Invalid or expired OTP");
    }

    if (user.otp !== code) {
      throw new Error("Invalid OTP");
    }

    return user; // OTP valid
  } catch (error: any) {
    console.error("Error verifying OTP:", error.message || error);
    throw error;
  }
}
