import axios from 'axios'
import * as cheerio from 'cheerio'
import { Request, Response } from 'express'
import { studentScheduleHTML } from '../config/data'
import constants from '../config/constants'

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

      const schedule: string[] = []

      const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

      let currentTime = ''

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

              if (j == 0) currentTime = $(td).text()

              console.log(currentTime)

              for (let w = 0; w < attributesArr.length; w++) {
                if (Object.values(attributesArr[w]).includes('rowspan')) {
                  const rowspan = attributesArr[w].value
                  schedule.push(
                    currentTime.split(' - ')[0] +
                      ' : ' +
                      daysOfTheWeek[j] +
                      ' : ' +
                      $(td).text() +
                      ' : ' +
                      'rowspan = ' +
                      rowspan
                  )
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
