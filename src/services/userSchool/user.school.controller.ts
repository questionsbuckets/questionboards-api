import type { NextFunction, Request, Response } from "express";
import * as userSchoolProvider from "./user.school.provider.js";
import type { TGenResObj } from "../../utils/commonInterface.utils.js";
import {
  getuserSchoolDetailsType,
  getuserSchoolDetailsValidator,
  userSchoolValidator,
} from "./user.school.validate.js";

export const userSchoolController = {
  addUserSchoolSetup: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { files }: any = req;
      let payload = {
        ...req.userData,
        ...req.body,
      };

      if (files?.userImage?.[0]?.path) {
        payload.userImage = files?.userImage?.[0]?.path;
      }

      if (files?.["schoolInfo.schoolImage"]?.[0]?.path) {
        payload.schoolInfo.schoolImage =
          files["schoolInfo.schoolImage"][0].path;
      }

      if (files?.["schoolInfo.uploadDocuments"]?.[0]?.path) {
        payload.schoolInfo.uploadDocuments =
          files["schoolInfo.uploadDocuments"][0].path;
      }

      userSchoolValidator.assert(payload);

      const { code, data }: TGenResObj =
        await userSchoolProvider.addUserSchoolSetup(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  getuserSchoolDetails: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let payload = {
        ...req.userData,
        ...req.query,
      } as getuserSchoolDetailsType;

      getuserSchoolDetailsValidator.assert(payload);

      const { code, data }: TGenResObj =
        await userSchoolProvider.getuserSchoolDetails(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
};
