import { Router } from "express";
import userRouter from "./user/user.route.js";
import parentsRouter from "./parents/parents.route.js";
import childrenRouter from "./children/children.route.js";
import gradeRouter from "./grade/grade.route.js";
import tutor from "./tutor/tutor.route.js";
import userSchool from "./userSchool/user.school.route.js";
import questionBoard from "./questionBoard/question.board.route.js";
import admin from "./admin/admin.route.js";
import userExamSession from "./examSession/exam.session.route.js";
import updateExamQuestion from "./examQuestion/exam.question.route.js";
import commonRouter from "./common/common.route.js";
import student from "./student/student.route.js";
import qbstting from "./QBSetting/QBSetting.route.js";

const router = Router();

router.use("/user", userRouter);
router.use("/parents", parentsRouter);
router.use("/children", childrenRouter);
router.use("/grade", gradeRouter);
router.use("/tutor", tutor);
router.use("/userSchool", userSchool);
router.use("/questionBoard", questionBoard);
router.use("/admin", admin);
router.use("/start-exam-session", userExamSession);
router.use("/update-exam-session", updateExamQuestion);
router.use("/common", commonRouter);
router.use("/student", student);
router.use("/question-setting", qbstting);

export default router;
