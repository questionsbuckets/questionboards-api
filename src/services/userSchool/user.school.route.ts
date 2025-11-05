import { Router } from "express";
import { userSchoolController as userSchoolController } from "./user.school.controller.js";
import { authCheck } from "../../middleware/jwt-token.middleware.js";
import uploadImage from "../../utils/multer.utils.js";

const router = Router();

router.route("/add-student-account").post(
  authCheck(["student", "tutor"]),
  uploadImage.fields([
    { name: "userImage", maxCount: 1 },
    {
      name: "schoolInfo.schoolImage",
      maxCount: 1,
    },
    {
      name: "schoolInfo.uploadDocuments",
      maxCount: 1,
    },
  ]),
  userSchoolController.addUserSchoolSetup
);

router
  .route("/get-student-details")
  .get(
    authCheck(["student", "tutor"]),
    userSchoolController.getuserSchoolDetails
  );

export default router;
