import type { NextFunction, Request, Response } from "express";
import * as StudentProvider from "./student.provider.js";
import type { TGenResObj } from "../../utils/commonInterface.utils.js";

export const studnetController = {
  addStudentAccount: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
        studentImage: req.file?.path,
      };

      const { code, data }: TGenResObj =
        await StudentProvider.addStudentAccount(payload);

      res.status(code).json(data);

      return;
    } catch (error) {
      next(error);
    }
  },
};
