import express from "express";
import group from "@/controllers/group.controller";

const router = express.Router();

/* GET home page. */
router.get("/", group.getExample);

export default router;
