import axios from 'axios'
import * as cheerio from 'cheerio'
import { Request, Response } from 'express'
import { studentPageHTML, planPositionPageHTML } from '../config/mockHtml/studentGrades'
import { InspectMajor, Grade, MajorGrades } from '../@types/grades'
import constants from '../config/constants'

async function get(req: Request, res: Response) {
  const mock = true
  const api = axios.create({ responseEncoding: 'binary' })
  const studentNumber = req.params.studentNumber
  const studentPageUrl = mock
    ? 'https://google.com'
    : `${constants.studentPageBaseUrl}=${studentNumber}`

  let inspectMajors: InspectMajor[]
  const studentGrades: MajorGrades[] = []

  //TODO: Admin authentication to access student page with `studentNumber`

  api
    .get(studentPageUrl)
    .then(response => {
      const studentHTML = mock ? studentPageHTML : response.data
      inspectMajors = cheerioGetInspectMajors(studentHTML)
      if (inspectMajors === null) res.send(`No majors found for student ${studentNumber}`)
    })
    .then(() => {
      for (const major of inspectMajors) {
        const planPositionHTML = planPositionPageHTML // TODO: get planPositionHTML using planPositionURL
        const majorGrades = cheerioScrapeGrades(major.name, planPositionHTML)
        studentGrades.push(majorGrades)
      }
    })
    .then(() => {
      res.send(studentGrades)
    })
    .catch(function (e) {
      console.log(e)
    })
}

/**
 * @brief collect all courses a student has had (name and url) from student page
 */
function cheerioGetInspectMajors(studentHTML: string): InspectMajor[] {
  const inspectMajors: InspectMajor[] = []
  const $ = cheerio.load(studentHTML.toString())

  // collect active majors
  const activeMajors = $('div .estudante-lista-curso-activo')
  for (const activeMajor of activeMajors) {
    const href = $(activeMajor).find('.estudante-lista-curso-detalhes a').attr('href')
    const clickableMajor = $(activeMajor).find('.estudante-lista-curso-nome a').text()
    const unclickableMajor = $(activeMajor).find('.estudante-lista-curso-nome').text()

    if (href) {
      const pv_fest_id: number = parseInt(href.split('pv_fest_id=')[1])
      inspectMajors.push({
        name: clickableMajor || unclickableMajor,
        pv_fest_id: pv_fest_id,
        academicPathUrl: href ? `${constants.academicPathBaseUrl}=${pv_fest_id}` : null,
        planPositionUrl: href ? `${constants.planPositionBaseUrl}=${pv_fest_id}` : null,
      })
    }
  }

  // collect previous majors
  const historyMajorNames = $('table.dadossz > tbody tr td:first-child')
  const historyMajorHrefs = $('table.dadossz > tbody tr td:last-child a')

  for (let i = 0; i < historyMajorHrefs.length; i++) {
    const name = $(historyMajorNames[i]).text()
    const href = $(historyMajorHrefs[i]).attr('href')

    if (href) {
      const pv_fest_id: number = parseInt(href.split('pv_fest_id=')[1])
      inspectMajors.push({
        name: name,
        pv_fest_id: pv_fest_id,
        academicPathUrl: href ? `${constants.academicPathBaseUrl}=${pv_fest_id}` : null,
        planPositionUrl: href ? `${constants.planPositionBaseUrl}=${pv_fest_id}` : null,
      })
    }
  }

  if (inspectMajors.length === 0) return null
  else return inspectMajors
}

/**
 * @brief retireve grades from student's plan position for the respective major
 */
