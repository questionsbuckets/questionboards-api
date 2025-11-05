import type { NextFunction, Request, Response } from "express";
import * as tutorProvider from "./tutor.provider.js";
import type { TGenResObj } from "../../utils/commonInterface.utils.js";
import {
  GetTutorsType,
  getTutorsValidator,
  tutorValidator,
} from "./tutor.validate.js";

export const tutorController = {
  addTutorAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { files }: any = req;
      let payload = {
        ...req.userData,
        ...req.body,
      };

      if (files?.tutorImage?.[0]?.path) {
        payload.tutorImage = files?.tutorImage?.[0]?.path;
      }

      if (files?.uploadDocuments?.[0]?.path) {
        payload.uploadDocuments = files?.uploadDocuments?.[0]?.path;
      }

      tutorValidator.assert(payload);

      const { code, data }: TGenResObj = await tutorProvider.addTutorAccount(
        payload
      );
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  getTutorAccountDetails: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let payload = {
        ...req.userData,
        ...req.query,
        page: Math.max(1, Number(req.query.page) || 1),
        limit: Math.max(1, Number(req.query.limit) || 10),
      } as GetTutorsType;

      getTutorsValidator.assert(payload);

      const { code, data }: TGenResObj =
        await tutorProvider.getTutorAccountDetails(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
};
