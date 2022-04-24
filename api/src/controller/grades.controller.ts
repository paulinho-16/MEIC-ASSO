import axios from 'axios'
import * as cheerio from 'cheerio'
import { Request, Response } from 'express'
import { studentPageHTML, academicPathPageHTML, planPositionPageHTML2 } from '../config/data'
import { InspectMajor, Grade, MajorGrades } from '../@types/grades'
import studentPageBaseUrl from '../config/constants'

const MAIN_URL = 'https://sigarra.up.pt/feup'

async function get(req: Request, res: Response) {
  const mock = true
  const api = axios.create({ responseEncoding: 'binary' })
  const studentNumber = req.params.studentNumber
  const studentPageUrl = mock ? 'https://google.com' : `${studentPageBaseUrl}=${studentNumber}`

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
        const academicPathHTML = academicPathPageHTML // TODO: get academicPathHTML using major.url
        console.log('Major: ', major.name)
        console.log('Major URL: ', major.url)

        const planPositionURL = cheerioGetPlanPositionURL(academicPathHTML)
        console.log('Plan Position URL: ', planPositionURL, '\n')

        const planPositionHTML = planPositionPageHTML2 // TODO: get planPositionHTML using planPositionURL
        const majorGrades = cheerioScrapeGrades(major.name, planPositionHTML)
        studentGrades.push(majorGrades)
      }
    })
    .then(() => {
      res.send({ 'Student Grades': studentGrades })
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

    if (href)
      inspectMajors.push({
        url: href ? `${MAIN_URL}/${href}` : null,
        name: clickableMajor || unclickableMajor,
      })
  }

  // collect previous majors
  const historyMajorNames = $('table.dadossz > tbody tr td:first-child')
  const historyMajorHrefs = $('table.dadossz > tbody tr td:last-child a')

  for (let i = 0; i < historyMajorHrefs.length; i++) {
    const name = $(historyMajorNames[i]).text()
    const href = $(historyMajorHrefs[i]).attr('href')

    if (href)
      inspectMajors.push({
        url: href ? `${MAIN_URL}/${href}` : null,
        name: name,
      })
  }

  if (inspectMajors.length === 0) return null
  else return inspectMajors
}

/**
 * @brief get url to student's plan position in a major
 */
function cheerioGetPlanPositionURL(academicPathHTML: string): string {
  const $ = cheerio.load(academicPathHTML.toString())
  const target = $('.estudantes-curso-lista-opcoes')
  let href

  $(target)
    .find('li.estudantes-curso-opcao a')
    .each(function (index, element) {
      if ($(element).text() === 'Posição no plano') {
        href = $(element).attr('href')
        return
      }
    })

  return `${MAIN_URL}/${href}`
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
