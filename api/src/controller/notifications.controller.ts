import { Request, Response } from 'express'
import {v4 as uuidv4} from 'uuid';
import fetch from 'node-fetch';
import fb from '@/services/notifications'
import { fdatasync } from 'fs';

async function createNotification(req: Request, res: Response) {

  const { client } = req.params
  const userId = req.params.userId
  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    body: JSON.stringify({
          "to" : "DEVICE_REGISTRATION_TOKEN",
          "notification" : {
              "body" : "Notification Body",
              "title": "Notification Title"
          },
          "data" : {
              "body" : "Notification Body",
              "title": "Notification Title"
          },
    }),
    headers: {
      ContentType: 'application/json',
      Authorization: 'key = AAAArP_sy-s:APA91bFbcwvy_mjJtt94nZZ9rd7CDWNI2wykQ_t9hYQejRVj7IkN2VyRor1ZGM-p8jx5VoU_Uuwgk22fsWhMaixcUIw3JaNpmgdzxtJXxnACIxc8TFzhiAXiimlLjq-TwDngrman-G3f'
    }
  });

  if (!response.ok) {
    throw new Error(`Error! status: ${response.status}`);
  }

  // DataBase
  let status = await fb.createNotification(parseInt(userId))

  if(status)
    res.send(status)

  else 
    res.status(500).send()

  return;
}

async function updateNotification(req: Request, res: Response) {
  // BataBase request to retrive the id of the notification
  const id = req.params.id
  if(id != null){
    const notificationBody = req.params.notificationBody
    const notificationText = req.params.notificationText
    const dataBody = req.params.dataBody
    const dataText = req.params.dataText

    res.send({"status":"Update Notification"})
  }
  else
    res.send('Update Nofication Failed!')
}

async function getAllUnseenNotifications(req: Request, res: Response) {
  // BataBase request to retrive the user id
  const userId = req.params.userId
  if(userId != null){
    res.send('Get All Seen Notifications!')
  }
  else
    res.send('Get All Seen Notifications Failed!')
}

async function getAllNotifications(req: Request, res: Response) {
  
  // BataBase request to retrive the user id
  const userId = req.params.userId
  if(userId != null){
    res.send('Get All Notifications!')
  }
  else
    res.send('Get All Notifications Failed!')

  // DataBase Functionality
  // user ID = 1
  let status = await fb.getAllNotifications(parseInt(userId))

  if(status)
    res.send(status)

  else 
    res.status(500).send()
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
  getAllUnseenNotifications,
  createTopic,
  deleteTopic,
}
