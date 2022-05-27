import express from "express";
import user from "@/controllers/user.controller";

const router = express.Router();

router.post("/:up", user.updateUser);

export default router;
