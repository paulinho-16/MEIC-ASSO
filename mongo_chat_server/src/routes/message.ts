import express from "express";
import message from "@/controllers/message.controller";

const router = express.Router();

router.get("/", message.getAllMessages);
router.get("/:id", message.getMessage);

router.post("/", message.createMessage);

export default router;
