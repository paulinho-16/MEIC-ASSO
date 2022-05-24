import express from "express";
import group from "@/controllers/group.controller";

const router = express.Router();

router.get("/", group.getAllGroups);
router.get("/:id", group.getGroupById);
router.get("/user/:up", group.getGroupsByUser);

router.post('/', group.createGroup);

export default router;
