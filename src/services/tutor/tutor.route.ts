import { Router } from "express";
import { tutorController as tutorController } from "./tutor.controller.js";
import { authCheck } from "../../middleware/jwt-token.middleware.js";
import uploadImage from "../../utils/multer.utils.js";

const router = Router();

router.route("/add-tutor-account").post(
  authCheck(["tutor"]),
  uploadImage.fields([
    { name: "tutorImage", maxCount: 1 },
    {
      name: "uploadDocuments",
      maxCount: 1,
    },
  ]),
  tutorController.addTutorAccount
);

router
  .route("/get-tutor-details")
  .get(authCheck(["tutor"]), tutorController.getTutorAccountDetails);

export default router;
