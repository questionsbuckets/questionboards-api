import { Router } from "express";
import { parentsController as parentsController } from "./parents.controller.js";
import { authCheck } from "../../middleware/jwt-token.middleware.js";
import uploadImage from "../../utils/multer.utils.js";

const router = Router();

router
  .route("/add-parents-account")
  .post(
    authCheck(["parent"]),
    uploadImage.single("parentImage"),
    parentsController.addParentsAccount
  );

router
  .route("/get-parents-details")
  .get(authCheck(["parent"]), parentsController.getParentsAccount);

export default router;
