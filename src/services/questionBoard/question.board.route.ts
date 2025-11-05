import { Router } from "express";
import { questionBoardController as questionBoardController } from "./question.board.controller.js";
import { authCheck } from "../../middleware/jwt-token.middleware.js";
import uploadImage from "../../utils/multer.utils.js";

const router = Router();

router.route("/add-question-board").post(
  authCheck(["tutor", "admin", "parent", "student"]),
  uploadImage.fields([
    { name: "questionImage", maxCount: 1 },
    {
      name: "questions.questionImage",
      maxCount: 1,
    },
  ]),
  questionBoardController.addQuestionBoard
);
router
  .route("/get-user-question-board")
  .get(
    authCheck(["tutor", "admin", "parent", "student"]),
    questionBoardController.getUserQuestionBoard
  );

router
  .route("/delete-question-board")
  .delete(
    authCheck(["tutor", "admin", "parent", "student"]),
    questionBoardController.deleteQuestionBoard
  );

router
  .route("/update-question-board-item")
  .post(
    authCheck(["tutor", "admin", "parent", "student"]),
    uploadImage.fields([{ name: "questionImage", maxCount: 1 }]),
    questionBoardController.updateQuestionBoardItem
  );

router
  .route("/get-question-board")
  .get(
    authCheck(["admin", "student"]),
    questionBoardController.getQuestionBoard
  );

router
  .route("/find-all-question-board")
  .get(
    authCheck(["tutor", "admin", "parent", "student"]),
    questionBoardController.findAllQuestionBoard
  );

router
  .route("/upload-image")
  .post(
    authCheck(["tutor", "admin", "parent", "student"]),
    uploadImage.fields([{ name: "image", maxCount: 1 }]),
    questionBoardController.uploadImage
  );

router
  .route("/remove-image")
  .post(
    authCheck(["tutor", "admin", "parent", "student"]),
    questionBoardController.removeImage
  );

//question
router
  .route("/update-question")
  .post(
    authCheck(["tutor", "admin", "parent", "student"]),
    uploadImage.fields([{ name: "questionImage", maxCount: 1 }]),
    questionBoardController.updateQuestion
  );

router
  .route("/delete-question")
  .delete(
    authCheck(["tutor", "admin", "parent", "student"]),
    questionBoardController.deleteQuestion
  );

//option

router
  .route("/update-option")
  .post(
    authCheck(["tutor", "admin", "parent", "student"]),
    questionBoardController.updateOption
  );

router
  .route("/delete-option")
  .delete(
    authCheck(["tutor", "admin", "parent", "student"]),
    questionBoardController.deleteOption
  );

router
  .route("/update-question-board")
  .post(
    authCheck(["tutor", "admin", "parent", "student"]),
    uploadImage.fields([{ name: "questionImage", maxCount: 1 }]),
    questionBoardController.updateQuestionBoard
  );
export default router;
