import type { NextFunction, Request, Response } from "express";
import * as ParentsProvider from "./parents.provider.js";
import type { TGenResObj } from "../../utils/commonInterface.utils.js";
import {
  getParentsType,
  getParentsValidator,
  parentsValidator,
} from "./parents.validate.js";

export const parentsController = {
  addParentsAccount: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
        parentImage: req.file?.path,
      };

      parentsValidator.assert(payload);

      const { code, data }: TGenResObj =
        await ParentsProvider.addParentsAccount(payload);

      res.status(code).json(data);

      return;
    } catch (error) {
      next(error);
    }
  },
  getParentsAccount: async (
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
      } as getParentsType;
      getParentsValidator.assert(payload);

      const { code, data }: TGenResObj =
        await ParentsProvider.getParentsAccount(payload);

      res.status(code).json(data);

      return;
    } catch (error) {
      next(error);
    }
  },
};
