
import { Request, Response } from 'express'

import {v4 as uuidv4} from 'uuid';
import fetch from 'node-fetch';
import db from '@/services/notifications'
import {Headers} from "node-fetch";

async function addDeviceToken(req: Request, res: Response) {
    const deviceToken = req.params.deviceToken
    const {userID} = req.body

    await db.addDeviceToken(deviceToken, userID)

    res.send( {"status":"ok"})
}


async function createTopic(req: Request, res: Response) {
    const name = req.params.topic
    const topicTokenId = uuidv4();
    let answer

    if (await db.createTopic(name, topicTokenId)){
        answer = {"status":"ok","topicTokenId":topicTokenId}
    }else{
        answer = {"status":"error","error":"topic already exists"}
    }

    res.send(answer)
}

async function deleteTopic(req: Request, res: Response) {
    const topicTokenId = req.params.topic

    let answer

    if (await db.deleteTopic(topicTokenId)){
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

    if(await db.createNotification(userID, topicTokenId, title, content)){
        answer = {"status":"ok"}
        const device_token = await db.getDeviceToken(userID)
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

    const notifications = await db.getAllNotifications(userId)

    if(notifications)
        res.send({"status":'ok',"notifications":notifications})
}

async function getTopics(req: Request, res: Response){
    const topics = await db.getTopics()
    res.send({"status":'ok',"topics":topics})
}

export default {
    addDeviceToken,

    createTopic,
    deleteTopic,

    createNotification,
    getAllNotifications,

    getTopics,
}

async function sendNotification(title:string, content:string, device_token:string){
    console.log(title,content,device_token)
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "key=AAAArP_sy-s:APA91bFbcwvy_mjJtt94nZZ9rd7CDWNI2wykQ_t9hYQejRVj7IkN2VyRor1ZGM-p8jx5VoU_Uuwgk22fsWhMaixcUIw3JaNpmgdzxtJXxnACIxc8TFzhiAXiimlLjq-TwDngrman-G3f");
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "to": device_token,
        "notification": {
            "body": content,
            "title": title
        },
        "data": {
            "body": content,
            "title": title,
        }
    });

    fetch("https://fcm.googleapis.com/fcm/send", {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    })
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

