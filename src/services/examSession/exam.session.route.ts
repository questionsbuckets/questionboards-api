import { Router } from "express";
import { authCheck } from "../../middleware/jwt-token.middleware.js";
import { startExamSessionController as startExamSessionController } from "./exam.session.controller.js";
const router = Router();

router
  .route("/start-exam")
  .post(
    authCheck(["tutor", "parent", "children", "student"]),
    startExamSessionController.startExamSession
  );

export default router;
