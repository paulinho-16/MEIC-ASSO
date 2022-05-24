import { Request, Response } from 'express'

import {v4 as uuidv4} from 'uuid';
import fetch from 'node-fetch';
import fb from '@/services/notifications'


async function addDeviceToken(req: Request, res: Response) {
    const deviceToken = req.params.deviceToken
    const {userID} = req.body

    await fb.addDeviceToken(deviceToken, userID)

    res.send( {"status":"ok"})
}


async function createTopic(req: Request, res: Response) {
    const name = req.params.topic
    const topicTokenId = uuidv4();
    let answer

    if (await fb.createTopic(name, topicTokenId)){
        answer = {"status":"ok","topicTokenId":topicTokenId}
    }else{
        answer = {"status":"error","error":"topic already exists"}
    }

    res.send(answer)
}

async function deleteTopic(req: Request, res: Response) {
    const topicTokenId = req.params.topic

    let answer

    if (await fb.deleteTopic(topicTokenId)){
        answer = {"status":"ok"}
    }else {
        answer = {"status":"error","error":"topic missing"}
    }

    res.send(answer)
}

async function createNotification(req: Request, res: Response) {
  const userID = req.params.user;
  const {topicTokenId, title, content} = req.body

  let answer

  if(await fb.createNotification(userID, topicTokenId, title, content)){
      answer = {"status":"ok"}
      const device_token = await fb.getDeviceToken(userID)
      await sendNotification(title, content, device_token)
  }else {
      answer = {"status":"error","error":"error creating notification,check the userId and topic_identification_token"}
  }

  res.send(answer)
}

async function getAllNotifications(req: Request, res: Response) {
  // DataBase request to retrive the user id
  const userId = req.params.user
  if(userId == null){
    res.send({"status":'error',"error":"user does not exist"})
      return
  }

  const notifications = await fb.getAllNotifications(userId)

  if(notifications)
    res.send({"status":'ok',"notifications":notifications})
}

async function sendNotification(title:string, content:string, device_token:string){
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        body: JSON.stringify({
            "to" : device_token,
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

    createTopic,
    deleteTopic,

    createNotification,
    getAllNotifications,
}
