import type { NextFunction, Request, Response } from "express";
import * as GradeProvider from "./grade.provider.js";
import type { TGenResObj } from "../../utils/commonInterface.utils.js";
import { getGradesType, getGradesValidator } from "./grade.validate.js";

export const gradeController = {
  findAllGrade: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.query,
        page: Math.max(1, Number(req.query.page) || 1),
        limit: Math.max(1, Number(req.query.limit) || 10),
      } as getGradesType;

      getGradesValidator.assert(payload);

      const { code, data }: TGenResObj = await GradeProvider.findAllGrade(
        payload
      );
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
  findAllTopic: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.query,
        page: Math.max(1, Number(req.query.page) || 1),
        limit: Math.max(1, Number(req.query.limit) || 10),
      };
      const { code, data }: TGenResObj = await GradeProvider.findAllTopic(
        payload
      );
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
};
