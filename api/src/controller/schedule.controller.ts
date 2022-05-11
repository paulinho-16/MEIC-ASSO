import axios from 'axios'
// import * as cheerio from 'cheerio'
import { Request, Response } from 'express'
import { studentScheduleHTML } from '../config/data'
import constants from '../config/constants'

async function getStudentSchedule(req: Request, res: Response) {
  const mock = true
  const api = axios.create({ responseEncoding: 'binary' })
  const studentFestId = req.query.studentFestId
  const academicYear = req.query.academicYear
  const semesterNumber = req.query.semesterNumber

  const studentSchedulePageUrl = mock
    ? 'https://google.com'
    : `${constants.studentSchedulePageBaseUrl}?pv_fest_id=${studentFestId}&pv_ano_lectivo=${academicYear}&pv_periodos=${semesterNumber}`

  //TODO: Admin authentication to access student schedule page

  api
    .get(studentSchedulePageUrl)
    .then(response => {
      const studentSchedulePageHTML = mock ? studentScheduleHTML : response.data

      res.send({ studentSchedulePageHTML })
    })
    .catch(function (e) {
      console.log(e)
      res.send({ error: 'err' })
    })
}

export default {
  getStudentSchedule,
}
