import { Request, Response } from 'express'

import {v4 as uuidv4} from 'uuid';
import fetch from 'node-fetch';
import fb from '@/services/notifications'


async function addDeviceToken(req: Request, res: Response) {
    const deviceToken = req.params.client
    const {userID} = req.body

    await fb.addDeviceToken(deviceToken, userID)

    res.send( {"status":"ok"})
}

async function removeDeviceToken(req: Request, res: Response) {
    const deviceToken = req.params.client
    const {userID} = req.body

    await fb.removeDeviceToken(deviceToken, userID)

    res.send( {"status":"ok"})
}

async function createTopic(req: Request, res: Response) {
    const name = req.params.topic
    const identification_token = uuidv4();
    let answer

    if (await fb.createTopic(name, identification_token)){
        answer = {"status":"ok","identification_token":identification_token}
    }else{
        answer = {"status":"error","error":"topic already exists"}
    }

    res.send(answer)
}

async function deleteTopic(req: Request, res: Response) {
    const identification_token = req.params.topic

    let answer

    if (await fb.deleteTopic(identification_token)){
        answer = {"status":"ok"}
    }else {
        answer = {"status":"error","error":"topic missing"}
    }

    res.send(answer)
}

async function createNotification(req: Request, res: Response) {
  const userID = req.params.client;
  const {topic_identification_token,title,content} = req.body

  let answer

  if(await fb.createNotification(userID, topic_identification_token, title, content)){
      answer = {"status":"ok"}
      await sendNotification(title, content, await fb.getDevicesTokens(userID))
  }else {
      answer = {"status":"error","error":"error creating notification,check the userId and topic_identification_token"}
  }

  res.send(answer)
}

async function getAllNotifications(req: Request, res: Response) {
  // BataBase request to retrive the user id
  const userId = req.params.userId
  if(userId == null){
    res.send({"status":'error',"error":"user does not exist"})
      return
  }

  const notifications = await fb.getAllNotifications(userId)

  if(notifications)
    res.send({"status":'error',"notifications":notifications})
}

async function sendNotification(title:string, content:string,devices_tokens:string){
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        body: JSON.stringify({
            "to" : "device_token",
            "notification" : {
                "body" : content,
                "title": title
            },
            "data" : {
                "body" : content,
                "title": title
            },
        }),
        headers: {
            ContentType: 'application/json',
            Authorization: 'key = AAAArP_sy-s:APA91bFbcwvy_mjJtt94nZZ9rd7CDWNI2wykQ_t9hYQejRVj7IkN2VyRor1ZGM-p8jx5VoU_Uuwgk22fsWhMaixcUIw3JaNpmgdzxtJXxnACIxc8TFzhiAXiimlLjq-TwDngrman-G3f'
        }
    });
}

export default {
    addDeviceToken,
    removeDeviceToken,

    createTopic,
    deleteTopic,

    createNotification,
    getAllNotifications,
}
