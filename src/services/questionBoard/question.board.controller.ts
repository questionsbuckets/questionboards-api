import type { NextFunction, Request, Response } from "express";
import * as questionBoardProvider from "./question.board.provider.js";
import type { TGenResObj } from "../../utils/commonInterface.utils.js";
import {
  addQuestionBoardValidate,
  deleteOptionType,
  deleteOptionValidator,
  deleteQuestionBoardType,
  deleteQuestionBoardValidator,
  deleteQuestionType,
  deleteQuestionValidator,
  getAllQuestionBoardType,
  getAllQuestionBoardValidator,
  getQuestionBoardType,
  getQuestionBoardValidator,
  getUserQuestionBoardType,
  getUserQuestionBoardValidator,
  remvoeImageValidator,
  updateOptionValidator,
  updateQuestionBoardItemValidator,
  updateQuestionBoardValidate,
  updateQuestionValidator,
} from "./question.board.validate.js";

export const questionBoardController = {
  addQuestionBoard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { files }: any = req;

      let payload = {
        ...req.userData,
        ...req.body,
      };

      addQuestionBoardValidate.assert(payload);

      const { code, data }: TGenResObj =
        await questionBoardProvider.addQuestionBoard(payload);

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
  updateQuestionBoardItem: async (
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

      if (files?.questionImage?.[0]?.path) {
        payload.questionImage = files?.questionImage?.[0]?.path;
      }
      updateQuestionBoardItemValidator.assert(payload);
      const { code, data }: TGenResObj =
        await questionBoardProvider.updateQuestionBoardItem(payload);

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  getQuestionBoard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.query,
        page: Math.max(1, Number(req.query.page) || 1),
        limit: Math.max(1, Number(req.query.limit) || 10),
      } as getQuestionBoardType;

      getQuestionBoardValidator.assert(payload);

      const { code, data }: TGenResObj =
        await questionBoardProvider.getQuestionBoard(payload);

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  deleteQuestionBoard: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let payload = {
        ...req.userData,
        ...req.query,
      } as deleteQuestionBoardType;

      deleteQuestionBoardValidator.assert(payload);
      const { code, data }: TGenResObj =
        await questionBoardProvider.deleteQuestionBoard(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  findAllQuestionBoard: async (
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
      } as getAllQuestionBoardType;

      getAllQuestionBoardValidator.assert(payload);

      const { code, data }: TGenResObj =
        await questionBoardProvider.findAllQuestionBoard(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  uploadImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { files }: any = req;
      let payload = {
        ...req.userData,
        image: files?.image?.[0]?.path,
      };

      const { code, data }: TGenResObj =
        await questionBoardProvider.uploadImage(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  removeImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
      };
      remvoeImageValidator.assert(payload);
      const { code, data }: TGenResObj =
        await questionBoardProvider.removeImage(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
  updateQuestion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { files }: any = req;

      let payload = {
        ...req.userData,
        ...req.body,
      };

      if (files?.questionImage?.[0]?.path) {
        payload.questionImage = files?.questionImage?.[0]?.path;
      }

      updateQuestionValidator.assert(payload);

      const { code, data }: TGenResObj =
        await questionBoardProvider.updateQuestion(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
  deleteQuestion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.query,
      } as deleteQuestionType;

      deleteQuestionValidator.assert(payload);

      const { code, data }: TGenResObj =
        await questionBoardProvider.deleteQuestion(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  updateOption: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
      };

      updateOptionValidator.assert(payload);

      const { code, data }: TGenResObj =
        await questionBoardProvider.updateOption(payload);

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  deleteOption: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.query,
      } as deleteOptionType;

      deleteOptionValidator.assert(payload);

      const { code, data }: TGenResObj =
        await questionBoardProvider.deleteOption(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  updateQuestionBoard: async (
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

      if (files?.questionImage?.[0]?.path) {
        payload.questionImage = files?.questionImage?.[0]?.path;
      }
      updateQuestionBoardValidate.assert(payload);

      const { code, data }: TGenResObj =
        await questionBoardProvider.updateQuestionBoard(payload);

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  getUserQuestionBoard: async (
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
      } as getUserQuestionBoardType;

      getUserQuestionBoardValidator.assert(payload);

      const { code, data }: TGenResObj =
        await questionBoardProvider.getUserQuestionBoard(payload);

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
};
