import pino from "pino";
import { join } from "path";
import * as constants from "../constants/constant.js";

const __dirname = constants.logs_folder;

const transport = pino.transport({
  targets: [
    {
      target: "pino-roll",
      options: {
        file: join(__dirname, "log"),
        frequency: "daily",
        mkdir: true,
        size: "100k",
        limit: { count: 5 },
        dateFormat: "yyyyMMdd",
        extension: ".log",
      },
    },
  ],
});

export const logger = pino(
  {
    level: "info",
    formatters: {
      level: (lable) => {
        return { level: lable.toUpperCase() };
      },
      bindings: (bindings) => {
        //return { pid: bindings.pid, host: bindings.hostname };
        return { pid: bindings.pid };
      },
    },
    //timestamp: pino.stdTimeFunctions.isoTime,
    timestamp: () =>
      `,"time":"${
        new Date(Date.now()).toLocaleDateString() +
        "T" +
        new Date(Date.now()).toLocaleTimeString()
      }"`,
  },
  transport
);

//logger.info('Hello, Pino!');
//logger.error('Testing error log');
