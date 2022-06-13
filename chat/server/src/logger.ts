import path from "path";
import fs from "fs";
import winston from "winston";

export function createLoggerDir() {
  const loggerDir = path.join(__dirname, "logs");

  if (!fs.existsSync(loggerDir)) {
    fs.mkdirSync(loggerDir);
  }

  return loggerDir;
}

export default function createLogger(loggerDir: string) {
  const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple()
    ),
    defaultMeta: { service: "app" },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({
        dirname: loggerDir,
        filename: "error.log",
        level: "error",
      }),
      new winston.transports.File({
        dirname: loggerDir,
        filename: "combined.log",
      }),
    ],
  });

  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
  }

  return logger;
}
