import { Request, Response } from 'express'
import {v4 as uuidv4} from 'uuid';
import fetch from 'node-fetch';

async function createNotification(req: Request, res: Response) {

  const { client } = req.params
    
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
          }
    }),
    headers: {
      ContentType: 'application/json',
      Authorization: 'key = AAAArP_sy-s:APA91bFbcwvy_mjJtt94nZZ9rd7CDWNI2wykQ_t9hYQejRVj7IkN2VyRor1ZGM-p8jx5VoU_Uuwgk22fsWhMaixcUIw3JaNpmgdzxtJXxnACIxc8TFzhiAXiimlLjq-TwDngrman-G3f'
    }
  });

  if (!response.ok) {
    throw new Error(`Error! status: ${response.status}`);
  }

  return;
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
