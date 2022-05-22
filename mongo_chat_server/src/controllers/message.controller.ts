import { Request, Response } from "express";

async function getExample(req: Request, res: Response) {
  console.log("Hi");
}

export default {
  getExample,
};
