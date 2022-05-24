import "module-alias/register";
import "source-map-support/register";

import express from "express";
import cors from "cors";

import database from "@/database";
import groupRoute from "@/routes/group";
import messageRoute from "@/routes/message";
import userRoute from '@/routes/user';

database();

const app = express();
app.use(cors());
app.use(express.json())

app.use("/group", groupRoute);
app.use("/message", messageRoute);
app.use("/user", userRoute);

app.listen(3000, () => {
  console.log("listening on *:3000");
});

module.exports = app;
