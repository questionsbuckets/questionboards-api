import { GenResObj } from "../../utils/responseFormatter.utils.js";
import { HttpStatusCodes as Code } from "../../utils/Enums.utils.js";
import { upload } from "../../utils/cloudinary.utils.js";
import { GetTutorsType, TutorType } from "./tutor.validate.js";
import User from "../../models/user.model.js";
import Tutor from "../../models/tutor.model.js";
import Grade from "../../models/grade.model.js";
import { toObjectId } from "../../utils/common.utils.js";

export const addTutorAccount = async (payload: TutorType) => {
  try {
    const {
      userId,
      tutorImage,
      email,
      country,
      zipcode,
      aboutMe,
      qualification,
      yearsOfExpirince,
      skillArea,
      subject,
      hourlyRate,
      grade,
      uploadDocuments,
      setDay,
      firstName,
      lastName,
    } = payload;

    const findUser = await User.findOne({ $or: [{ _id: userId }, { email }] });

    if (!findUser) return GenResObj(Code.BAD_REQUEST, false, "User not found");
    if (findUser.email === email)
      return GenResObj(Code.BAD_REQUEST, false, "Email already exists");

    let findTutor = await Tutor.findOne({ userId: findUser._id });
    if (findTutor)
      return GenResObj(Code.BAD_REQUEST, false, "Tutor already exists");

    // 🖼 Upload profile image (if provided)
    let uploadedImageUrl = tutorImage
      ? (await upload(tutorImage)).uploadedImageUrl
      : null;

    // 📄 Upload documents (if provided)
    let uploadedDocsUrl = uploadDocuments
      ? (await upload(uploadDocuments)).uploadedImageUrl
      : null;

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const defaultSchedule = days.map((day) => ({
      day,
      fromTime: "09:00",
      toTime: "17:00",
      available: true,
    }));

    const finalSchedule = setDay?.length ? setDay : defaultSchedule;
    let findGrade = await Grade.findOne({ _id: grade });

    if (!findGrade) {
      return GenResObj(Code.BAD_REQUEST, false, "Grade not found");
    }

    let findTutorEmail = await Tutor.findOne({ email: email });

    if (findTutorEmail) {
      return GenResObj(Code.BAD_REQUEST, false, "Tutor email already exists");
    }
    await Tutor.create({
      userId: userId,
      firstName,
      lastName,
      tutorImage: uploadedImageUrl,
      email,
      country,
      zipcode,
      aboutMe,
      qualification,
      yearsOfExpirince,
      skillArea,
      subject,
      hourlyRate,
      grade,
      uploadDocuments: uploadedDocsUrl,
      setDay: finalSchedule,
    });

    return GenResObj(Code.CREATED, true, "Tutor account added successfully");
  } catch (error) {
    console.log("🚀 ~ addTutorAccount ~ error:", error);
    throw error;
  }
};

export const getTutorAccountDetails = async (payload: GetTutorsType) => {
  try {
    const { userId } = payload;
    const findTutor = await Tutor.aggregate([
      {
        $match: {
          userId: toObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "grades",
          localField: "grade",
          foreignField: "_id",
          as: "grade",
        },
      },
    ]);
    if (!findTutor) {
      return GenResObj(Code.BAD_REQUEST, false, "Tutor not found");
    }
    return GenResObj(Code.OK, true, "Tutor details", findTutor);
  } catch (error) {
    console.log("🚀 ~ getTutorAccountDetails ~ error:", error);
    throw error;
  }
};
