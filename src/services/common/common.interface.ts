import { UserRoles } from "../../utils/Enums.utils.js";

export type TCreateSupportPayload = {
  userId: string;
  role: Exclude<UserRoles, UserRoles.ADMIN>;
  fullName: string;
  email: string;
  contactNumber: string;
  subject: string;
  message: string;
};

export type TGetSupportRequestsPayload = {
  page: number;
  limit: number;
  status?: "pending" | "resolved" | "closed";
};

export type TUpdateSupportStatusPayload = {
  supportId: string;
  status: "resolved" | "closed";
};

export type TGetSupportDetailsPayload = {
  supportId: string;
};