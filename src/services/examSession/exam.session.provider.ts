import { GenResObj } from "../../utils/responseFormatter.utils.js";
import { HttpStatusCodes as Code } from "../../utils/Enums.utils.js";
import QuestionBoard from "../../models/question.board.model.js";
import ExamSessions from "../../models/exam.session.model.js";
import examQuestion from "../../models/exam.question.model.js";
import Question from "../../models/question.mode.js";
import mongoose from "mongoose";
import { examSessionType } from "./exam.session.validate.js";

export const startExamSession = async (payload: examSessionType) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { questionBoardId, userId } = payload;

    // Validate board
    const findQuestionBoard = await QuestionBoard.findOne({
      _id: questionBoardId,
    })
      .lean()
      .session(session);

    if (!findQuestionBoard) {
      await session.abortTransaction();
      return GenResObj(Code.BAD_REQUEST, false, "Question board not found");
    }

    if (findQuestionBoard.status !== "APPROVED") {
      await session.abortTransaction();
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "Question board is not APPROVED yet"
      );
    }

    // Fetch all questions
    const findAllQuestion = await Question.find({ questionBoardId })
      .lean()
      .session(session);

    if (!findAllQuestion.length) {
      await session.abortTransaction();
      return GenResObj(
        Code.BAD_REQUEST,
        false,
        "No questions found for this board"
      );
    }

    // Create exam session
    const startTheExamSession = await ExamSessions.create(
      [
        {
          questionBoardId,
          userId,
          startTime: new Date(),
          durationTime: findQuestionBoard.durationTime,
        },
      ],
      { session }
    );

    const examSession = startTheExamSession[0];
    if (!examSession) {
      await session.abortTransaction();
      return GenResObj(Code.BAD_REQUEST, false, "Failed to start the session");
    }

    // Prepare user question session docs
    const userQuestionDocs = findAllQuestion.map((q) => ({
      questionId: q._id,
      userId,
      userExamId: examSession._id,
      isCorrect: false,
      answerAt: null,
    }));

    // Insert questions for user exam
    await examQuestion.insertMany(userQuestionDocs, { session });

    // Commit everything
    await session.commitTransaction();
    session.endSession();

    return GenResObj(Code.CREATED, true, "Exam session started successfully", {
      examSessionId: examSession._id,
      totalQuestions: findAllQuestion.length,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("🚀 ~ startExamSession ~ error:", error);
    throw error;
  }
};
