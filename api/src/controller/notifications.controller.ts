
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
        await db.createErrorLog("01", "topic already exists");
    }

    res.send(answer)
}

async function deleteTopic(req: Request, res: Response) {
    const topicTokenId = req.params.topic

    let answer

    if (await db.deleteTopic(topicTokenId)){
        answer = {"status":"ok"}
    }else {
        answer = {"status":"error","error":"trying to exist a unexisting topic"}
        await db.createErrorLog("02", "trying to exist a unexisting topic");
    }

    res.send(answer)
}

async function createNotification(req: Request, res: Response) {
    const userID = req.params.user;
    const {topicTokenId, title, content, date} = req.body

    let answer

    if(await db.checkIfIgnored(userID,topicTokenId)){
        answer = {"status":"ok","ignored":"true"}
    }else {
        if (await db.createNotification(userID, topicTokenId, title, content)) {
            answer = {"status": "ok"}
            const device_token = await db.getDeviceToken(userID)
            if (device_token == false) {
                answer = {
                    "status": "error",
                    "error": "error creating notification,check the userId and topic_identification_token"
                }
                await db.createErrorLog("10", "error creating notification,check the userId and topic_identification_token");
            } else {
                await sendNotification(title, content, device_token,date)
            }
        } else {
            answer = {
                "status": "error",
                "error": "error creating notification,check the userId and topic_identification_token"
            }
            await db.createErrorLog("10", "error creating notification,check the userId and topic_identification_token");
        }
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
    else{
        await db.createErrorLog("11", "couldn't retrieve notifications upon request");
    }
}

//começa novo

async function getTopics(req: Request, res: Response){
    const topics = await db.getTopics()
    res.send({"status":'ok',"topics":topics})
}

async function getBlockedTopics(req: Request, res: Response){
    const userId = req.params.user
    if(userId == null){
        res.send({"status":'error',"error":"user does not exist"})
        await db.createErrorLog("12", "user trying to get blocked topics doesn't exist");
        return
    }

    const topics = await db.getBlockedTopics(userId)
    res.send({"status":'ok',"blocked_topics":topics})
}

async function ignoreTopics(req: Request, res: Response){
    const {topics} = req.body
    if(topics == null){
        res.send({"status":'error',"error":"topics not specified"})
        await db.createErrorLog("13", "no topic specified");
        return
    }
    const userId = req.params.user
    if(userId == null){
        res.send({"status":'error',"error":"user does not exist"})
        await db.createErrorLog("14", "user trying to get ignore topics doesn't exist");
        return
    }

    console.log(topics)

    await db.ignoreTopics(topics, userId)

    res.send({"status":'ok',"blocked_topics":topics})
}

async function stopIgnoreTopics(req: Request, res: Response){
    const {topics} = req.body
    if(topics == null){
        res.send({"status":'error',"error":"topics not specified"})
        await db.createErrorLog("14", "topic to ignore was not specified");
        return
    }
    const userId = req.params.user
    if(userId == null){
        res.send({"status":'error',"error":"user does not exist"})
        await db.createErrorLog("14", "user trying to stop ignore topics doesn't exist");
        return
    }

    await db.stopIgnoreTopics(topics,userId)
    res.send({"status":'ok',"blocked_topics":topics})
}


// acaba novo
export default {
    addDeviceToken,

    createTopic,
    deleteTopic,

    createNotification,
    getAllNotifications,

    getTopics,
    getBlockedTopics,

    ignoreTopics,
    stopIgnoreTopics,
}

async function sendNotification(title:string, content:string, device_token:string,date :string){
    console.log(title,content,device_token)
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "key=AAAArP_sy-s:APA91bFbcwvy_mjJtt94nZZ9rd7CDWNI2wykQ_t9hYQejRVj7IkN2VyRor1ZGM-p8jx5VoU_Uuwgk22fsWhMaixcUIw3JaNpmgdzxtJXxnACIxc8TFzhiAXiimlLjq-TwDngrman-G3f");
    myHeaders.append("Content-Type", "application/json");

    let raw
    if (date == null){
        raw = JSON.stringify({
            "to": device_token,
            "notification": {
                "body": content,
                "title": title
            },
            "data": {
                "body": content,
                "title": title
            }
        });
    }else{
        raw = JSON.stringify({
            "to": device_token,
            "notification": {
                "body": content,
                "title": title
            },
            "data": {
                "body": content,
                "title": title,
                "isScheduled" : "true",
                "scheduledTime" : date
            }
        });
    }

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

