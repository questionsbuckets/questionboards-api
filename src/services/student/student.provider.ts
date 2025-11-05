import { GenResObj } from "../../utils/responseFormatter.utils.js";
import { HttpStatusCodes as Code } from "../../utils/Enums.utils.js";
import User from "../../models/user.model.js";
import { upload } from "../../utils/cloudinary.utils.js";
import Student from "../../models/student.model.js";
import { studentType } from "./student.validate.js";

export const addStudentAccount = async (payload: studentType) => {
  try {
    let { userId, firstName, lastName, studentImage, email, state, country } =
      payload;

    let checkAvlUser = await User.findOne({ _id: userId });
    if (!checkAvlUser) {
      return GenResObj(Code.BAD_REQUEST, false, "User not found");
    }

    let uploadedImageUrl: string | null = null;
    if (studentImage) {
      try {
        const uploadResult = await upload(studentImage);
        uploadedImageUrl = uploadResult.uploadedImageUrl || null;
      } catch (uploadErr) {
        console.error("Image upload failed:", uploadErr);
        return GenResObj(
          Code.INTERNAL_SERVER,
          false,
          "Failed to upload profile image"
        );
      }
    }

    let student = await Student.create({
      firstName,
      lastName,
      email,
      studentImage: uploadedImageUrl,
      userId,
      state,
      country,
    });

    if (!student) {
      return GenResObj(Code.BAD_REQUEST, false, "Student account not created");
    }
    return GenResObj(Code.CREATED, true, "Student account added successfully");
  } catch (error) {
    console.log("🚀 ~ signupUser ~ error:", error);
    throw error;
  }
};
