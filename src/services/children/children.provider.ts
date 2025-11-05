import { GenResObj } from "../../utils/responseFormatter.utils.js";
import { HttpStatusCodes as Code } from "../../utils/Enums.utils.js";
import { upload } from "../../utils/cloudinary.utils.js";
import Parent from "../../models/parents.model.js";
import Childern from "../../models/children.model.js";
import { childrenType } from "./children.validate.js";
import User from "../../models/user.model.js";
import { encryptDeterministic } from "../../utils/encrypt.utils.js";
import { generateBcryptPassword } from "../user/user.helper.js";

export const addChildrenAccount = async (payload: childrenType) => {
  try {
    let {
      parentId,
      childrenName,
      phoneNumber,
      realtionship,
      grade,
      childrenImage,
    } = payload;

    let findParent = await Parent.findOne({ _id: parentId });
    if (!findParent) {
      return GenResObj(Code.BAD_REQUEST, false, "Parent not found");
    }

    let uploadedImageUrl: string | null = null;
    if (childrenImage) {
      try {
        const uploadResult = await upload(childrenImage);
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
    // let password = "Children@1234";
    // let encryptedPassword = await generateBcryptPassword(password);

    // let creaetTheUser = await User.create({
    //   role: "children",
    //   phoneNumber: encryptDeterministic(phoneNumber as string),
    //   password: encryptedPassword,
    // });
    // if (!creaetTheUser) {
    //   return GenResObj(Code.BAD_REQUEST, false, "Children account not added");
    // }

    let createChildren = await Childern.create({
      parentId,
      childrenName,
      realtionship,
      childrenImage: uploadedImageUrl,
      grade,
    });

    if (!createChildren) {
      return GenResObj(Code.BAD_REQUEST, false, "Children account not added");
    }
    return GenResObj(Code.CREATED, true, "Children account added successfully");
  } catch (error) {
    console.log("🚀 ~ signupUser ~ error:", error);
    throw error;
  }
};
