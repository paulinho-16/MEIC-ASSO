import express from "express";
import group from "@/controllers/group.controller";

const router = express.Router();

router.get("/", group.getAllGroups);
router.get("/messages", group.getGroupMessages);
router.get("/:id", group.getGroupById);
router.get("/user/:up", group.getGroupsByUser);
router.post("/:id/users", group.addToGroup);
router.delete("/:id/users", group.removeFromGroup);

router.post("/", group.createGroup);

export default router;
