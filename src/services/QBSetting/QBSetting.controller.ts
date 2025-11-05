import type { NextFunction, Request, Response } from "express";
import * as qbSettingProvider from "./QBSetting.provider.js";
import type { TGenResObj } from "../../utils/commonInterface.utils.js";
import {
  addQBSettingValidator,
  updateQBsettingValidator,
} from "./QBSetting.validate.js";

export const questionSettingController = {
  addQuestionSetting: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { files }: any = req;

      let payload = {
        ...req.userData,
        ...req.body,
        music: {},
      };

      if (files?.["music.hundred"]?.[0]?.path) {
        payload.music.hundred = files["music.hundred"][0].path;
      }
      if (files?.["music.eightyPlus"]?.[0]?.path) {
        payload.music.eightyPlus = files["music.eightyPlus"][0].path;
      }
      if (files?.["music.sixtyPlus"]?.[0]?.path) {
        payload.music.sixtyPlus = files["music.sixtyPlus"][0].path;
      }
      if (files?.["music.belowSixty"]?.[0]?.path) {
        payload.music.belowSixty = files["music.belowSixty"][0].path;
      }

      if (files?.background?.[0]?.path) {
        payload.background = files?.background?.[0]?.path;
      }
      if (files?.signature?.[0]?.path) {
        payload.signature = files?.signature?.[0]?.path;
      }
      addQBSettingValidator.assert(payload);

      const { code, data }: TGenResObj =
        await qbSettingProvider.addQuestionSetting(payload);

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
  getQuestionSetting: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { code, data }: TGenResObj =
        await qbSettingProvider.getQuestionSetting();
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  updateQuestionSetting: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { files }: any = req;

      let payload = {
        ...req.userData,
        ...req.body,
        music: {},
      };

      if (files?.["music.hundred"]?.[0]?.path) {
        payload.music.hundred = files["music.hundred"][0].path;
      }
      if (files?.["music.eightyPlus"]?.[0]?.path) {
        payload.music.eightyPlus = files["music.eightyPlus"][0].path;
      }
      if (files?.["music.sixtyPlus"]?.[0]?.path) {
        payload.music.sixtyPlus = files["music.sixtyPlus"][0].path;
      }
      if (files?.["music.belowSixty"]?.[0]?.path) {
        payload.music.belowSixty = files["music.belowSixty"][0].path;
      }
      if (files?.background?.[0]?.path) {
        payload.background = files?.background?.[0]?.path;
      }
      if (files?.signature?.[0]?.path) {
        payload.signature = files?.signature?.[0]?.path;
      }
      updateQBsettingValidator.assert(payload);

      const { code, data }: TGenResObj =
        await qbSettingProvider.updateQuestionSetting(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
};
