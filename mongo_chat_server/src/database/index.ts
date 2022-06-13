import app from "@/app";
import mongoose from "mongoose";

import { populate } from "@/database/populate";

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    });
    mongoose.set("debug", false);
    app.logger.info("connected to database", { service: "database" });
    app.logger.info("populating database...", { service: "database" });
    populate()
      .then(() =>
        app.logger.info("database populated successfully", {
          service: "database",
        })
      )
      .catch((err) =>
        app.logger.error("failed to populate database", {
          message: err.message,
        })
      );
  } catch (err) {
    app.logger.error("failed to connect to database", {
      message: err.message,
      service: "database",
    });
  }
}

export default connect;
