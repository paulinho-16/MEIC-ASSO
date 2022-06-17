import "module-alias/register";
import "source-map-support/register";

import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import setRequests from "@/socket";
import logger, { createLoggerDir } from "./logger";

const PORT = process.env.PORT || 3000;

const app = express();

/*
 * Logging
 * Logs are saved in the logs directory
 *
 * 1. App logging
 *  - all app logs are logged to the default stdout
 *  - error.log saves all the logs with importance level of `error` or less
 *  - combined.log saves the logs with importance level of `info` of less
 */
const loggerDir = createLoggerDir();

const appLogger = logger(loggerDir);

/* Application middlware
 * 1. CORS
 * 2. Body parser
 */
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setRequests(io);

server.listen(PORT, () => {
  appLogger.info("app started listening on port", { message: PORT });
});

export default {
  logger: appLogger,
};
