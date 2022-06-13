import "module-alias/register";
import "source-map-support/register";

import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import database from "@/database";
import groupRoute from "@/routes/group";
import messageRoute from "@/routes/message";
import userRoute from "@/routes/user";
import logger, { createLoggerDir } from "./logger";

const PORT = process.env.PORT || 3000;

const app = express();

/*
 * Logging
 * Logs are saved in the logs directory
 *
 * 1. Requests
 *  - all requests are logged to default stdout with the morgan dev format
 *  - requests.log saves all the requests with the Standard Apache combined log format
 * 2. App logging
 *  - all app logs are logged to the default stdout
 *  - error.log saves all the logs with importance level of `error` or less
 *  - combined.log saves the logs with importance level of `info` of less
 */
const loggerDir = createLoggerDir();
const logStream = fs.createWriteStream(path.join(loggerDir, "requests.log"), {
  flags: "a",
});

const appLogger = logger(loggerDir);

app.use(morgan("dev")); // logging to console

app.use(
  morgan("combined", {
    stream: logStream,
  })
);

/* Database setup */
database();

/*
 * Application middleware
 * - cors
 * - body parser
 */
app.use(cors());
app.use(express.json());

app.use("/group", groupRoute);
app.use("/message", messageRoute);
app.use("/user", userRoute);

app.listen(PORT, () => {
  appLogger.info("app started listening on port", { message: PORT });
});

export default {
  logger: appLogger,
};
