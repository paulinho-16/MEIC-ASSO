import express from "express";
import message from "@/controllers/message.controller";

const router = express.Router();

/* GET home page. */
router.get("/", message.getExample);

export default router;
