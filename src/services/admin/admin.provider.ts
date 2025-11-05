import QuestionBoard from "../../models/question.board.model.js";
import PopUp from "../../models/popUp.model.js";
import { GenResObj } from "../../utils/responseFormatter.utils.js";
import {
  AddSubTopicNameType,
  AddTopicNameType,
  adminApproveQuestionBoardType,
  createPopUpType,
  deletePopUpType,
  deleteTopicNameType,
  findAllQuestionBoardForAdminType,
  getPopUpsType,
  getTopicType,
  updatePopUpType,
  updateTopicNameType,
  createFlashcardType,
  updateFlashcardType,
  getFlashcardsType,
  deleteFlashcardType,
  createUserGuideType,
  updateUserGuideType,
  getUserGuidesType,
  deleteUserGuideType,
  createResourceType,
  updateResourceType,
  getResourcesType,
  deleteResourceType,
  createSample40DayPlanType,
  getSample40DayPlanType,
  updateSample40DayPlanType,
  deleteSample40DayPlanType,
} from "./admin.validate.js";
import { HttpStatusCodes as Code } from "../../utils/Enums.utils.js";
import { Types } from "mongoose";
import topic from "../../models/topic.model.js";
import Grade from "../../models/grade.model.js";
import Subtopic from "../../models/sub.topic.model.js";
import { upload } from "../../utils/cloudinary.utils.js";
import Flashcard from "../../models/flashcard.model.js";
import UserGuide from "../../models/userGuide.model.js";
import { Resource } from "../../models/resource.model.js";
import Sample40DayPlan from "../../models/sample.40.day.plan.model.js";

export const adminApproveQuestionBoard = async (
  payload: adminApproveQuestionBoardType
) => {
  try {
    const { questionBoardId, status } = payload;

    const questionBoard = await QuestionBoard.findOneAndUpdate(
      { _id: questionBoardId },
      { $set: { status: status } },
      { new: true, runValidators: true }
    );
    if (!questionBoard) throw new Error("Question board not found");

    return GenResObj(
      Code.OK,
      true,
      "Question board approved successfully",
      questionBoard
    );
  } catch (error) {
    console.error("🚀 ~ adminApproveQuestionBoard ~ error:", error);
    throw error;
  }
};

export const createPopUp = async (payload: createPopUpType) => {
  try {
    const { name, description, validTill, descriptionFileUrl } = payload;
    let uploadedFileUrl: string | undefined | any;

    if (descriptionFileUrl) {
      uploadedFileUrl = await upload(descriptionFileUrl);
    }

    const popUp = await PopUp.create({
      name,
      description,
      validTill,
      descriptionFileUrl: uploadedFileUrl.uploadedImageUrl || null,
      createdAt: new Date(),
    });

    return GenResObj(Code.CREATED, true, "Pop-up created successfully", popUp);
  } catch (error) {
    console.error("🚀 ~ createPopUp ~ error:", error);
    throw error;
  }
};

export const getPopUps = async (payload: getPopUpsType) => {
  try {
    const { page, limit } = payload;
    const skip = (page - 1) * limit;

    const popUps = await PopUp.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const totalPopUps = await PopUp.countDocuments();

    return GenResObj(Code.OK, true, "Pop-ups fetched successfully", {
      popUps,
      totalPopUps,
      page,
      limit,
      totalPages: Math.ceil(totalPopUps / limit),
    });
  } catch (error) {
    console.error("🚀 ~ getPopUps ~ error:", error);
    throw error;
  }
};

export const updatePopUp = async (payload: updatePopUpType) => {
  try {
    const { popUpId, name, description, validTill, descriptionFileUrl } =
      payload;
    let uploadedFileUrl: string | undefined | any;

    if (descriptionFileUrl) {
      uploadedFileUrl = await upload(descriptionFileUrl);
    }

    const popUp = await PopUp.findByIdAndUpdate(
      popUpId,
      {
        $set: {
          name,
          description,
          validTill,
          descriptionFileUrl: uploadedFileUrl.uploadedImageUrl || null,
        },
      },
      { new: true, runValidators: true }
    );

    if (!popUp) throw new Error("Pop-up not found");

    return GenResObj(Code.OK, true, "Pop-up updated successfully", popUp);
  } catch (error) {
    console.error("🚀 ~ updatePopUp ~ error:", error);
    throw error;
  }
};

