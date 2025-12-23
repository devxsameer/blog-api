import { Response } from "express";

export function sendResponse(
  res: Response,
  {
    statusCode = 200,
    message = "Success",
    data = null,
    meta = null,
  }: { statusCode?: number; message?: string; data?: any; meta?: any }
) {
  return res.status(statusCode).json({ success: true, message, data, meta });
}
