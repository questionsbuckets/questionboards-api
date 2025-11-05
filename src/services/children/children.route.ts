import { Router } from "express";
import { childrenController as childrenController } from "./children.controller.js";
import { authCheck } from "../../middleware/jwt-token.middleware.js";
import uploadImage from "../../utils/multer.utils.js";

const router = Router();

router
  .route("/add-children-account")
  .post(
    authCheck(["parent"]),
    uploadImage.single("childrenImage"),
    childrenController.addChildrenAccount
  );

export default router;
