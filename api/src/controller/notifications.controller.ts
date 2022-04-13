import { Request, Response } from 'express'

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
    res.send('Create Topic!')
}

async function deleteTopic(req: Request, res: Response) {
    res.send('Delete Topic!')
}

export default {
  createNotification,
  updateNotification,
  getAllNotifications,
  getAllSeenNotifications,
  createTopic,
  deleteTopic,
}
