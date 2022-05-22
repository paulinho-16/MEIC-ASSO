import Message from "@/models/Message";
import { Request, Response } from "express";

async function getAllMessages(req: Request, res: Response) {
  return res.status(200).json(await Message.find());
}

async function getMessage(req: Request, res: Response) {
  const {id} = req.params;
  Message.findById(id)
  .then((msg) => {
    return res.status(200).json(msg);
  })
  .catch(() => {
    return res.status(400).json(`Message with id '${id}' not found`);
  })
}

async function createMessage(req: Request, res: Response) {
  return res.status(200).json(await Message.find());
}

export default {
  getAllMessages,
  getMessage,
  createMessage
};
