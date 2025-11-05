import { GenResObj } from "../../utils/responseFormatter.utils.js";
import { HttpStatusCodes as Code } from "../../utils/Enums.utils.js";
import { getGradesType } from "./grade.validate.js";
import Grade from "../../models/grade.model.js";
import topic from "../../models/topic.model.js";
import mongoose from "mongoose";

export const findAllGrade = async (payload: getGradesType) => {
  try {
    let { page = 1, limit = 20, gradeId, country } = payload;
    const skip = (page - 1) * limit;

    if (gradeId) {
      const data = await Grade.findOne({
        _id: gradeId,
        ...(country ? { country } : {}),
      });
      if (!data) {
        return GenResObj(Code.BAD_REQUEST, false, "Grade not found");
      }
      return GenResObj(Code.CREATED, true, "Grades fetched successfully", data);
    }

    const filter = country ? { country } : {};
    const data = await Grade.find(filter).skip(skip).limit(limit);

    return GenResObj(Code.OK, true, "Grades fetched successfully", data);
  } catch (error) {
    console.log("🚀 ~ findAllGrade ~ error:", error);
    throw error;
  }
};

export const findAllTopic = async (payload: any) => {
  try {
    let { page = 1, limit = 20, topicId, gradeId, country, subject } = payload;
    const skip = (page - 1) * limit;

    if (topicId) {
      const data = await topic.findOne({
        _id: topicId,
        ...(gradeId ? { gradeId } : {}),
        ...(country ? { country } : {}),
      });

      if (!data) {
        return GenResObj(Code.BAD_REQUEST, false, "Topic not found");
      }

      return GenResObj(Code.OK, true, "Topic fetched successfully", {
        total: 1,
        page: 1,
        limit: 1,
        isNext: false,
        data: [data],
      });
    }

    const filter: any = {};
    if (country) filter.country = country;
    if (gradeId) filter.gradeId = new mongoose.Types.ObjectId(gradeId);
    if (subject) filter.subject = subject;

    const [data, total] = await Promise.all([
      topic.find(filter).skip(skip).limit(limit),
      topic.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);
    const isNext = page < totalPages;

    return GenResObj(Code.OK, true, "Topics fetched successfully", {
      total,
      page,
      limit,
      isNext,
      data,
    });
  } catch (error) {
    console.log("🚀 ~ findAllTopic ~ error:", error);
    throw error;
  }
};
