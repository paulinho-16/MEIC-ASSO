import { Request, Response } from 'express'
import {
  Event
} from '@/@types/events'

import events from '@/services/calendar'


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

async function parseJsonTimetable(userdId: string){

  const timetable = '{"scheduleTable":[{"dayOfTheWeek":"Wednesday","startTime":"09:00","endTime":"10:30","curricularUnitName":"CPM","classType":"TP","class":"1MEIC01","professors":"APM","room":"B229"},{"dayOfTheWeek":"Saturday","startTime":"09:00","endTime":"12:00","curricularUnitName":"ASSO","classType":"TP","class":"1MEIC01","professors":"AMA","room":"B303"},{"dayOfTheWeek":"Wednesday","startTime":"14:00","endTime":"17:00","curricularUnitName":"BDNR","classType":"TP","class":"1MEIC01","professors":"SSN","room":"B203"},{"dayOfTheWeek":"Saturday","startTime":"14:00","endTime":"16:00","curricularUnitName":"LGP","classType":"T","class":"COMP_2933","professors":"GMG","room":"B001"},{"dayOfTheWeek":"Tuesday","startTime":"14:30","endTime":"17:30","curricularUnitName":"GEE","classType":"TP","class":"1MEIC01","professors":"JCR+JPC+LP+MCF","room":"B024"},{"dayOfTheWeek":"Wednesday","startTime":"15:30","endTime":"17:00","curricularUnitName":"CPM","classType":"TP","class":"1MEIC01","professors":"APM","room":"B343"}]}'
  
  let timetableObject = JSON.parse(timetable)
  let scheduleTable = timetableObject.scheduleTable

  for (let index = 0; index < scheduleTable.length; index++) {
    const classBlock = scheduleTable[index];
    const new_event: Event = {
      summary: classBlock.curricularUnitName,
      description: classBlock.dayOfTheWeek + " " + classBlock.classType + " " + classBlock.class + " " + classBlock.professors,
      location: classBlock.room,
      date: new Date("2022-05-21"),
      startTime: new Date("2022-05-21" + ' ' + classBlock.startTime + ":00"),
      endTime: new Date("2022-05-21" + ' ' + classBlock.endTime + ":00"),
      recurrence: "weekly",
      isUni: true
    }

    let event_id = await events.eventExists(new_event.startTime, new_event.endTime, new_event.summary, new_event.description)

    if (event_id > 0){
      if (!await events.eventRelationExists(userdId, event_id)){
        await events.createEventRelation(event_id, userdId);
      }
      continue
    }

    const retval = await events.createEvent(new_event);

    if(retval != false){
      const eventId = retval
      await events.createEventRelation(eventId, userdId);
    }

  } 

}

async function parseJsonExams(userdId: string){
  
  const exams = '{"course": "MIEIC", "seasons": [{"name": "normal", "exams": [{"acronym": "MK", "url": "asdadaw", "day": "21-06-2022", "begin": "14:30", "duration": "2 hours", "rooms": "B104 B107"}]}]}'
  let examsObject = JSON.parse(exams)
  let seasons = examsObject.seasons

  for (let x = 0; x < seasons.length; x++) {
    const season = seasons[x];  
    let exams = season.exams

    for (let y = 0; y < exams.length; y++) {
      const exam = exams[y];

      const new_event: Event = {
        summary: exams.course + ' ' + exam.acronym + ' ' + season.name,
        description: exam.url,
        location: exam.rooms,
        date: new Date(exam.day),                                                // verify day format
        startTime: new Date(exam.day + ' ' + exam.begin + ":00"),
        endTime: new Date(exam.day + ' ' + exam.begin + exam.duration + ":00"), // verify duration format
        recurrence: "single",
        isUni: true
      }

      let event_id = await events.eventExists(new_event.startTime, new_event.endTime, new_event.summary, new_event.description)

      if (event_id > 0){
        if (!await events.eventRelationExists(userdId, event_id)){
          await events.createEventRelation(event_id, userdId);
        }
        continue
      }
  
      const retval = await events.createEvent(new_event);
  
      if(retval != false){
        const eventId = retval
        await events.createEventRelation(eventId, userdId);
      }

    }
    
  }
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


export default {
    getCalendarEvents,
    addCalendarEvent
}
