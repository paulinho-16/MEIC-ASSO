import User from "@/models/User";
import { Request, Response } from "express";

async function updateUser(req: Request, res: Response) {
  const {up} = req.params;
  if(up === undefined) return res.status(400).json("You need to specify the up argument.");
  const user =  await User.findOneAndUpdate({number: up}, req.body);
  if(!user) return res.status(400).json(`User ${up} not found!`)
  return res.status(200).json("User updated with success!");
}


export default {
    updateUser
};
