import { Request, Response } from 'express'
import {v4 as uuidv4} from 'uuid';

async function createNotification(req: Request, res: Response) {
    res.send('Create Notifications!')
}

async function updateNotification(req: Request, res: Response) {
    res.send('Update Notifications!')
}

async function getAllSeenNotifications(req: Request, res: Response) {
    res.send('Get All Seen Notifications!')
}

async function getAllNotifications(req: Request, res: Response) {
    res.send('Get All Notifications!')
}

async function createTopic(req: Request, res: Response) {
    const name = req.params.topic
    const identification_token = uuidv4();
    const answer = {"status":"ok","identification_token":identification_token}


    res.send(answer)
}

async function deleteTopic(req: Request, res: Response) {
    const topic = req.params.topic
    const identification_token = req.body.identification_token;
    const answer = {"status":"ok"}

    res.send(answer)
}

export default {
  createNotification,
  updateNotification,
  getAllNotifications,
  getAllSeenNotifications,
  createTopic,
  deleteTopic,
}
