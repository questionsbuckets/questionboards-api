import { Router } from "express";
import { commonController as CommonController } from "./common.controller.js";
import { authCheck } from "../../middleware/jwt-token.middleware.js";
import { UserRoles } from "../../utils/Enums.utils.js";

const router = Router();

const nonAdminRoles = Object.values(UserRoles).filter(
  (role) => role !== UserRoles.ADMIN
);

router
  .route("/support")
  .post(authCheck(nonAdminRoles), CommonController.createSupportRequest);

router
  .route("/admin/support")
  .get(authCheck([UserRoles.ADMIN]), CommonController.getSupportRequests);

router
  .route("/admin/support/:supportId")
  .get(authCheck([UserRoles.ADMIN]), CommonController.getSupportDetails)
  .patch(authCheck([UserRoles.ADMIN]), CommonController.updateSupportStatus);

export default router;