import { Request, Response } from 'express'
import {
  Event
} from '@/@types/events'

import events from '@/services/calendar'
import { calendar_v3, google } from "googleapis";
import { makeOAuth2Client } from "../middleware/shared";

const marketing = {
  'acronym': 'MK',
  'week day': 'Tuesday',
  'time': '14:00-17:00',
  'room': 'B020',
  'teacher': 'GB',
  'type': 'TP'
}

const gestao_empresas = {
  'acronym': 'GEE',
  'week day': 'Thursday',
  'time': '14:00-17:00',
  'room': 'B006',
  'teacher': 'MR',
  'type': 'TP'
}

const cpm1 = {
  'acronym': 'CPM',
  'week day': 'Tuesday',
  'time': '09:00-10:30',
  'room': 'B229',
  'teacher': 'APM',
  'type': 'TP'
}

const cpm2 = {
  'acronym': 'CPM',
  'week day': 'Thursday',
  'time': '15:30-17:00',
  'room': 'B343',
  'teacher': 'APM',
  'type': 'TP'
}

const sigarra_timetable = [
  marketing, gestao_empresas, cpm1, cpm2
]

const evaluation_assessment = {
  'acronym': 'MK',
  'day': '21 junho',
  'time': '11:30-13:30',
  'rooms': 'B113'
} 

function parseJSONTimetable (sigarra_timetable: JSON){
  //for(let i = 0; i  < sigarra_timetable; i++){
    
  //}
} 




async function getCalendarEvents(req: Request, res: Response) {
    let startDate;
    if(req.query.startDate == null){
      const today = new Date();
      startDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    }
    else{
      startDate = req.query.startDate.toString()
    }
    const endDate = req.query.endDate == null ? null : req.query.endDate.toString();
    const retval = await events.getCalendarEvents(req.body.id, startDate, endDate);
    if(retval !== false){
      res.status(201).send(retval)
    }
    else{
      res.status(500).send('Something went wrong. Try again!')
    }
}

async function addCalendarEvent(req: Request, res: Response) {
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
    if (req.query["summary"] == null || req.query["date"] == null || req.query["startTime"] == null || req.query["endTime"] == null)
    {
        console.log(req);
        res.status(400).send("Invalid syntax!") // trocar para json com codigo de erro
        return
    }
    
    const new_event: Event = {
      summary: req.query.summary.toString(),
      description: req.query.description == null ? null : req.query.description.toString(),
      location: req.query.location == null ? null : req.query.location.toString(),
      date: new Date(req.query.date.toString()),
      startTime: new Date(req.query.date.toString() + ' ' + req.query.startTime.toString()),
      endTime: new Date(req.query.date.toString() + ' ' + req.query.endTime.toString()),
      recurrence: req.query.recurrence == null ? null: req.query.recurrence.toString(),
      isUni: false
    }

  const retval = await events.createEvent(new_event);

  if(retval != false){
    const eventId = retval
    const data = await events.createEventRelation(eventId, req.body.id);
    if(data){
        res.status(201).send('Success')
    }
    else{
      res.status(500).send('Something went wrong. Try again!')
    }
  }
  else{
    res.status(500).send('Something went wrong. Try again!')

  }
}

async function getGCToken(req: Request, res: Response) {
  const code = req.query["code"] as string;
  const oauth2Client = makeOAuth2Client();

  if (code){
    const refreshToken = await getRefreshToken(code);
    res.status(200).send(refreshToken);
  } 
  else{
    const url = getAuthUrl();
    res.status(200).send(url);
  }

  async function getAuthUrl() {
    const url = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: "offline",

      // scopes are documented here: https://developers.google.com/identity/protocols/oauth2/scopes#calendar
      scope: ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.events"],
    });

    console.log(`Go to this URL to acquire a refresh token:\n\n${url}\n`);
  }

  async function getRefreshToken(code: string) {
    const token = await oauth2Client.getToken(code);
    console.log(token);
  }
}

async function exportToGC(req: Request, res: Response){
  const token = req.query["token"] as string;
  const calendarClient = await makeCalendarClient(token);
  createCalendarOnGC(calendarClient);
  
}

async function makeCalendarClient(refreshToken : string) {
  const oauth2Client = makeOAuth2Client();
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });
  const calendarClient = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });
  return calendarClient;
}

async function addEventsToGC(uniCalendarId: string){

}

async function createCalendarOnGC(calendarClient : calendar_v3.Calendar) {

  const { data: calendars, status } = await calendarClient.calendarList.list();
  let uniCalendarId;

  if (status === 200) {
    calendars.items.forEach(calendar => {
      if(calendar.summary === "Uni4All Calendar"){
        uniCalendarId = calendar.id;
      }
    });
    if(uniCalendarId == null){
      const res = await calendarClient.calendars.insert({
        requestBody: {
             "summary": "Uni4All Calendar",
        },
      });
      uniCalendarId = res.data.id;
    }
  }
  return uniCalendarId;
}


export default {
    getCalendarEvents,
    addCalendarEvent,
    getGCToken
}
