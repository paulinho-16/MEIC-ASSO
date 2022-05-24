import mongoose from "mongoose";

import { populate } from "@/database/populate";

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    });
    mongoose.set('debug', true);
    console.log("MongoDB Connected");
    console.log("Populating database");
    populate().then(() => console.log("Database populated"));
  } catch (err) {
    console.log("MongoDB NOT Connected: " + err.message);
  }
}

export default connect;
