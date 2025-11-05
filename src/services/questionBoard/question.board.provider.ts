import { GenResObj } from "../../utils/responseFormatter.utils.js";
import { HttpStatusCodes as Code } from "../../utils/Enums.utils.js";
import {
  removeImageFromCloudinary,
  upload,
} from "../../utils/cloudinary.utils.js";
import {
  addQuestionBoardType,
  deleteOptionType,
  deleteQuestionBoardType,
  deleteQuestionType,
  getAllQuestionBoardType,
  getQuestionBoardType,
  getUserQuestionBoardType,
  removeImageType,
  updateOptionType,
  updateQuestionBoardItemType,
  updateQuestionBoardType,
  updateQuestionType,
  uploadImageType,
} from "./question.board.validate.js";
import QuestionBoard from "../../models/question.board.model.js";
import QustionGroup from "../../models/question.group.model.js";
import Question from "../../models/question.mode.js";
import Option from "../../models/option.model.js";
import Grade from "../../models/grade.model.js";
import mongoose, { PipelineStage } from "mongoose";
import { toObjectId } from "../../utils/common.utils.js";
import QuestionGroup from "../../models/question.group.model.js";

export const addQuestionBoard = async (payload: addQuestionBoardType) => {
  const session = await mongoose.startSession();
  try {
    let createdBoardId: string | undefined;
    // Upload image BEFORE starting the transaction to avoid side-effects inside the txn
    const uploadedImageUrl = payload.questionImage
      ? (await upload(payload.questionImage)).uploadedImageUrl
      : null;

    await session.withTransaction(async () => {
      let {
        userId,
        role,
        status,
        grade,
        subject,
        type,
        topicId,
        subTopic,
        questions = [],
        isMultipleOptions = false,
        ...rest
      } = payload;

      const findGrade = await Grade.findById(grade);
      if (!findGrade) throw new Error("Grade not found");

      const [questionBoard] = await QuestionBoard.create(
        [
          {
            userId,
            questionImage: uploadedImageUrl,
            status: status,
            subject: subject,
            grade: findGrade._id,
            topic: topicId,
            subTopic,
            type: type,
            ...rest,
          },
        ],
        { session }
      );
      createdBoardId = questionBoard._id.toString();

      // Build unique question groups
      const groupDocs: any[] = [];
      const groupMap = new Map<number, string>();
      const seenGroupNumbers = new Set<number>();

      for (const q of questions) {
        if (!seenGroupNumbers.has(q.number)) {
          groupDocs.push({
            questionBoardId: questionBoard._id,
            isQuestionGroup: q.isQuestionGroup,
            paragraph: q.paragraph,
            number: q.number,
            questionTitle: q.questionTitle,
          });
          seenGroupNumbers.add(q.number);
        }
      }

      const insertedGroups = await QustionGroup.insertMany(groupDocs, {
        session,
      });
      insertedGroups.forEach((g) => groupMap.set(g.number, g._id.toString()));

      // Build questions and options in one pass
      const questionDocs: any[] = [];
      const optionsDocs: any[] = [];

      for (const q of questions) {
        //need to check for correct option
        const correctOptions =
          q.options?.filter((opt) => opt.isCorrect === true) || [];

        // ✅ logic added here for multiple or single correct answers
        if (!isMultipleOptions) {
          if (correctOptions.length !== 1) {
            throw new Error(
              `Question "${q.question}" must have exactly one correct option`
            );
          }
        } else {
          if (correctOptions.length < 1) {
            throw new Error(
              `Question "${q.question}" must have at least one correct option when multiple correct options are allowed`
            );
          }
        }
        const optionTexts = q.options.map((opt) =>
          opt.option.trim().toLowerCase()
        );
        const uniqueOptions = new Set(optionTexts);

        if (uniqueOptions.size !== optionTexts.length) {
          throw new Error(`Question "${q.question}" has duplicate options`);
        }

        const questionId = new mongoose.Types.ObjectId();
        questionDocs.push({
          _id: questionId,
          questionBoardId: questionBoard._id,
          questionGroupId: groupMap.get(q.number),
          question: q.question,
          questionNumber: q.questionNumber,
          questionType: q.questionType,
          questionImage: q.questionImage || null,
          questionDescription: q.questionDescription,
          explanation: q.explanation,
          isQuestionGroup: q.isQuestionGroup || false,
        });

        for (const opt of q.options || []) {
          optionsDocs.push({
            questionId,
            option: opt.option,
            isCorrect: opt.isCorrect,
            optionImage: opt.optionImage || null,
          });
        }
      }

      await Question.insertMany(questionDocs, { session });
      if (optionsDocs.length) await Option.insertMany(optionsDocs, { session });
    });

    return GenResObj(
      Code.CREATED,
      true,
      "Question board created successfully",
      {
        questionBoardId: createdBoardId,
      }
    );
  } catch (error) {
    console.error("🚀 ~ addQuestionBoard ~ error:", error);
    throw error;
  } finally {
    session.endSession();
  }
};

