import type { NextFunction, Request, Response } from "express";
import * as ChildernProvider from "./children.provider.js";
import type { TGenResObj } from "../../utils/commonInterface.utils.js";
import { childrenValidator } from "./children.validate.js";

export const childrenController = {
  addChildrenAccount: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
        childrenImage: req.file?.path,
      };
      childrenValidator.assert(payload);

      const { code, data }: TGenResObj =
        await ChildernProvider.addChildrenAccount(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
};
