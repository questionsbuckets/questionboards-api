import { Router } from "express";
import { adminController as adminController } from "./admin.controller.js";
import { authCheck } from "../../middleware/jwt-token.middleware.js";
import uploadImage from "../../utils/multer.utils.js";

const router = Router();

//adminApproveQuestionBoard
router
  .route("/admin-can-approved-question-board")
  .post(authCheck(["admin"]), adminController.adminApproveQuestionBoard);

router
  .route("/pop-up")
  .post(
    authCheck(["admin"]),
    uploadImage.single("descriptionFile"),
    adminController.createPopUp
  )
  .get(authCheck(["admin"]), adminController.getPopUps);

router
  .route("/pop-up/:popUpId")
  .patch(
    authCheck(["admin"]),
    uploadImage.single("descriptionFile"),
    adminController.updatePopUp
  )
  .delete(authCheck(["admin"]), adminController.deletePopUp);

//adminAddTopic
router
  .route("/add-topic")
  .post(authCheck(["admin"]), adminController.AddTopicName);

router
  .route("/update-topic")
  .post(authCheck(["admin"]), adminController.UpdateTopicName);

router
  .route("/delete-topic")
  .post(authCheck(["admin"]), adminController.DeleteTopicName);

router
  .route("/get-all-topic")
  .get(
    authCheck(["tutor", "admin", "parent", "student"]),
    adminController.getAllTopicName
  );

//adminAddSubTopic
router
  .route("/add-sub-topic")
  .post(authCheck(["admin"]), adminController.addSubTopicName);

router
  .route("/fetch-question-board")
  .get(authCheck(["admin"]), adminController.getQuestionBoardForAdmin);

router
  .route("/flashcard")
  .post(
    authCheck(["admin"]),
    uploadImage.fields([
      { name: "previewImage", maxCount: 1 },
      { name: "file", maxCount: 1 },
    ]),
    adminController.createFlashcard
  )
  .get(authCheck(["admin"]), adminController.getFlashcards);


// flashCards features
router
  .route("/flashcard/:flashcardId")
  .patch(
    authCheck(["admin"]),
    uploadImage.fields([
      { name: "previewImage", maxCount: 1 },
      { name: "file", maxCount: 1 },
    ]),
    adminController.updateFlashcard
  )
  .delete(authCheck(["admin"]), adminController.deleteFlashcard);


//userGuide features
router
  .route("/user-guide")
  .post(
    authCheck(["admin"]),
    uploadImage.fields([
      { name: "image", maxCount: 1 },
      { name: "file", maxCount: 1 },
    ]),
    adminController.createUserGuide
  )
  .get(authCheck(["admin"]), adminController.getUserGuides);

router
  .route("/user-guide/:userGuideId")
  .patch(
    authCheck(["admin"]),
    uploadImage.fields([
      { name: "image", maxCount: 1 },
      { name: "file", maxCount: 1 },
    ]),
    adminController.updateUserGuide
  )
  .delete(authCheck(["admin"]), adminController.deleteUserGuide);

// resuource management
router
  .route("/resource")
  .post(
    authCheck(["admin"]),
    uploadImage.fields([
      { name: "image", maxCount: 1 },
      { name: "file", maxCount: 1 },
    ]),
    adminController.createResource
  )
  .get(authCheck(["admin"]), adminController.getResources);

router
  .route("/resource/:resourceId")
  .patch(
    authCheck(["admin"]),
    uploadImage.fields([
      { name: "image", maxCount: 1 },
      { name: "file", maxCount: 1 },
    ]),
    adminController.updateResource
  )
  .delete(authCheck(["admin"]), adminController.deleteResource);

// 40-day plan management
router
  .route("/sample-40-day-plan")
  .post(
    authCheck(["admin"]),
    uploadImage.fields([{ name: "displayImage", maxCount: 1 }]),
    adminController.createSample40DayPlan
  )
  .get(authCheck(["admin"]), adminController.getSample40DayPlans);

router
  .route("/sample-40-day-plan/:sample40DayPlanId")
  .patch(
    authCheck(["admin"]),
    uploadImage.fields([{ name: "displayImage", maxCount: 1 }]),
    adminController.updateSample40DayPlan
  )
  .delete(authCheck(["admin"]), adminController.deleteSample40DayPlan);

export default router;
