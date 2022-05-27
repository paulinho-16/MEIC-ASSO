import Group from "@/models/Group";

import { Request, Response } from "express";

async function getAllGroups(req: Request, res: Response) {
  return res.status(200).json(await Group.find());
}

async function _getGroupById(id: string) {
  return await Group.findById(id)
		.then((group: any) => {
			if (!group) {
				return { status: 404, error: `Group with id '${id}' not found.` }
			} else {
				return { status: 200, data: group }
			}
		})
		.catch(() => {
			return { status: 404, data: `Group with id '${id}' not found.` }
		})
}

async function getGroupById(req: Request, res: Response) {
  const {id} = req.params;
  if(id === undefined) return res.status(400).json("You need to specify the id argument.");
  const response = await _getGroupById(id);
  return res.status(response.status).json(response.data);
}

async function getGroupsByUser(req: Request, res: Response) {
  const {up} = req.params;
  if(up === undefined) return res.status(400).json("You need to specify the up argument.");
  return res.status(200).json((await Group.find({ userNumbers: up})));
}

async function createGroup(req: Request, res: Response) {
  const {name, userNumbers} = req.body;
  if(name  === undefined || userNumbers === undefined) return res.status(400).json("You need to specify all arguments: name and userNumbers.");
  const newGroup = await Group.create({name, userNumbers});
  await newGroup.populate("users");
  return res.status(200).json(newGroup);
}

async function getGroupMessages(req: Request, res: Response) {
  // eslint-disable-next-line prefer-const
  let {groupID, perPage, page} = req.body;
  if(groupID === undefined || perPage === undefined || page === undefined) return res.status(400).json("You need to specify the group, perPage and page arguments.")

  perPage = Number(perPage);
  page = Number(page);
  if(isNaN(perPage) || isNaN(page)) return res.status(400).json("Both perPage and page arguments need to be numbers.")

  const {status, data} = await _getGroupById(groupID);

  if (status >= 400) {
    return res.status(status).json(data);
  }

  const group = new Group(data);
  const messages = group.messages;
  return res.status(200).json(messages.slice(page * perPage, (page + 1) * perPage));
}

export default {
  getAllGroups,
  getGroupById,
  getGroupsByUser,
  createGroup,
  getGroupMessages
};