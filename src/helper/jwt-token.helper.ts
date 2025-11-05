import type { Request } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import User from "../models/user.model.js";
import { UserStatus } from "../utils/Enums.utils.js";

export const checkJWTToken = async (req: Request) => {
  let jwtToken: string | undefined;
  // Check if headers has authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    jwtToken = req.headers.authorization.split(" ")[1];
  }

  // Check if JWT token exists or not
  if (!jwtToken) {
    return;
  }

  const secretKey = process.env.JWT_SECRET_KEY!;

  // Verify JWT token
  const decodedToken = (await jwt.verify(jwtToken, secretKey)) as JwtPayload;

  // Check if user exists
  const checkAvlUser = await User.findOne({ _id: decodedToken.id });

  if (!checkAvlUser) {
    return;
  }

  if (checkAvlUser.status == UserStatus.INACTIVE) {
    return;
  }

  // Attach user data to the request object and proceed
  return { userId: decodedToken.id, role: checkAvlUser.role };
};
