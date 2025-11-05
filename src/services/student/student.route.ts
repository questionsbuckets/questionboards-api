import { Router } from "express";
import { studnetController as studnetController } from "./student.controller.js";
import { authCheck } from "../../middleware/jwt-token.middleware.js";
import uploadImage from "../../utils/multer.utils.js";

const router = Router();

router
  .route("/add-student-account")
  .post(
    authCheck(["student"]),
    uploadImage.single("studentImage"),
    studnetController.addStudentAccount
  );

export default router;