function cheerioScrapeGrades(major: string, planPositionHTML: string): MajorGrades {
  const grades: Grade[] = []
  const $ = cheerio.load(planPositionHTML.toString())
  const yearsDiv = $('#conteudoinner > div.caixa > div.caixa > div.caixa > table.dadossz')

  let year = 0
  let semester = 1

  for (const yearDiv of yearsDiv) {
    year++
    $(yearDiv)
      .find('table.dadossz > tbody tbody > tr')
      .each(function (index, row) {
        const text = $(row).text()
        const skip = index === 0 || text.includes('Código') || text.includes('Semestre')
        const done = $(row).attr('class') ? $(row).attr('class').includes('feito') : false
        const attempted = $(row).attr('class') ? $(row).attr('class').includes('fazer') : false

        if (text.includes('º Semestre') && !text.includes('º SemestreC')) {
          semester = parseInt(text.split('ºSemestre')[0].trim())
        }

        if (done) {
          // done courses (green)
          if ($(row).find('td:nth-child(1)').text() === '') {
            const fold = $(row).find('td:nth-child(3) a').attr('href')
            const foldID = fold.split("javascript:toggleDiv('")[1].split("'")[0]
            const foldDiv = $(`#${foldID} table.dadossz table.dadossz tbody tr`)
            $(foldDiv).each(function (index, element) {
              if (!$(element).text().includes('Código')) {
                const cellText3 = $(element)
                  .find('td:nth-child(3)')
                  .text()
                  .split('Por reconhecimento - ')
                const uc = cellText3[0].trim()
                const code = $(element).find('td:nth-child(1)').text()
                const result =
                  parseFloat($(element).find('td:nth-child(7)').text()) ||
                  parseFloat(cellText3[1].replace(',', '.'))
                const credits = parseFloat(
                  $(element).find('td:nth-child(6)').text().replace(',', '.')
                )
                const acronym = $(element).find('td:nth-child(2)').text()
                grades.push({ uc, year, code, result, credits, acronym, semester })
              }
            })
          } else {
            const cellText3 = $(row).find('td:nth-child(3)').text().split('Por reconhecimento - ')
            const uc = cellText3[0].trim()
            const code = $(row).find('td:nth-child(1)').text()
            const result =
              parseFloat($(row).find('td:nth-child(6)').text()) ||
              parseFloat(cellText3[1].replace(',', '.'))
            const credits = parseFloat($(row).find('td:nth-child(5)').text().replace(',', '.'))
            const acronym = $(row).find('td:nth-child(2)').text()
            grades.push({ uc, year, code, result, credits, acronym, semester })
          }
        } else if (attempted) {
          // attempted courses (amber)
          if ($(row).find('td:nth-child(4)').text() !== '') {
            const fold = $(row).find('td:nth-child(3) a').attr('href')
            const foldID = fold.split("javascript:toggleDiv('")[1].split("'")[0]
            const foldDiv = $(`#${foldID} table.dadossz table.dadossz tbody tr`)

            $(foldDiv).each(function (index, element) {
              const localDone = $(element).attr('class')
                ? $(element).attr('class').includes('feito')
                : false
              const localAttempted = $(element).attr('class')
                ? $(element).attr('class').includes('fazer')
                : false

              if (!$(element).text().includes('Código') && (localDone || localAttempted)) {
                // Option group
                const cellText3 = $(element)
                  .find('td:nth-child(3)')
                  .text()
                  .split('Por reconhecimento - ')
                const uc = cellText3[0].trim()
                const code = $(element).find('td:nth-child(1)').text()
                const result =
                  parseFloat($(element).find('td:nth-child(7)').text()) ||
                  parseFloat(cellText3[1].replace(',', '.'))
                const credits = parseFloat(
                  $(element).find('td:nth-child(6)').text().replace(',', '.')
                )
                const acronym = $(element).find('td:nth-child(2)').text()
                grades.push({ uc, year, code, result, credits, acronym, semester })
              }
            })
          } else {
            const cellText3 = $(row).find('td:nth-child(3)').text().split('Por reconhecimento - ')
            const cellText6 = $(row).find('td:nth-child(6)').text()

            const uc = cellText3[0].trim()
            const code = $(row).find('td:nth-child(1)').text()
            const result = parseFloat(cellText6) || parseFloat(cellText3[1]) || cellText6
            const credits = parseFloat($(row).find('td:nth-child(5)').text().replace(',', '.'))
            const acronym = $(row).find('td:nth-child(2)').text()
            grades.push({ uc, year, code, result, credits, acronym, semester })
          }
        } else if (!skip && !done && !attempted) {
          // never attempted courses
        }
      })
  }

  return { major, grades }
}

export default {
  get,
}