export const deletePopUp = async (payload: deletePopUpType) => {
  try {
    const { popUpId } = payload;

    const popUp = await PopUp.findByIdAndDelete(popUpId);

    if (!popUp) throw new Error("Pop-up not found");

    return GenResObj(Code.OK, true, "Pop-up deleted successfully", null);
  } catch (error) {
    console.error("🚀 ~ deletePopUp ~ error:", error);
    throw error;
  }
};
export const adminAddTopicName = async (payload: AddTopicNameType) => {
  try {
    const { topicName, gradeId, subject } = payload;

    let findGrade = await Grade.findOne({ _id: gradeId });
    if (!findGrade)
      return GenResObj(Code.BAD_REQUEST, false, "Grade not found");

    let crateTheTopic = await topic.create({
      topicName,
      grade: findGrade._id,
      subject: subject,
    });

    if (!crateTheTopic)
      return GenResObj(Code.BAD_REQUEST, false, "Topic not created");

    return GenResObj(Code.OK, true, "Topic name added successfully");
  } catch (error) {
    console.error("🚀 ~ adminApproveQuestionBoard ~ error:", error);
    throw error;
  }
};

export const adminRemoveTopicName = async (payload: deleteTopicNameType) => {
  try {
    const { topicId } = payload;
    let fidnTopic = await topic.findOne({ _id: topicId });
    if (!fidnTopic)
      return GenResObj(Code.BAD_REQUEST, false, "Topic not found");

    let removeTheTopic = await topic.deleteOne({ _id: topicId });
    if (!removeTheTopic)
      return GenResObj(Code.BAD_REQUEST, false, "Topic not removed");

    let removeAllSubTopics = await Subtopic.deleteMany({
      topicId: topicId,
    });
    if (!removeAllSubTopics)
      return GenResObj(Code.BAD_REQUEST, false, "Subtopics not removed");

    return GenResObj(Code.OK, true, "Topic name removed successfully");
  } catch (error) {
    console.error("🚀 ~ adminApproveQuestionBoard ~ error:", error);
    throw error;
  }
};

export const adminUpdateTopicName = async (payload: updateTopicNameType) => {
  try {
    const { topicId, topicName } = payload;

    let updateTheTopic = await topic.findOneAndUpdate(
      { _id: topicId },
      { $set: { topicName: topicName } },
      { new: true, runValidators: true }
    );

    if (!updateTheTopic)
      return GenResObj(Code.BAD_REQUEST, false, "Topic not updated");

    return GenResObj(Code.OK, true, "Topic name updated successfully");
  } catch (error) {
    console.error("🚀 ~ adminApproveQuestionBoard ~ error:", error);
    throw error;
  }
};

