import { Router } from "express";
import { gradeController as gradeController } from "./grade.controller.js";
import { authCheck } from "../../middleware/jwt-token.middleware.js";

const router = Router();

router.route("/fetch-grades").get(gradeController.findAllGrade);
router.route("/find-all-topic").get(gradeController.findAllTopic);

export default router;
