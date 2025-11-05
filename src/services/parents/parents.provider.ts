import { GenResObj } from "../../utils/responseFormatter.utils.js";
import { HttpStatusCodes as Code } from "../../utils/Enums.utils.js";
import { getParentsType, ParentsType } from "./parents.validate.js";
import User from "../../models/user.model.js";
import { upload } from "../../utils/cloudinary.utils.js";
import Parent from "../../models/parents.model.js";
import { toObjectId } from "../../utils/common.utils.js";

export const addParentsAccount = async (payload: ParentsType) => {
  try {
    let { userId, firstName, lastName, parentImage, email, state, country } =
      payload;

    let checkAvlUser = await User.findOne({ _id: userId });
    if (!checkAvlUser) {
      return GenResObj(Code.BAD_REQUEST, false, "User not found");
    }

    let uploadedImageUrl: string | null = null;
    if (parentImage) {
      try {
        const uploadResult = await upload(parentImage);
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

    let parents = await Parent.create({
      firstName,
      lastName,
      email,
      parentImage: uploadedImageUrl,
      userId,
      state,
      country,
    });

    if (!parents) {
      return GenResObj(Code.BAD_REQUEST, false, "Parents account not created");
    }

    return GenResObj(Code.CREATED, true, "Parents account added successfully");
  } catch (error) {
    console.log("🚀 ~ signupUser ~ error:", error);
    throw error;
  }
};

export const getParentsAccount = async (payload: getParentsType) => {
  try {
    let { page = 1, limit = 10 } = payload;
    const skip = (page - 1) * limit;

    const parentsAggregate = await Parent.aggregate([
      { $match: { userId: toObjectId(payload.userId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $lookup: {
          from: "childrens",
          localField: "_id",
          foreignField: "parentId",
          as: "childrenData",
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          parentImage: 1,
          email: 1,
          state: 1,
          country: 1,
          createdAt: 1,
          updatedAt: 1,
          userData: {
            _id: 1,
            role: 1,
            phoneNumber: 1,
            isVerified: 1,
            status: 1,
            createdAt: 1,
          },
          childrenData: {
            _id: 1,
            childrenName: 1,
            childrenImage: 1,
            relationship: 1,
            grade: 1,
          },
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const result = parentsAggregate[0] || { metadata: [], data: [] };
    const total = result.metadata[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);
    const nextPage = page < totalPages ? page + 1 : false;

    if (!result.data.length) {
      return GenResObj(Code.BAD_REQUEST, false, "Parents not found");
    }

    return GenResObj(Code.OK, true, "Parents account found successfully", {
      data: result.data,
      total,
      page,
      limit,
      nextPage,
      totalPages,
    });
  } catch (error) {
    console.log("🚀 ~ getParentsAccount ~ error:", error);
    return GenResObj(Code.INTERNAL_SERVER, false, "Something went wrong");
  }
};
