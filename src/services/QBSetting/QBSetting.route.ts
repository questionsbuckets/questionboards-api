import { Router } from "express";
import { questionSettingController } from "./QBSetting.controller.js";
import { authCheck } from "../../middleware/jwt-token.middleware.js";
import uploadImage from "../../utils/multer.utils.js";

const router = Router();

router.route("/add-question-setting").post(
  authCheck(["admin"]),
  uploadImage.fields([
    { name: "music.hundred", maxCount: 1 },
    { name: "music.eightyPlus", maxCount: 1 },
    { name: "music.sixtyPlus", maxCount: 1 },
    { name: "music.belowSixty", maxCount: 1 },
    { name: "background", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  questionSettingController.addQuestionSetting
);

router
  .route("/get-question-setting")
  .get(authCheck(["admin"]), questionSettingController.getQuestionSetting);

router.route("/update-question-setting").post(
  authCheck(["admin"]),
  uploadImage.fields([
    { name: "music.hundred", maxCount: 1 },
    { name: "music.eightyPlus", maxCount: 1 },
    { name: "music.sixtyPlus", maxCount: 1 },
    { name: "music.belowSixty", maxCount: 1 },
    { name: "background", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  questionSettingController.updateQuestionSetting
);

export default router;
