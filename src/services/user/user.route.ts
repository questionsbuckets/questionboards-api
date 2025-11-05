import { Router } from "express";
import { userController as UserController } from "./user.controller.js";
import { authCheck } from "../../middleware/jwt-token.middleware.js";
import { UserRoles } from "../../utils/Enums.utils.js";
import { upload } from "../../middleware/multerConfig.middleware.js";
import passport from "passport";

const router = Router();

router.route("/signup").post(UserController.signupUser);
router.route("/signin").post(UserController.signinUser);
router
  .route("/updateRole")
  .post(authCheck([], false), UserController.updateUserRole);
router.route("/forgetPassword").post(UserController.forgetPassword);
router.route("/verifyOtp").post(UserController.verifyOtp);
router.route("/confrimPassword").post(UserController.confrimPassword);
router
  .route("/updatePassword")
  .post(
    authCheck(["student", "tutor", "parent", "admin"]),
    UserController.updatePassword
  );
router
  .route("/get-user-details")
  .get(
    authCheck(["student", "tutor", "parent", "admin"]),
    UserController.getUserDetails
  );

//loginWithGoogle
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.route("/auth/google/callback").get(UserController.googleAuthCallback);

export default router;
