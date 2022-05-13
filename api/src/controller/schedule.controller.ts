import axios from 'axios'
import * as cheerio from 'cheerio'
import { Request, Response } from 'express'
import { studentScheduleHTML } from '../config/data'
import constants from '../config/constants'

function addMinutesToTime(time: string, minsToAdd: number): string {
  return new Date(new Date('1970/01/01 ' + time).getTime() + minsToAdd * 60000).toLocaleTimeString(
    'en-UK',
    { hour: '2-digit', minute: '2-digit', hour12: false }
  )
}

type ScheduleEntry = {
  dayOfTheWeek: string
  startTime: string
  endTime: string
  curricularUnitName: string
  classType: string
  class: string
  professors: string
  room: string
}

async function getStudentSchedule(req: Request, res: Response) {
  const mock = true
  const api = axios.create({ responseEncoding: 'binary' })
  const studentFestId = req.query.studentFestId
  const academicYear = req.query.academicYear

  const studentSchedulePageUrl = mock
    ? 'https://google.com'
    : `${constants.studentSchedulePageBaseUrl}?pv_fest_id=${studentFestId}&pv_ano_lectivo=${academicYear}`

  //TODO: Admin authentication to access student schedule page

  api
    .get(studentSchedulePageUrl)
    .then(response => {
      const studentSchedulePageHTML = mock ? studentScheduleHTML : response.data

      const $ = cheerio.load(studentSchedulePageHTML.toString('latin1'))

      const scheduleTable = $(`table.horario`)

      const schedule: ScheduleEntry[] = []

      const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

      let classStartTime = ''

      $(scheduleTable)
        .find('tr')
        .each((i, tr) => {
          $(tr)
            .find('tr > td.TP,td.L,td.T,td.TE,td.PL,td.horas')
            .each((j, td) => {
              const attributes = Object.keys(td.attribs).map(name => ({
                name: name.toString(),
                value: td.attribs[name].toString(),
              }))
              const attributesArr = Object.values(attributes)

              if (j == 0) classStartTime = $(td).text().split(' - ')[0]

              for (let w = 0; w < attributesArr.length; w++) {
                if (Object.values(attributesArr[w]).includes('rowspan')) {
                  const rowspan = attributesArr[w].value

                  const minutesToAdd = Number(rowspan) * 30
                  const classEndTime = addMinutesToTime(classStartTime, minutesToAdd)

                  schedule.push({
                    dayOfTheWeek: daysOfTheWeek[j],
                    startTime: classStartTime,
                    endTime: classEndTime,
                    curricularUnitName: $(td).text().split(' ')[0],
                    classType: $(td).text().split('(')[1].split(')')[0],
                    class: $(td).text().split('\n')[1].split('\n')[0],
                    professors: $(td).text().split('\n').at(-2),
                    room: $(td).text().split('\n\n\n\n')[1].split('\n')[0],
                  })
                }
              }
            })
        })

      res.send({ scheduleTable: schedule })
    })
    .catch(function (e) {
      console.log(e)
      res.send({ error: 'err' })
    })
}

export default {
  getStudentSchedule,
}
