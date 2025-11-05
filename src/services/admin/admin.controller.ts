import type { NextFunction, Request, Response } from "express";
import * as adminProvider from "./admin.provider.js";
import type { TGenResObj } from "../../utils/commonInterface.utils.js";
import {
  adminApproveQuestionBoardValidator,
  createPopUpValidator,
  updatePopUpValidator,
  getPopUpsValidator,
  deletePopUpValidator,
  AddSubTopicNameValidator,
  AddTopicNameValidator,
  deleteTopicNameType,
  deleteTopicNameValidator,
  getTopicType,
  getTopicValidator,
  updateTopicNameValidator,
  getPopUpsType,
  findAllQuestionBoardForAdminType,
  findAllQuestionBoardForAdminValidator,
  createFlashcardValidator,
  updateFlashcardValidator,
  getFlashcardsValidator,
  deleteFlashcardValidator,
  getFlashcardsType,
  createUserGuideValidator,
  updateUserGuideValidator,
  getUserGuidesValidator,
  deleteUserGuideValidator,
  getUserGuidesType,
  createResourceValidator,
  updateResourceValidator,
  getResourcesValidator,
  deleteResourceValidator,
  getResourcesType,
  createSample40DayPlanValidator,
  updateSample40DayPlanValidator,
  getSample40DayPlansValidator,
  deleteSample40DayPlanValidator
} from "./admin.validate.js";

