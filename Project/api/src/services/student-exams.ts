import * as cheerio from 'cheerio'
import axios from 'axios'
import constants from '@/config/constants'
import {
  ExamsMap,
  Season,
  Exam
} from '@/@types/student-exams'

async function getStudentExams(studentNumber: string) {
  const studentExamsUrl = `${constants.studentExamsUrl}${studentNumber}`

  const promise = axios.get(studentExamsUrl, { responseEncoding: 'binary' })
    .then(response => {
      const studentExamsHTML = response.data

      const $ = cheerio.load(studentExamsHTML.toString('latin1'))

      const seasons: Season[] = []
      const nameTarget = $('a[name=ancora-conteudo] + h1 + h2')
      const seasonsTarget = $('a[name=ancora-conteudo] + h1 + h2 + h3')

      seasonsTarget.each((i, e) => {
        const exams: Exam[] = []
        const examsTargets = $(e).next().find('tr').slice(1)

        examsTargets.each((i, e) => {
          const examProperties = $(e).find('td')
          let properties: string[] = []

          examProperties.each((i, e) => {
            properties.push($(e).text())
            
            if (i === 5) {
              const exam: Exam = {
                curricularUnit: properties[0].trim(),
                day: properties[1].trim(),
                date: properties[2].trim(),
                beginHour: properties[3].trim(),
                endHour: properties[4].trim(),
                rooms: properties[5].trim()
              }

              exams.push(exam)
              properties = []
            }
          })
        })

        const season: Season = {
          name: $($(e)).text(),
          exams: exams
        }
        
        seasons.push(season)
      })

      const examsMap: ExamsMap = {
        studentName: nameTarget.text().split('-')[1].trim(),
        seasons: seasons
      }

      return examsMap
    })

  return promise
}

export default {
  getStudentExams,
}
