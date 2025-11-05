import type { NextFunction, Request, Response } from "express";
import * as examQuestionProvider from "./exam.question.provider.js";
import type { TGenResObj } from "../../utils/commonInterface.utils.js";
import {
  endExamQuestionType,
  endExamQuestionValidator,
  examQuestionValidator,
} from "./exam.question.validate.js";

export const updateExamQestionController = {
  updateExamQuestionSession: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
      };
      examQuestionValidator.assert(payload);
      const { code, data }: TGenResObj =
        await examQuestionProvider.updateExamQuestionSession(payload);

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
  endExamQuestionSession: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let payload = {
        ...req.userData,
        ...req.query,
      } as endExamQuestionType;

      endExamQuestionValidator.assert(payload);

      const { code, data }: TGenResObj =
        await examQuestionProvider.endExamQuestionSession(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
  findGetFlaggedQuestion: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let payload = {
        ...req.userData,
        ...req.query,
      };
      const { code, data }: TGenResObj =
        await examQuestionProvider.findGetFlaggedQuestion(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
};
