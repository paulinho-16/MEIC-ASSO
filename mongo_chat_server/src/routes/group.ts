import express from "express";
import group from "@/controllers/group.controller";

const router = express.Router();

router.get("/", group.getAllGroups);
router.get("/:id", group.getGroup);

router.post('/', group.createGroup);

export default router;
