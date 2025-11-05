import type { NextFunction, Request, Response } from "express";
import * as CommonProvider from "./common.provider.js";
import type { TGenResObj } from "../../utils/commonInterface.utils.js";
import {
  createSupportValidator,
  getSupportRequestsValidator,
  updateSupportStatusValidator,
  getSupportDetailsValidator,
} from "./common.validate.js";
import { UserRoles } from "../../utils/Enums.utils.js";

export const commonController = {
  createSupportRequest: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const payload = {
        ...req.body,
        userId: req.userData?.userId,
        role: req.userData?.role,
      };

      createSupportValidator.assert(payload);

      const { code, data }: TGenResObj = await CommonProvider.createSupportRequest(
        payload
      );
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  getSupportRequests: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const payload = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        status: req.query.status as "pending" | "resolved" | "closed",
      };

      getSupportRequestsValidator.assert(payload);

      const { code, data }: TGenResObj = await CommonProvider.getSupportRequests(
        payload
      );
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  updateSupportStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const payload = {
        ...req.body,
        supportId: req.params.supportId,
      };

      updateSupportStatusValidator.assert(payload);

      const { code, data }: TGenResObj = await CommonProvider.updateSupportStatus(
        payload
      );
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  getSupportDetails: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const payload = {
        supportId: req.params.supportId,
      };

      getSupportDetailsValidator.assert(payload);

      const { code, data }: TGenResObj = await CommonProvider.getSupportDetails(
        payload
      );
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
};