export const adminGetAllTopicName = async (payload: getTopicType) => {
  try {
    const { topicId, page, limit } = payload;

    const skip = (page - 1) * limit;

    // If no topicId: return paginated list of topics (no subtopics here)
    if (!topicId) {
      const { subject, searchQuery } = payload as any;

      const match: any = {};
      if (subject) match.subject = subject;
      if (searchQuery)
        match.topicName = { $regex: String(searchQuery), $options: "i" };

      const aggregation = await topic.aggregate([
        { $match: match },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            data: [
              {
                $project: {
                  _id: 1,
                  topicName: 1,
                  subject: 1,
                  gradeId: 1,
                  createdAt: 1,
                },
              },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [{ $count: "count" }],
          },
        },
        {
          $project: {
            data: 1,
            total: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
          },
        },
      ]);

      const result = aggregation[0] || { data: [], total: 0 };
      const totalPages = Math.ceil(result.total / limit);
      const hasNext = page < totalPages;

      return GenResObj(Code.OK, true, "Topic(s) fetched successfully", {
        data: result.data,
        pagination: {
          total: result.total,
          page: Number(page),
          limit: Number(limit),
          totalPages,
          hasNext,
        },
      });
    }

    // If topicId present: return paginated subtopics for that topic (no topic embed)
    const aggregation = await Subtopic.aggregate([
      { $match: { topicId: new Types.ObjectId(String(topicId)) } },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [
            { $project: { _id: 1, subTopicName: 1, topicId: 1, createdAt: 1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
      {
        $project: {
          data: 1,
          total: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
        },
      },
    ]);

    const result = aggregation[0] || { data: [], total: 0 };
    const totalPages = Math.ceil(result.total / limit);
    const hasNext = page < totalPages;

    return GenResObj(Code.OK, true, "Subtopic(s) fetched successfully", {
      data: result.data,
      pagination: {
        total: result.total,
        page: Number(page),
        limit: Number(limit),
        totalPages,
        hasNext,
      },
    });
  } catch (error) {
    console.error("🚀 ~ adminGetAllTopicName ~ error:", error);
    throw error;
  }
};

export const addSubTopicName = async (payload: AddSubTopicNameType) => {
  try {
    const { topicId, subTopicName } = payload;

    let findTopic = await topic.findOne({ _id: topicId });
    if (!findTopic)
      return GenResObj(Code.BAD_REQUEST, false, "subTopic not found");

    let crateTheSubTopic = await Subtopic.create({
      subTopicName,
      topicId: topicId,
    });

    if (!crateTheSubTopic)
      return GenResObj(Code.BAD_REQUEST, false, "subTopic not created");

    return GenResObj(Code.OK, true, "subTopic name added successfully");
  } catch (error) {
    throw error;
  }
};

export const getQuestionBoardForAdmin = async (
  payload: findAllQuestionBoardForAdminType
) => {
  try {
    const { page, limit, search = "" } = payload;

    let match: any = {
      status: { $ne: "DARFT" },
    };
    if (search) {
      match["$or"] = [
        { questionBoardTitle: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }

    const findAllQuestionBoard = await QuestionBoard.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "topics",
          localField: "topic",
          foreignField: "_id",
          as: "topic",
        },
      },
      {
        $lookup: {
          from: "subtopics",
          localField: "subTopic",
          foreignField: "_id",
          as: "subTopic",
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
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
          pipeline: [{ $project: { role: 1 } }],
        },
      },
      {
        $lookup: {
          from: "tutors",
          localField: "userId",
          foreignField: "userId",
          as: "tutorInfo",
          pipeline: [{ $project: { firstName: 1, lastName: 1 } }],
        },
      },
      {
        $lookup: {
          from: "parents",
          localField: "userId",
          foreignField: "userId",
          as: "parentInfo",
        },
      },
      {
        $addFields: {
          userDetails: {
            $ifNull: [
              {
                $cond: {
                  if: { $eq: [{ $arrayElemAt: ["$user.role", 0] }, "tutor"] },
                  then: { $arrayElemAt: ["$tutorInfo", 0] },
                  else: { $arrayElemAt: ["$parentInfo", 0] },
                },
              },
              null,
            ],
          },
        },
      },

      // flatten topicName & subTopicName
      {
        $addFields: {
          topicName: {
            $arrayElemAt: [
              {
                $map: {
                  input: "$topic",
                  as: "t",
                  in: "$$t.topicName",
                },
              },
              0,
            ],
          },
          subTopicName: {
            $arrayElemAt: [
              {
                $map: {
                  input: "$subTopic",
                  as: "s",
                  in: "$$s.subTopicName",
                },
              },
              0,
            ],
          },
        },
      },

      // final projection
      {
        $project: {
          questionBoardTitle: 1,
          type: 1,
          userDetails: 1,
          role: { $arrayElemAt: ["$user.role", 0] },
          grade: { $arrayElemAt: ["$grade.name", 0] },
          subject: 1,
          createdAt: 1,
          updatedAt: 1,
          status: 1,
          topicName: 1,
          subTopicName: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },

      {
        $addFields: {
          total: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
        },
      },
    ]);

    const result = findAllQuestionBoard[0] || { data: [], total: 0 };
    const totalPages = Math.ceil(result.total / limit);

    return GenResObj(Code.OK, true, "Question board fetched successfully", {
      data: result.data,
      total: result.total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
    });
  } catch (error) {
    throw error;
  }
};
export const createFlashcard = async (payload: createFlashcardType) => {
  try {
    const {
      title,
      description,
      gradeId,
      subject,
      topicId,
      subTopicId,
      previewImage,
      file,
    } = payload;

    let uploadedPreviewImageUrl: string | undefined | any;
    let uploadedFileUrl: string | undefined | any;

    if (previewImage) {
      uploadedPreviewImageUrl = await upload(previewImage);
    }

    if (file) {
      uploadedFileUrl = await upload(file);
    }

    const flashcard = await Flashcard.create({
      title,
      description,
      grade: gradeId,
      subject,
      topic: topicId,
      subTopic: subTopicId,
      previewImage: uploadedPreviewImageUrl.uploadedImageUrl || null,
      file: uploadedFileUrl.uploadedImageUrl || null,
    });

    return GenResObj(
      Code.CREATED,
      true,
      "Flashcard created successfully",
      flashcard
    );
  } catch (error) {
    console.error("🚀 ~ createFlashcard ~ error:", error);
    throw error;
  }
};

export const getFlashcards = async (payload: getFlashcardsType) => {
  try {
    const { page, limit, searchQuery, gradeId, subject, topicId, subTopicId } =
      payload;
    const skip = (page - 1) * limit;

    const match: any = {};
    if (searchQuery)
      match.title = { $regex: String(searchQuery), $options: "i" };
    if (gradeId) match.grade = new Types.ObjectId(String(gradeId));
    if (subject) match.subject = subject;
    if (topicId) match.topic = new Types.ObjectId(String(topicId));
    if (subTopicId) match.subTopic = new Types.ObjectId(String(subTopicId));

    const flashcards = await Flashcard.find(match)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalFlashcards = await Flashcard.countDocuments(match);

    return GenResObj(Code.OK, true, "Flashcards fetched successfully", {
      flashcards,
      totalFlashcards,
      page,
      limit,
      totalPages: Math.ceil(totalFlashcards / limit),
    });
  } catch (error) {
    console.error("🚀 ~ getFlashcards ~ error:", error);
    throw error;
  }
};

export const updateFlashcard = async (payload: updateFlashcardType) => {
  try {
    const {
      flashcardId,
      title,
      description,
      gradeId,
      subject,
      topicId,
      subTopicId,
      previewImage,
      file,
    } = payload;

    let uploadedPreviewImageUrl: string | undefined | any;
    let uploadedFileUrl: string | undefined | any;

    if (previewImage) {
      uploadedPreviewImageUrl = await upload(previewImage);
    }

    if (file) {
      uploadedFileUrl = await upload(file);
    }

    const flashcard = await Flashcard.findByIdAndUpdate(
      flashcardId,
      {
        $set: {
          title,
          description,
          grade: gradeId,
          subject,
          topic: topicId,
          subTopic: subTopicId,
          previewImage: uploadedPreviewImageUrl.uploadedImageUrl,
          file: uploadedFileUrl.uploadedImageUrl,
        },
      },
      { new: true, runValidators: true }
    );

    if (!flashcard) throw new Error("Flashcard not found");

    return GenResObj(
      Code.OK,
      true,
      "Flashcard updated successfully",
      flashcard
    );
  } catch (error) {
    console.error("🚀 ~ updateFlashcard ~ error:", error);
    throw error;
  }
};

export const deleteFlashcard = async (payload: deleteFlashcardType) => {
  try {
    const { flashcardId } = payload;

    const flashcard = await Flashcard.findByIdAndDelete(flashcardId);

    if (!flashcard) throw new Error("Flashcard not found");

    return GenResObj(Code.OK, true, "Flashcard deleted successfully", null);
  } catch (error) {
    console.error("🚀 ~ deleteFlashcard ~ error:", error);
    throw error;
  }
};

export const createUserGuide = async (payload: createUserGuideType) => {
  try {
    const { title, description, image, file } = payload;

    let uploadedImageUrl: string | undefined | any;
    let uploadedFileUrl: string | undefined | any;

    if (image) {
      uploadedImageUrl = await upload(image);
    }

    if (file) {
      uploadedFileUrl = await upload(file);
    }

    const userGuide = await UserGuide.create({
      title,
      description,
      image: uploadedImageUrl.uploadedImageUrl || null,
      file: uploadedFileUrl.uploadedImageUrl || null,
    });

    return GenResObj(
      Code.CREATED,
      true,
      "User guide created successfully",
      userGuide
    );
  } catch (error) {
    console.error("🚀 ~ createUserGuide ~ error:", error);
    throw error;
  }
};

export const getUserGuides = async (payload: getUserGuidesType) => {
  try {
    const { page, limit, searchQuery } = payload;
    const skip = (page - 1) * limit;

    const match: any = {};
    if (searchQuery)
      match.title = { $regex: String(searchQuery), $options: "i" };

    const userGuides = await UserGuide.find(match)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUserGuides = await UserGuide.countDocuments(match);

    return GenResObj(Code.OK, true, "User guides fetched successfully", {
      userGuides,
      totalUserGuides,
      page,
      limit,
      totalPages: Math.ceil(totalUserGuides / limit),
    });
  } catch (error) {
    console.error("🚀 ~ getUserGuides ~ error:", error);
    throw error;
  }
};

export const updateUserGuide = async (payload: updateUserGuideType) => {
  try {
    const { userGuideId, title, description, image, file } = payload;

    let uploadedImageUrl: string | undefined | any;
    let uploadedFileUrl: string | undefined | any;

    if (image) {
      uploadedImageUrl = await upload(image);
    }

    if (file) {
      uploadedFileUrl = await upload(file);
    }

    const userGuide = await UserGuide.findByIdAndUpdate(
      userGuideId,
      {
        $set: {
          title,
          description,
          image: uploadedImageUrl.uploadedImageUrl,
          file: uploadedFileUrl.uploadedImageUrl,
        },
      },
      { new: true, runValidators: true }
    );

    if (!userGuide) throw new Error("User guide not found");

    return GenResObj(
      Code.OK,
      true,
      "User guide updated successfully",
      userGuide
    );
  } catch (error) {
    console.error("🚀 ~ updateUserGuide ~ error:", error);
    throw error;
  }
};

export const deleteUserGuide = async (payload: deleteUserGuideType) => {
  try {
    const { userGuideId } = payload;

    const userGuide = await UserGuide.findByIdAndDelete(userGuideId);

    if (!userGuide) throw new Error("User guide not found");

    return GenResObj(Code.OK, true, "User guide deleted successfully", null);
  } catch (error) {
    console.error("🚀 ~ deleteUserGuide ~ error:", error);
    throw error;
  }
};

export const createResource = async (payload: createResourceType) => {
  try {
    const { title, description, image, file } = payload;

    let uploadedImageUrl: string | undefined | any;
    let uploadedFileUrl: string | undefined | any;

    if (image) {
      uploadedImageUrl = await upload(image);
    }

    if (file) {
      uploadedFileUrl = await upload(file);
    }

    const resource = await Resource.create({
      title,
      description,
      image: uploadedImageUrl?.uploadedImageUrl || null,
      file: uploadedFileUrl?.uploadedImageUrl || null,
    });

    return GenResObj(
      Code.CREATED,
      true,
      "Resource created successfully",
      resource
    );
  } catch (error) {
    console.error("🚀 ~ createResource ~ error:", error);
    throw error;
  }
};

export const getResources = async (payload: getResourcesType) => {
  try {
    const { page, limit, searchQuery } = payload;
    const skip = (page - 1) * limit;

    const match: any = {};
    if (searchQuery)
      match.title = { $regex: String(searchQuery), $options: "i" };

    const resources = await Resource.find(match)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalResources = await Resource.countDocuments(match);

    return GenResObj(Code.OK, true, "Resources fetched successfully", {
      resources,
      totalResources,
      page,
      limit,
      totalPages: Math.ceil(totalResources / limit),
    });
  } catch (error) {
    console.error("🚀 ~ getResources ~ error:", error);
    throw error;
  }
};

export const updateResource = async (payload: updateResourceType) => {
  try {
    const { resourceId, title, description, image, file } = payload;

    let uploadedImageUrl: string | undefined | any;
    let uploadedFileUrl: string | undefined | any;

    if (image) {
      uploadedImageUrl = await upload(image);
    }

    if (file) {
      uploadedFileUrl = await upload(file);
    }

    const resource = await Resource.findByIdAndUpdate(
      resourceId,
      {
        $set: {
          title,
          description,
          image: uploadedImageUrl?.uploadedImageUrl,
          file: uploadedFileUrl?.uploadedImageUrl,
        },
      },
      { new: true, runValidators: true }
    );

    if (!resource) throw new Error("Resource not found");

    return GenResObj(Code.OK, true, "Resource updated successfully", resource);
  } catch (error) {
    console.error("🚀 ~ updateResource ~ error:", error);
    throw error;
  }
};

export const deleteResource = async (payload: deleteResourceType) => {
  try {
    const { resourceId } = payload;

    const resource = await Resource.findByIdAndDelete(resourceId);

    if (!resource) throw new Error("Resource not found");

    return GenResObj(Code.OK, true, "Resource deleted successfully", null);
  } catch (error) {
    console.error("🚀 ~ deleteResource ~ error:", error);
    throw error;
  }
};

export const createSample40DayPlan = async (
  payload: createSample40DayPlanType
) => {
  try {
    const {
      planName,
      planType,
      gradeId,
      subject,
      topicId,
      subTopicId,
      displayImage,
      videoUrl,
    } = payload;

    let uploadedDisplayImageUrl: string | undefined | any;

    if (displayImage) {
      uploadedDisplayImageUrl = await upload(displayImage);
    }

    const sample40DayPlan = await Sample40DayPlan.create({
      planName,
      planType,
      grade: gradeId,
      subject,
      topic: topicId,
      subTopic: subTopicId,
      displayImage: uploadedDisplayImageUrl.uploadedImageUrl || null,
      videoUrl,
    });

    return GenResObj(
      Code.CREATED,
      true,
      "Sample 40-a-day plan created successfully",
      sample40DayPlan
    );
  } catch (error) {
    console.error("🚀 ~ createSample40DayPlan ~ error:", error);
    throw error;
  }
};

export const getSample40DayPlans = async (payload: getSample40DayPlanType) => {
  try {
    const { page, limit, searchQuery, gradeId, subject, topicId, subTopicId } =
      payload;
    const skip = (page - 1) * limit;

    const match: any = {};
    if (searchQuery)
      match.planName = { $regex: String(searchQuery), $options: "i" };
    if (gradeId) match.grade = new Types.ObjectId(String(gradeId));
    if (subject) match.subject = subject;
    if (topicId) match.topic = new Types.ObjectId(String(topicId));
    if (subTopicId) match.subTopic = new Types.ObjectId(String(subTopicId));

    const sample40DayPlans = await Sample40DayPlan.find(match)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalSample40DayPlans = await Sample40DayPlan.countDocuments(match);

    return GenResObj(
      Code.OK,
      true,
      "Sample 40-a-day plans fetched successfully",
      {
        sample40DayPlans,
        totalSample40DayPlans,
        page,
        limit,
        totalPages: Math.ceil(totalSample40DayPlans / limit),
      }
    );
  } catch (error) {
    console.error("🚀 ~ getSample40DayPlans ~ error:", error);
    throw error;
  }
};

export const updateSample40DayPlan = async (
  payload: updateSample40DayPlanType
) => {
  try {
    const {
      sample40DayPlanId,
      planName,
      planType,
      gradeId,
      subject,
      topicId,
      subTopicId,
      displayImage,
      videoUrl,
    } = payload;

    let uploadedDisplayImageUrl: string | undefined | any;

    if (displayImage) {
      uploadedDisplayImageUrl = await upload(displayImage);
    }

    const sample40DayPlan = await Sample40DayPlan.findByIdAndUpdate(
      sample40DayPlanId,
      {
        $set: {
          planName,
          planType,
          grade: gradeId,
          subject,
          topic: topicId,
          subTopic: subTopicId,
          displayImage: uploadedDisplayImageUrl.uploadedImageUrl,
          videoUrl,
        },
      },
      { new: true, runValidators: true }
    );

    if (!sample40DayPlan) throw new Error("Sample 40-a-day plan not found");

    return GenResObj(
      Code.OK,
      true,
      "Sample 40-a-day plan updated successfully",
      sample40DayPlan
    );
  } catch (error) {
    console.error("🚀 ~ updateSample40DayPlan ~ error:", error);
    throw error;
  }
};

export const deleteSample40DayPlan = async (
  payload: deleteSample40DayPlanType
) => {
  try {
    const { sample40DayPlanId } = payload;

    const sample40DayPlan = await Sample40DayPlan.findByIdAndDelete(
      sample40DayPlanId
    );

    if (!sample40DayPlan) throw new Error("Sample 40-a-day plan not found");

    return GenResObj(
      Code.OK,
      true,
      "Sample 40-a-day plan deleted successfully",
      null
    );
  } catch (error) {
    console.error("🚀 ~ deleteSample40DayPlan ~ error:", error);
    throw error;
  }
};
