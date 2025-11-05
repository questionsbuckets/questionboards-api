import type { NextFunction, Request, Response } from "express";
import * as examSessionProvider from "./exam.session.provider.js";
import type { TGenResObj } from "../../utils/commonInterface.utils.js";
import {
  examSessionType,
  examSessionValidator,
} from "./exam.session.validate.js";

export const startExamSessionController = {
  startExamSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.query,
      } as examSessionType;

      examSessionValidator.assert(payload);

      const { code, data }: TGenResObj =
        await examSessionProvider.startExamSession(payload);

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
};
