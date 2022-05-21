import Group from "@/models/Group";

import { Request, Response } from "express";

async function getExample(req: Request, res: Response) {
  return res.status(200).json(await Group.find().populate("users"));
}

export default {
  getExample,
};
