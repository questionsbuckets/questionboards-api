import type { NextFunction, Request, Response } from "express";
import { ArkError, TraversalError } from "arktype";
import multer from "multer";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof TraversalError) {
    const errMessages = err.message.split("\n  • ").filter(Boolean);
    res
      .status(500)
      .send({ status: false, message: errMessages[0], data: null });
    return;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).send({
        status: false,
        message: "Image size cannot exceed 2MB. Please upload a smaller image.",
        data: null,
      });
      return;
    }
    res.status(400).send({ status: false, message: err.message, data: null });
    return;
  }

  console.error(`Error in ${req.method} ${req.url}`, err.stack);
  res.status(500).send({
    status: false,
    message: err.message || "Something went wrong, please try again!",
    data: null,
  });
}

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(404).send({ status: false, message: "Not found", data: null });
}

process
  .on("unhandledRejection", (reason: any, promise: Promise<any>) => {
    console.error("Unhandled Rejection:", reason);
  })
  .on("uncaughtException", (err: Error, origin: string) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
  });