export const adminController = {
  adminApproveQuestionBoard: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
      };

      adminApproveQuestionBoardValidator.assert(payload);

      const { code, data }: TGenResObj =
        await adminProvider.adminApproveQuestionBoard(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  createPopUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.body,
        descriptionFileUrl: req.file?.path, // Add file path if uploaded
      };

      createPopUpValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.createPopUp(
        payload
      );

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
  AddTopicName: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
      };
      AddTopicNameValidator.assert(payload);
      const { code, data }: TGenResObj = await adminProvider.adminAddTopicName(
        payload
      );
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
  getPopUps: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.query,
        page: Math.max(1, Number(req.query.page) || 1),
        limit: Math.max(1, Number(req.query.limit) || 10),
      } as getPopUpsType;

      getPopUpsValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.getPopUps(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
  DeleteTopicName: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.query,
      } as deleteTopicNameType;

      deleteTopicNameValidator.assert(payload);
      const { code, data }: TGenResObj =
        await adminProvider.adminRemoveTopicName(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  updatePopUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        popUpId: req.params.popUpId,
        ...req.body,
        descriptionFileUrl: req.file?.path,
      };

      updatePopUpValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.updatePopUp(
        payload
      );

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  UpdateTopicName: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
      };
      updateTopicNameValidator.assert(payload);
      const { code, data }: TGenResObj =
        await adminProvider.adminUpdateTopicName(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
  getAllTopicName: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = {
        ...req.userData,
        ...req.query,
        page: Math.max(1, Number(req.query.page) || 1),
        limit: Math.max(1, Number(req.query.limit) || 10),
      } as getTopicType;

      getTopicValidator.assert(payload);
      const { code, data }: TGenResObj =
        await adminProvider.adminGetAllTopicName(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  deletePopUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        popUpId: req.params.popUpId,
      };

      deletePopUpValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.deletePopUp(
        payload
      );

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
  addSubTopicName: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.userData,
        ...req.body,
      };
      AddSubTopicNameValidator.assert(payload);
      const { code, data }: TGenResObj = await adminProvider.addSubTopicName(
        payload
      );
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
  getQuestionBoardForAdmin: async (
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
      } as findAllQuestionBoardForAdminType;

      findAllQuestionBoardForAdminValidator.assert(payload);

      const { code, data }: TGenResObj =
        await adminProvider.getQuestionBoardForAdmin(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  createFlashcard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const previewImage = (req.files as any)?.previewImage?.[0]?.path || undefined;
      const file = (req.files as any)?.file?.[0]?.path || undefined;
      let payload = {
        ...req.body,
        ...(previewImage && { previewImage }),
        ...(file && { file }),
      };

      createFlashcardValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.createFlashcard(
        payload
      );

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  getFlashcards: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.query,
        page: Math.max(1, Number(req.query.page) || 1),
        limit: Math.max(1, Number(req.query.limit) || 10),
      } as getFlashcardsType;

      getFlashcardsValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.getFlashcards(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  updateFlashcard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const previewImage = (req.files as any)?.previewImage?.[0]?.path || undefined;
      const file = (req.files as any)?.file?.[0]?.path || undefined;      let payload = {
        flashcardId: req.params.flashcardId,
        ...req.body,
        ...(previewImage && { previewImage }),
        ...(file && { file }),
      };

      updateFlashcardValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.updateFlashcard(
        payload
      );

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  deleteFlashcard: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        flashcardId: req.params.flashcardId,
      };

      deleteFlashcardValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.deleteFlashcard(
        payload
      );

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  createUserGuide: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const image = (req.files as any)?.image?.[0]?.path || undefined;
      const file = (req.files as any)?.file?.[0]?.path || undefined;
        let payload = {
        ...req.body,
        ...(image && { image }),
        ...(file && { file }),
      };

      createUserGuideValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.createUserGuide(
        payload
      );

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  getUserGuides: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.query,
        page: Math.max(1, Number(req.query.page) || 1),
        limit: Math.max(1, Number(req.query.limit) || 10),
      } as getUserGuidesType;

      getUserGuidesValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.getUserGuides(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  updateUserGuide: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const image = (req.files as any)?.image?.[0]?.path || undefined;
      const file = (req.files as any)?.file?.[0]?.path || undefined;
      let payload = {
        userGuideId: req.params.userGuideId,
        ...req.body,
        ...(image && { image }),
        ...(file && { file }),
      };

      updateUserGuideValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.updateUserGuide(
        payload
      );

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  deleteUserGuide: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        userGuideId: req.params.userGuideId,
      };

      deleteUserGuideValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.deleteUserGuide(
        payload
      );

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  createResource: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const image = (req.files as any)?.image?.[0]?.path || undefined;
      const file = (req.files as any)?.file?.[0]?.path || undefined;
  
      let payload = {
        ...req.body,
        ...(image && { image }),
        ...(file && { file }),
      };

      createResourceValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.createResource(
        payload
      );

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  getResources: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        ...req.query,
        page: Math.max(1, Number(req.query.page) || 1),
        limit: Math.max(1, Number(req.query.limit) || 10),
      } as getResourcesType;

      getResourcesValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.getResources(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  updateResource: async (req: Request, res: Response, next: NextFunction) => {
    try {

      const image = (req.files as any)?.image?.[0]?.path || undefined;
      const file = (req.files as any)?.file?.[0]?.path || undefined;
  
      let payload = {
        resourceId: req.params.resourceId,
        ...req.body,
        ...(image && { image }),
        ...(file && { file }),
      };

      updateResourceValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.updateResource(
        payload
      );

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  deleteResource: async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = {
        resourceId: req.params.resourceId,
      };

      deleteResourceValidator.assert(payload);

      const { code, data }: TGenResObj = await adminProvider.deleteResource(
        payload
      );

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  createSample40DayPlan: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let payload = {
        ...req.body,
        displayImage: req.file?.path,
      };

      createSample40DayPlanValidator.assert(payload);

      const { code, data }: TGenResObj =
        await adminProvider.createSample40DayPlan(payload);

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  getSample40DayPlans: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let payload = {
        ...req.query,
        page: Math.max(1, Number(req.query.page) || 1),
        limit: Math.max(1, Number(req.query.limit) || 10),
      };

      getSample40DayPlansValidator.assert(payload);

      const { code, data }: TGenResObj =
        await adminProvider.getSample40DayPlans(payload);
      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  updateSample40DayPlan: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let payload = {
        sample40DayPlanId: req.params.sample40DayPlanId,
        ...req.body,
        displayImage: req.file?.path,
      };

      updateSample40DayPlanValidator.assert(payload);

      const { code, data }: TGenResObj =
        await adminProvider.updateSample40DayPlan(payload);

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },

  deleteSample40DayPlan: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let payload = {
        sample40DayPlanId: req.params.sample40DayPlanId,
      };

      deleteSample40DayPlanValidator.assert(payload);

      const { code, data }: TGenResObj =
        await adminProvider.deleteSample40DayPlan(payload);

      res.status(code).json(data);
      return;
    } catch (error) {
      next(error);
    }
  },
};
