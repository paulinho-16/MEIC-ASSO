import Group from '@/models/Group'
import Message from '@/models/Message'
import User from '@/models/User'
import { Request, Response } from 'express'

async function getAllMessages(req: Request, res: Response) {
	let { perPage, page } = req.body
	if (perPage === undefined || page === undefined)
		return res.status(400).json('You need to specify both perPage and page arguments.')

	perPage = Number(perPage)
	page = Number(page)
	if (isNaN(perPage) || isNaN(page)) return res.status(400).json('Both perPage and page arguments need to be numbers.')

	return res.status(200).json(
		await Message.find()
			.skip(perPage * page)
			.limit(perPage)
	)
}

async function getMessage(req: Request, res: Response) {
  const {id} = req.params;
  if(id === undefined) return res.status(400).json("You need to specify the id argument.");
  Message.findById(id)
  .then((msg) => {
    return res.status(200).json(msg);
  })
  .catch(() => {
    return res.status(400).json(`Message with id '${id}' not found`);
  })
}

async function createMessage(req: Request, res: Response) {
  const {message, from, group} = req.body;
  if(group === undefined || message === undefined || from === undefined) return res.status(400).json("You need to specify all arguments: group, message and from.");
  const user = await User.findOne({number: from});
  if(!user) return res.status(400).json(`User '${from}' not found! Please submit a valid user number (upxxxxxxxxx).`)
  
  let groupObject;
  try {
    groupObject = await Group.findById(group);
  }
  catch {
    return res.status(400).json(`Group with id '${group}' not found! Please submit a valid group id.`)
  }  

  const newMessage = await Message.create({message, from: user._id});
  await newMessage.populate("from");

  await groupObject.update({$push: {messages: newMessage}})
  return res.status(200).json("Message created with success!");
}

export default {
	getAllMessages,
	getMessage,
	createMessage,
}
