import Group from "@/models/Group";

import { Request, Response } from "express";

async function getAllGroups(req: Request, res: Response) {
  return res.status(200).json(await Group.find());
}

async function getGroupById(req: Request, res: Response) {
  const {id} = req.params;
  await Group.findById(id)
  .then((group) => {
			return res.status(200).json(group)
		})
		.catch(() => {
			return res.status(404).json(`Group with id '${id}' not found!`)
		})
}

async function getGroupsByUser(req: Request, res: Response) {
  const {up} = req.params;
  return res.status(200).json((await Group.find({ userNumbers: up})));
}

async function createGroup(req: Request, res: Response) {
  const group = await Group.create(req.body);
  await group.populate("users");
  return res.status(200).json(group);
}

export default {
  getAllGroups,
  getGroupById,
  getGroupsByUser,
  createGroup
};
