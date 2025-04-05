import { logger } from "./logger.js";

export function logEntry(req) {
  if (req) {
    logger.info(req.url);
    if (req.cookies) {
      //logger.info(req.cookies);
      //logger.info(req.headers);
      logger.info(`token: ${req.cookies.token}`);
    }
  }
}
