import type { NextFunction, Request, Response } from "express";
import * as UserProvider from "./user.provider.js";
import type { TGenResObj } from "../../utils/commonInterface.utils.js";
import {
  confrimPasswordValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
  signInValidator,
  signUpValidator,
  updatePasswordValidator,
  updateRoleValidator,
} from "./user.validate.js";

export const userController = {
  signupUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      signUpValidator.assert(body);

      const { code, data }: TGenResObj = await UserProvider.signupUser(body);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  signinUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      signInValidator.assert(body);

      const { code, data }: TGenResObj = await UserProvider.signinUser(body);

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  googleAuthCallback: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("inside googleAuthCallback");
    try {
      const { code, data }: TGenResObj =
        await UserProvider.GoogleAuthCallbackController(req, res as any);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  updateUserRole: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
      };
      updateRoleValidator.assert(payload);

      const { code, data }: TGenResObj = await UserProvider.updateUserRole(
        payload
      );
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  forgetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
      };
      forgetPasswordValidator.assert(payload);

      const { code, data }: TGenResObj = await UserProvider.forgetPassword(
        payload
      );
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
  verifyOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
      };
      resetPasswordValidator.assert(payload);

      const { code, data }: TGenResObj = await UserProvider.resetPassword(
        payload
      );
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  confrimPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
      };
      confrimPasswordValidator.assert(payload);

      const { code, data }: TGenResObj = await UserProvider.confrimPassword(
        payload
      );
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  updatePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
      };

      updatePasswordValidator.assert(payload);
      const { code, data }: TGenResObj = await UserProvider.updatePassword(
        payload
      );
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  getUserDetails: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
      };
      const { code, data }: TGenResObj = await UserProvider.getUserDetails(
        payload
      );
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
};