export const updateQuestionBoardItem = async (
  payload: updateQuestionBoardItemType
) => {
  try {
    let { questionBoardId, userId, role, questionImage, ...rest } = payload;

    let findQuestionBoard = await QuestionBoard.findOne({
      _id: questionBoardId,
    });
    if (!findQuestionBoard) throw new Error("Question board not found");

    let currentStatus = findQuestionBoard.status;

    // ✅ Only admin can approve
    if (role === "admin" && rest.status === "APPROVED") {
      if (currentStatus !== "PENDING") {
        return GenResObj(
          Code.BAD_REQUEST,
          false,
          "Only PENDING question boards can be approved"
        );
      }
    }

    // ✅ Non-admin cannot approve
    if (role !== "admin" && rest.status === "APPROVED") {
      return GenResObj(
        Code.UNAUTHORIZED,
        false,
        "You are not authorized to approve this question board"
      );
    }
    if (
      findQuestionBoard.userId.toString() !== userId &&
      (rest.status === "PUBLISHED" || rest.status === "UNPUBLISHED")
    ) {
      GenResObj(Code.UNAUTHORIZED, false, "You are not authorized to publish");
    }
    if (questionImage) {
      const uploaded = await upload(questionImage);
      questionImage = uploaded.uploadedImageUrl;
    }

    const updatedQuestionBoard = await QuestionBoard.findOneAndUpdate(
      { _id: questionBoardId },
      { $set: rest },
      { new: true }
    );
    if (!updatedQuestionBoard) throw new Error("Question board not found");

    return GenResObj(
      Code.OK,
      true,
      "Question board updated successfully",
      updatedQuestionBoard
    );
  } catch (error) {
    console.error("🚀 ~ updateQuestionBoard ~ error:", error);
    throw error;
  }
};

