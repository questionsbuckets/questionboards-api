import { Router } from "express";
import { authCheck } from "../../middleware/jwt-token.middleware.js";
import { updateExamQestionController as updateExamQestionController } from "./exam.question.controller.js";
const router = Router();

router
  .route("/update-exam-question")
  .post(
    authCheck(["tutor", "parent", "children", "student"]),
    updateExamQestionController.updateExamQuestionSession
  );

router
  .route("/complete-exam-question")
  .post(
    authCheck(["tutor", "parent", "children", "student"]),
    updateExamQestionController.endExamQuestionSession
  );

router
  .route("/find-flagged-question")
  .get(
    authCheck(["tutor", "parent", "children", "student"]),
    updateExamQestionController.findGetFlaggedQuestion
  );

export default router;
