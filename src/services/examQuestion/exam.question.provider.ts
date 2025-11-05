import { GenResObj } from "../../utils/responseFormatter.utils.js";
import { HttpStatusCodes as Code } from "../../utils/Enums.utils.js";
import examQuestion from "../../models/exam.question.model.js";
import Option from "../../models/option.model.js";
import ExamSessions from "../../models/exam.session.model.js";
import {
  endExamQuestionType,
  examQuestionType,
} from "./exam.question.validate.js";
import { toObjectId } from "../../utils/common.utils.js";

export const updateExamQuestionSession = async (payload: examQuestionType) => {
  try {
    const { questionId, userExamId, optionId, userId, isFlag } = payload;

    const [examQuestionDoc, examSessionDoc, optionDoc] = await Promise.all([
      examQuestion.findOne({ questionId, userExamId, userId }, { _id: 1 }),
      ExamSessions.findOne(
        { _id: userExamId, status: "IN_PROGRESS" },
        { _id: 1 }
      ),
      Option.findOne({ _id: optionId, questionId }, { isCorrect: 1 }),
    ]);

    if (!examQuestionDoc)
      return GenResObj(Code.BAD_REQUEST, false, "Exam question not found");
    if (!examSessionDoc)
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "Exam not found or already completed"
      );
    if (!optionDoc)
      return GenResObj(Code.BAD_REQUEST, false, "Option not found");

    const updateFields: Record<string, any> = {
      optionId,
      isCorrect: !!optionDoc.isCorrect,
      answerAt: new Date(),
    };
    if (typeof isFlag === "boolean") updateFields.isFlag = isFlag;

    await examQuestion.updateOne(
      { _id: examQuestionDoc._id },
      { $set: updateFields }
    );

    return GenResObj(Code.OK, true, "Answer updated successfully");
  } catch (error) {
    console.error("🚀 ~ updateExamQuestionSession ~ error:", error);
    throw error;
  }
};

export const endExamQuestionSession = async (payload: endExamQuestionType) => {
  try {
    const { userExamId } = payload;

    const [correctCount, totalCount] = await Promise.all([
      examQuestion.countDocuments({ userExamId, isCorrect: true }),
      examQuestion.countDocuments({ userExamId }),
    ]);

    const percentile = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

    let result = await ExamSessions.updateOne(
      { _id: userExamId, status: "IN_PROGRESS" },
      {
        $set: {
          status: "COMPLETED",
          finalScore: correctCount,
          percentile,
          endTime: new Date(),
        },
      }
    );
    if (!result.modifiedCount)
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "Exam not found or already completed"
      );

    return GenResObj(Code.OK, true, "Exam completed successfully");
  } catch (error) {
    console.error("🚀 ~ endExamQuestionSession ~ error:", error);
    throw error;
  }
};

export const findGetFlaggedQuestion = async (payload: any) => {
  try {
    const { userExamId } = payload;

    const data = await examQuestion.aggregate([
      {
        $match: {
          userExamId: toObjectId(userExamId),
          isFlag: true,
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "questionId",
          foreignField: "_id",
          as: "question",
        },
      },
      {
        $project: {
          _id: 1,
          questionId: 1,
          optionId: 1,
          userId: 1,
          userExamId: 1,
          isFlag: 1,
          isCorrect: 1,
          answerAt: 1,
          createdAt: 1,
          updatedAt: 1,
          "question._id": 1,
          "question.questionBoardId": 1,
          "question.question": 1,
          "question.questionNumber": 1,
          "question.questionType": 1,
          "question.questionImage": 1,
          "question.questionDescription": 1,
          "question.explanation": 1,
          "question.questionGroupId": 1,
          "question.isFlagged": 1,
          "question.createdAt": 1,
          "question.updatedAt": 1,
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);

    return GenResObj(
      Code.OK,
      true,
      "Flagged questions fetched successfully",
      data
    );
  } catch (error) {
    console.log("🚀 ~ findGetFlaggedQuestion ~ error:", error);
    throw error;
  }
};