export const getQuestionBoard = async (payload: getQuestionBoardType) => {
  try {
    let {
      userId,
      role,
      page = 1,
      limit = 10,
      questionBoardId,
      country,
      status,
    } = payload;

    const filter: any = {
      _id: toObjectId(questionBoardId),
      // status: "PUBLISHED",
    };
    if (country) filter.country = country;
    if (role !== "admin") filter.userId = toObjectId(userId);

    const questionBoard = await QuestionBoard.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "topics",
          localField: "topic",
          foreignField: "_id",
          as: "topic",
        },
      },
      { $unwind: { path: "$topic", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "subtopics",
          localField: "subTopic",
          foreignField: "_id",
          as: "subTopic",
        },
      },
      { $unwind: { path: "$subTopic", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "grades",
          localField: "grade",
          foreignField: "_id",
          as: "grade",
        },
      },
      { $unwind: { path: "$grade", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          subject: 1,
          subTopic: {
            _id: "$subTopic._id",
            subTopicName: "$subTopic.subTopicName",
          },
          grade: {
            _id: "$grade._id",
            name: "$grade.name",
          },
          topic: {
            _id: "$topic._id",
            topicName: "$topic.topicName",
          },

          questionBoardTitle: 1,
          questionDescription: 1,
          questionBoardImgae: 1,
          level: 1,
          status: 1,
          passPacentage: 1,
          country: 1,
          durationTime: 1,
        },
      },
      {
        $lookup: {
          from: "questiongroups",
          let: { boardId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$questionBoardId", "$$boardId"] } } },
            {
              $facet: {
                questionBoardData: [
                  { $sort: { number: 1 } },
                  { $skip: (page - 1) * limit },
                  { $limit: limit },
                  {
                    $lookup: {
                      from: "questions",
                      let: { groupId: "$_id" },
                      pipeline: [
                        {
                          $match: {
                            $expr: { $eq: ["$questionGroupId", "$$groupId"] },
                          },
                        },
                        { $sort: { questionNumber: 1 } },
                        {
                          $lookup: {
                            from: "options",
                            localField: "_id",
                            foreignField: "questionId",
                            as: "options",
                          },
                        },
                      ],
                      as: "questions",
                    },
                  },
                ],
                count: [
                  {
                    $count: "count",
                  },
                ],
              },
            },
          ],
          as: "questionGroupData",
        },
      },
      {
        $unwind: {
          path: "$questionGroupData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          count: { $first: "$questionGroupData.count" },
        },
      },
    ]);

    if (!questionBoard[0]) throw new Error("Question board not found");
    const board = questionBoard[0];
    const { questionBoardData, count } = board?.questionGroupData;
    let totalCount = count?.[0]?.count || 0;
    let isnextpage = totalCount > page * limit;

    const paginationData = {
      count: totalCount || 0,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      pageSize: limit,
      hasNextPage: isnextpage,
    };
    return GenResObj(Code.OK, true, "Question board fetched successfully", {
      meta: {
        questionBoardId: board?._id,
        level: board?.level,
        questionBoardTitle: board?.questionBoardTitle,
        questionDescription: board?.questionDescription,
        questionBoardImgae: board?.questionBoardImgae,
        status: board?.status,
        passPacentage: board?.passPacentage,
        country: board?.country,
        durationTime: board?.durationTime,
        subject: board?.subject,
        subTopic: board?.subTopic || null,
        grade: board?.grade || null,
        topic: board?.topic || null,
      },
      questionBoardData,
      paginationData,
    });
  } catch (error) {
    console.error("🚀 ~ getQuestionBoard ~ error:", error);
    throw error;
  }
};

