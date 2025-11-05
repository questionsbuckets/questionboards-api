import { GenResObj } from "../../utils/responseFormatter.utils.js";
import { HttpStatusCodes as Code } from "../../utils/Enums.utils.js";
import { upload } from "../../utils/cloudinary.utils.js";
import {
  getuserSchoolDetailsType,
  userSchoolType,
} from "./user.school.validate.js";
import User from "../../models/user.model.js";
import userSchool from "../../models/user.school.model.js";
import userSchoolInformation from "../../models/user.school.information.model.js";
import ContactPerson from "../../models/contact.person.model.js";
import QuestionBoardTrial from "../../models/question.board.trial.model.js";
import mongoose from "mongoose";
import { generateBcryptPassword } from "../user/user.helper.js";
import { toObjectId } from "../../utils/common.utils.js";

export const addUserSchoolSetup = async (payload: userSchoolType) => {
  const session = await mongoose.startSession(); // start session
  session.startTransaction(); // begin transaction

  try {
    let {
      userId,
      firstName,
      lastName,
      position,
      email,
      userImage,
      schoolInfo,
      contactPerson,
      questionBoardTrial,
    } = payload;

    let encryptedPassword = await generateBcryptPassword(
      contactPerson?.password
    );

    if (contactPerson.password !== contactPerson.confrimPassword) {
      await session.abortTransaction();
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "Password and confirm password does not match"
      );
    }
    // 1️⃣ Check main user
    const [findUser, findEmail] = await Promise.all([
      User.findById(userId),
      User.findOne({ email }),
    ]);

    if (!findUser) {
      await session.abortTransaction();
      return GenResObj(Code.BAD_REQUEST, false, "User not found");
    }

    if (findEmail) {
      await session.abortTransaction();
      return GenResObj(Code.BAD_REQUEST, false, "Email already exists");
    }

    const [contactEmailExists, contactPhoneExists] = await Promise.all([
      contactPerson?.email
        ? ContactPerson.findOne({ email: contactPerson.email })
        : null,
      contactPerson?.phoneNumber
        ? ContactPerson.findOne({
            phoneNumber: contactPerson.phoneNumber,
          })
        : null,
    ]);

    if (contactEmailExists) {
      await session.abortTransaction();
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "Contact person email already exists"
      );
    }
    if (contactPhoneExists) {
      await session.abortTransaction();
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "Contact person phone number already exists"
      );
    }

    const [uploadedUserImage, uploadedSchoolImage, uploadedDocs] =
      await Promise.all([
        userImage ? upload(userImage) : null,
        schoolInfo?.schoolImage ? upload(schoolInfo.schoolImage) : null,
        schoolInfo?.uploadDocuments ? upload(schoolInfo.uploadDocuments) : null,
      ]);

    // 4️⃣ Create main userSchool
    const createUserSchool = await userSchool.create(
      [
        {
          firstName,
          lastName,
          email,
          userImage: uploadedUserImage?.uploadedImageUrl,
          position,
          userId,
        },
      ],
      { session }
    );

    if (!createUserSchool?.[0]) {
      await session.abortTransaction();
      return GenResObj(Code.BAD_REQUEST, false, "User school not created");
    }

    // 5️⃣ Prepare school info
    const schoolInfoData = {
      schoolName: schoolInfo?.schoolName,
      schoolImage: uploadedSchoolImage?.uploadedImageUrl ?? null,
      schoolISD: schoolInfo?.schoolISD,
      addressLine1: schoolInfo?.addressLine1,
      addressLine2: schoolInfo?.addressLine2,
      city: schoolInfo?.city,
      state: schoolInfo?.state,
      country: schoolInfo?.country,
      zipcode: schoolInfo?.zipcode,
      email: schoolInfo?.schoolInformationEmail,
      phoneNumber: schoolInfo?.phoneNumber,
      uploadDocuments: uploadedDocs?.uploadedImageUrl ?? null,
      userSchoolId: createUserSchool[0]._id,
      userId: userId,
    };

    const contactPersonPayload = {
      firstName: contactPerson?.firstName,
      lastName: contactPerson?.lastName,
      email: contactPerson?.email,
      phoneNumber: contactPerson?.phoneNumber,
      password: encryptedPassword,
      userSchoolId: createUserSchool[0]._id,
    };

    const questionBoardTrialPayload = {
      userName: questionBoardTrial?.userName,
      email: questionBoardTrial?.email,
      adminEmail: questionBoardTrial?.adminEmail,
      userSchoolId: createUserSchool[0]._id,
      subject: questionBoardTrial?.subject,
      comments: questionBoardTrial?.comments,
    };

    // 6️⃣ Create all related documents within the session
    const [userSchoolInfoDoc, contactPersonData, questionBoardTrialData] =
      await Promise.all([
        userSchoolInformation.create([schoolInfoData], { session }),
        ContactPerson.create([contactPersonPayload], { session }),
        QuestionBoardTrial.create([questionBoardTrialPayload], { session }),
      ]);

    if (!userSchoolInfoDoc?.[0]) {
      await session.abortTransaction();
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "User school information not created"
      );
    }

    await session.commitTransaction();
    session.endSession();

    return GenResObj(Code.CREATED, true, "User school setup successfully");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("🚀 ~ addUserSchoolSetup ~ error:", error);
    throw error;
  }
};

export const getuserSchoolDetails = async (
  payload: getuserSchoolDetailsType
) => {
  try {
    const { userId } = payload;
    const userSchoolDetails = await userSchool.aggregate([
      {
        $match: {
          userId: toObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "userschoolinformations",
          localField: "_id",
          foreignField: "userSchoolId",
          as: "userSchoolInfo",
        },
      },
      {
        $lookup: {
          from: "contactPerson",
          localField: "_id",
          foreignField: "userSchoolId",
          as: "contactPerson",
        },
      },
      {
        $lookup: {
          from: "questionboardtrials",
          localField: "_id",
          foreignField: "userSchoolId",
          as: "questionBoardTrial",
        },
      },
    ]);
    return GenResObj(Code.OK, true, "User school details", userSchoolDetails);
  } catch (error) {
    console.log("🚀 ~ getuserSchoolDetails ~ error:", error);
    throw error;
  }
};
