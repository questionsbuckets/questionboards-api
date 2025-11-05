import crypto from "crypto";

export const generateGuestId = (): string => {
  return crypto.randomBytes(16).toString("hex");
};
