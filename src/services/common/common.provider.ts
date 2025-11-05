import { GenResObj } from "../../utils/responseFormatter.utils.js";
import { HttpStatusCodes as Code } from "../../utils/Enums.utils.js";
import Support from "../../models/support.model.js";
import type {
  TCreateSupportPayload,
  TGetSupportRequestsPayload,
  TUpdateSupportStatusPayload,
  TGetSupportDetailsPayload,
} from "./common.interface.js";
import { toObjectId } from "../../utils/common.utils.js";

export const createSupportRequest = async (payload: TCreateSupportPayload) => {
  try {
    const supportRequest = await Support.create({
      userId: payload.userId,
      role: payload.role,
      fullName: payload.fullName,
      email: payload.email,
      contactNumber: payload.contactNumber,
      subject: payload.subject,
      message: payload.message,
    });

    if (!supportRequest) {
      return GenResObj(Code.BAD_REQUEST, false, "Failed to create support request");
    }

    return GenResObj(
      Code.CREATED,
      true,
      "Support request created successfully",
      supportRequest
    );
  } catch (error) {
    console.error("Error in createSupportRequest:", error);
    throw error;
  }
};

export const getSupportRequests = async (payload: TGetSupportRequestsPayload) => {
  try {
    const { page, limit, status } = payload;
    const skip = (page - 1) * limit;

    const filter: any = { deleted: false };
    if (status) {
      filter.status = status;
    }

    const supportRequests = await Support.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const totalSupportRequests = await Support.countDocuments(filter);

    return GenResObj(Code.OK, true, "Support requests fetched successfully", {
      supportRequests,
      totalSupportRequests,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error in getSupportRequests:", error);
    throw error;
  }
};

export const updateSupportStatus = async (payload: TUpdateSupportStatusPayload) => {
  try {
    const { supportId, status } = payload;

    const supportRequest = await Support.findOneAndUpdate(
      { _id: toObjectId(supportId), deleted: false },
      { $set: { status } },
      { new: true }
    ).lean();

    if (!supportRequest) {
      return GenResObj(Code.NOT_FOUND, false, "Support request not found");
    }

    return GenResObj(
      Code.OK,
      true,
      "Support request status updated successfully",
      supportRequest
    );
  } catch (error) {
    console.error("Error in updateSupportStatus:", error);
    throw error;
  }
};

export const getSupportDetails = async (payload: TGetSupportDetailsPayload) => {
  try {
    const { supportId } = payload;

    const supportRequest = await Support.findOne({
      _id: toObjectId(supportId),
      deleted: false,
    }).lean();

    if (!supportRequest) {
      return GenResObj(Code.NOT_FOUND, false, "Support request not found");
    }

    return GenResObj(
      Code.OK,
      true,
      "Support request details fetched successfully",
      supportRequest
    );
  } catch (error) {
    console.error("Error in getSupportDetails:", error);
    throw error;
  }
};