export const findAllQuestionBoard = async (
  payload: getAllQuestionBoardType
) => {
  try {
    const {
      userId,
      role,
      gradeId,
      subject,
      searchQuery = "",
      page = 1,
      limit = 10,
      topicId,
      type,
      country,
    } = payload;

    const filter: any = {
      status: "PUBLISHED",
    };

    if (role !== "admin") {
      filter.userId = new mongoose.Types.ObjectId(userId as string);
    }
    if (country) {
      filter.country = country;
    }

    if (gradeId) filter.grade = new mongoose.Types.ObjectId(gradeId as string);
    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    if (searchQuery.trim()) {
      filter.questionBoardTitle = { $regex: searchQuery, $options: "i" };
    }

    const skip = (page - 1) * limit;

    if (topicId) {
      filter.topic = new mongoose.Types.ObjectId(topicId);

      const aggregationPipeline: PipelineStage[] = [
        { $match: filter },
        {
          $lookup: {
            from: "topics",
            localField: "topic",
            foreignField: "_id",
            as: "topicData",
          },
        },
        { $unwind: "$topicData" },
        {
          $lookup: {
            from: "grades",
            localField: "grade",
            foreignField: "_id",
            as: "gradeData",
          },
        },
        { $unwind: "$gradeData" },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            paginatedData: [{ $skip: skip }, { $limit: limit }],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      const result = await QuestionBoard.aggregate(aggregationPipeline);
      const boards = result[0]?.paginatedData || [];
      const totalCount = result[0]?.totalCount?.[0]?.count || 0;

      return GenResObj(Code.OK, true, "All question boards for topic fetched", {
        topicId,
        data: boards,
        paginationData: {
          count: totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          pageSize: limit,
          hasNextPage: totalCount > page * limit,
        },
      });
    }

    const aggregationPipeline: PipelineStage[] = [
      { $match: filter },
      {
        $lookup: {
          from: "topics",
          localField: "topic",
          foreignField: "_id",
          as: "topicData",
        },
      },
      { $unwind: "$topicData" },

      {
        $lookup: {
          from: "grades",
          localField: "grade",
          foreignField: "_id",
          as: "gradeData",
        },
      },
      {
        $lookup: {
          from: "examsessions",
          localField: "userId",
          foreignField: "userId",
          as: "examSessions",
        },
      },
      { $unwind: "$gradeData" },
      {
        $group: {
          _id: "$topicData._id",
          topicName: { $first: "$topicData.topicName" },
          subject: { $first: "$subject" },
          grade: { $first: "$gradeData.name" },
          totalQuestionBoards: { $sum: 1 },

          questionBoards: {
            $push: {
              _id: "$_id",
              questionBoardTitle: "$questionBoardTitle",
              questionBoardImgae: "$questionBoardImgae",
              questionDescription: "$questionDescription",
              level: "$level",
              subject: "$subject",
              status: "$status",
              passPacentage: "$passPacentage",
              durationTime: "$durationTime",
              type: "$type",
              createdAt: "$createdAt",
              examSessions: "$examSessions",
            },
          },
        },
      },
      {
        $addFields: {
          liveBoards: {
            $slice: [
              {
                $filter: {
                  input: "$questionBoards",
                  as: "qb",
                  cond: { $eq: ["$$qb.type", "live"] },
                },
              },
              8,
            ],
          },
          practiceBoards: {
            $slice: [
              {
                $filter: {
                  input: "$questionBoards",
                  as: "qb",
                  cond: { $eq: ["$$qb.type", "practice"] },
                },
              },
              2,
            ],
          },
        },
      },
      {
        $addFields: {
          questionBoards: { $concatArrays: ["$liveBoards", "$practiceBoards"] },
        },
      },
      { $project: { liveBoards: 0, practiceBoards: 0 } },
      { $sort: { topicName: 1 } },
      {
        $facet: {
          paginatedData: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await QuestionBoard.aggregate(aggregationPipeline);
    const topicWiseBoards = result[0]?.paginatedData || [];
    const totalCount = result[0]?.totalCount?.[0]?.count || 0;

    return GenResObj(Code.OK, true, "Topic-wise question board fetched", {
      data: topicWiseBoards,
      paginationData: {
        count: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        pageSize: limit,
        hasNextPage: totalCount > page * limit,
      },
    });
  } catch (error) {
    console.error("🔥 ~ findAllQuestionBoardTopicWise ~ error:", error);
    throw error;
  }
};

export const uploadImage = async (payload: uploadImageType) => {
  try {
    const { image } = payload;
    const data = await upload(image);
    return GenResObj(Code.OK, true, "Image uploaded successfully", data);
  } catch (error) {
    console.error("🚀 ~ uploadImage ~ error:", error);
    throw error;
  }
};

export const removeImage = async (payload: removeImageType) => {
  try {
    const { imageUrl } = payload;
    await removeImageFromCloudinary(imageUrl);
    return GenResObj(Code.OK, true, "Image removed successfully", {});
  } catch (error) {
    console.error("🚀 ~ removeImage ~ error:", error);
    throw error;
  }
};

export const updateQuestion = async (payload: updateQuestionType) => {
  try {
    const { questionId, ...data } = payload;

    let updateData = { ...data };

    if (updateData.questionImage) {
      const { uploadedImageUrl } = await upload(updateData.questionImage);
      updateData.questionImage = uploadedImageUrl;
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) throw new Error("Question not found");

    return GenResObj(
      Code.OK,
      true,
      "Question updated successfully",
      updatedQuestion
    );
  } catch (error) {
    console.error("🚀 ~ updateQuestion ~ error:", error);
    throw error;
  }
};

export const deleteQuestion = async (payload: deleteQuestionType) => {
  try {
    const { questionId } = payload;
    const deletedQuestion = await Question.findOneAndDelete({
      _id: questionId,
    });
    if (!deletedQuestion) throw new Error("Question not found");

    await Option.deleteMany({
      questionId: questionId,
    });

    return GenResObj(Code.OK, true, "Question deleted successfully", {});
  } catch (error) {
    console.error("🚀 ~ deleteQuestion ~ error:", error);
    throw error;
  }
};

export const updateOption = async (payload: updateOptionType) => {
  try {
    const { optionId, isCorrect, ...data } = payload;

    const option = await Option.findById(optionId);
    if (!option) throw new Error("Option not found");

    if (isCorrect === true) {
      const existingCorrect = await Option.findOne({
        questionId: option.questionId,
        isCorrect: true,
        _id: { $ne: optionId },
      });

      if (existingCorrect)
        throw new Error("Another option is already marked as correct");
    }

    const updatedOption = await Option.findByIdAndUpdate(
      optionId,
      { $set: { ...data, ...(isCorrect !== undefined ? { isCorrect } : {}) } },
      { new: true, runValidators: true }
    );

    if (!updatedOption) throw new Error("Option not found");

    return GenResObj(
      Code.OK,
      true,
      "Option updated successfully",
      updatedOption
    );
  } catch (error) {
    console.error("🚀 ~ updateOption ~ error:", error);
    throw error;
  }
};

export const deleteOption = async (payload: deleteOptionType) => {
  try {
    const { optionId } = payload;
    const deletedOption = await Option.findOneAndDelete({
      _id: optionId,
    });
    if (!deletedOption) throw new Error("Option not found");
    return GenResObj(Code.OK, true, "Option deleted successfully", {});
  } catch (error) {
    console.error("🚀 ~ deleteOption ~ error:", error);
    throw error;
  }
};

export const deleteQuestionBoard = async (payload: deleteQuestionBoardType) => {
  try {
    const { questionBoardId } = payload;

    const deletedBoard = await QuestionBoard.findOneAndDelete({
      _id: questionBoardId,
    });
    if (!deletedBoard) throw new Error("Question board not found");

    const questions = await Question.find({ questionBoardId });
    const questionIds = questions.map((q: any) => q._id);

    await Promise.all([
      QuestionGroup.deleteMany({ questionBoardId }),
      Question.deleteMany({ questionBoardId }),
      Option.deleteMany({ questionId: { $in: questionIds } }),
    ]);

    return GenResObj(Code.OK, true, "Question board deleted successfully", {});
  } catch (error) {
    console.error("🚀 ~ deleteQuestionBoard ~ error:", error);
    throw error;
  }
};

export const updateQuestionBoard = async (payload: updateQuestionBoardType) => {
  const session = await mongoose.startSession();
  try {
    const {
      questionBoardId,
      userId,
      role,
      grade,
      subject,
      type,
      topicId,
      subTopic,
      questions = [],
      isMultipleOptions = false,
      ...rest
    } = payload;

    await session.withTransaction(async () => {
      if (!questionBoardId) {
        throw new Error("questionBoardId is required");
      }

      // 1️⃣ Find QuestionBoard
      const board = await QuestionBoard.findOne({ _id: questionBoardId });
      if (!board) {
        throw new Error("QuestionBoard not found");
      }
      let currentStatus = board.status;

      // 2️⃣ Delete all existing questions & options for this board
      const existingQuestions = await Question.find({ questionBoardId });
      const questionIds = existingQuestions.map((q) => q._id);

      await Promise.all([
        QuestionGroup.deleteMany({ questionBoardId }, { session }),
        Question.deleteMany({ questionBoardId }, { session }),
        Option.deleteMany({ questionId: { $in: questionIds } }, { session }),
      ]);

      // Upload image BEFORE starting the transaction to avoid side-effects inside the txn

      const findGrade = await Grade.findById(grade);
      if (!findGrade) throw new Error("Grade not found");

      // ✅ Only admin can approve
      if (role === "admin" && rest.status === "APPROVED") {
        if (currentStatus !== "PENDING") {
          throw new Error("Only PENDING question boards can be approved");
        }
      }

      // ✅ Non-admin cannot approve
      if (role !== "admin" && rest.status === "APPROVED") {
        throw new Error(
          "You are not authorized to approve this question board"
        );
      }
      if (
        board.userId.toString() !== userId &&
        (rest.status === "PUBLISHED" || rest.status === "UNPUBLISHED")
      ) {
        GenResObj(
          Code.UNAUTHORIZED,
          false,
          "You are not authorized to publish"
        );
      }

      const questionBoard = await QuestionBoard.findByIdAndUpdate(
        questionBoardId,
        {
          questionBoardTitle: payload.questionBoardTitle,
          topicId: payload.topicId,
          subTopic: payload.subTopic,
          grade: payload.grade,
          durationTime: payload.durationTime,
          level: payload.level,
          status: payload.status || board.status,
          passPacentage: payload.passPacentage,
          subject: payload.subject,
          country: payload.country,
          type: payload.type,
          ...(payload.questionBoardImgae && {
            questionBoardImgae: payload.questionBoardImgae,
          }),
        },
        { session, new: true }
      );

      // Build unique question groups
      const groupDocs: any[] = [];
      const groupMap = new Map<number, string>();
      const seenGroupNumbers = new Set<number>();

      for (const q of questions) {
        if (!seenGroupNumbers.has(q.number)) {
          groupDocs.push({
            questionBoardId: questionBoard!._id,
            isQuestionGroup: q.isQuestionGroup,
            paragraph: q.paragraph,
            number: q.number,
            questionTitle: q.questionTitle,
          });
          seenGroupNumbers.add(q.number);
        }
      }

      const insertedGroups = await QustionGroup.insertMany(groupDocs, {
        session,
      });
      insertedGroups.forEach((g) => groupMap.set(g.number, g._id.toString()));

      // Build questions and options in one pass
      const questionDocs: any[] = [];
      const optionsDocs: any[] = [];

      for (const q of questions) {
        //need to check for correct option
        const correctOptions =
          q.options?.filter((opt) => opt.isCorrect === true) || [];
        if (!isMultipleOptions) {
          if (correctOptions.length !== 1) {
            throw new Error(
              `Question "${q.question}" must have exactly one correct option`
            );
          }
        } else {
          if (correctOptions.length < 1) {
            throw new Error(
              `Question "${q.question}" must have at least one correct option when multiple correct options are allowed`
            );
          }
        }

        const questionId = new mongoose.Types.ObjectId();
        questionDocs.push({
          _id: questionId,
          questionBoardId: questionBoard!._id,
          questionGroupId: groupMap.get(q.number),
          question: q.question,
          questionNumber: q.questionNumber,
          questionType: q.questionType,
          questionImage: q.questionImage || null,
          questionDescription: q.questionDescription,
          explanation: q.explanation,
          isQuestionGroup: q.isQuestionGroup || false,
        });

        for (const opt of q.options || []) {
          optionsDocs.push({
            questionId,
            option: opt.option,
            isCorrect: opt.isCorrect,
            optionImage: opt.optionImage || null,
          });
        }
      }

      await Question.insertMany(questionDocs, { session });
      if (optionsDocs.length) await Option.insertMany(optionsDocs, { session });
    });

    return GenResObj(Code.OK, true, "Question board updated successfully", {
      questionBoardId,
    });
  } catch (error) {
    console.error("🚀 ~ addQuestionBoard ~ error:", error);
    throw error;
  } finally {
    session.endSession();
  }
};

export const getUserQuestionBoard = async (
  payload: getUserQuestionBoardType
) => {
  try {
    const {
      userId,
      page = 1,
      limit = 10,
      country,
      type,
      status,
      subject,
    } = payload;

    const skip = (page - 1) * limit;

    const match: any = {
      userId: new mongoose.Types.ObjectId(userId as string),
      ...(country && { country }),
      ...(type && { type }),
      ...(status && { status }),
      ...(subject && { subject }),
    };

    const [result] = await QuestionBoard.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const total = result.totalCount?.[0]?.count || 0;
    const isNext = total > page * limit;

    return GenResObj(Code.OK, true, "Question board fetched successfully", {
      total,
      page,
      limit,
      isNext,
      data: result.data || [],
    });
  } catch (error) {
    console.error("🚀 ~ getUserQuestionBoard ~ error:", error);
    throw error;
  }
};
