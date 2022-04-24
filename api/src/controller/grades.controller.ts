import axios from 'axios'
import * as cheerio from 'cheerio'
import { Request, Response } from 'express'
import { studentPageHTML, academicPathPageHTML, planPositionPageHTML2 } from '../config/data'
import { Grade, MajorGrades } from '../@types/grades'

type InspectMajor = {
  url: string
  name: string
}

const MAIN_URL = 'https://sigarra.up.pt/feup'
const STUDENT_NUMBER = 201704790
// const STUDENT_PAGE_URL = `https://sigarra.up.pt/feup/pt/fest_geral.cursos_list?pv_num_unico=${STUDENT_NUMBER}`

async function get(req: Request, res: Response) {
  const api = axios.create({})

  api
    .get('https://google.com', { responseEncoding: 'binary' })
    .then(() => {
      const inspectMajors = cheerioGetInspectMajors()
      if (inspectMajors === null) res.send(`No majors found for student ${STUDENT_NUMBER}`)

      const planPositionURL = cheerioGetPlanPositionURL()
      if (!planPositionURL) res.send(`No plan position found for student ${STUDENT_NUMBER}`)

      const majorGrades = cheerioScrapeGrades(inspectMajors[0].name)
      res.send({ 'Student Grades': majorGrades })
    })
    .catch(function (e) {
      console.log(e)
    })
}

/**
 * @brief collect all courses a student has had (name and url) from student page
 */
function cheerioGetInspectMajors(): InspectMajor[] {
  const inspectMajors: InspectMajor[] = []
  const $ = cheerio.load(studentPageHTML.toString())

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
function cheerioGetPlanPositionURL(): string {
  const $ = cheerio.load(academicPathPageHTML.toString())
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
function cheerioScrapeGrades(major: string): MajorGrades {
  const grades: Grade[] = []
  const $ = cheerio.load(planPositionPageHTML2.toString())
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
                const cellText3 = $(element).find('td:nth-child(3)').text().split('Por reconhecimento - ')
                const uc = cellText3[0].trim()
                const code = $(element).find('td:nth-child(1)').text()
                const result =
                  parseFloat($(element).find('td:nth-child(7)').text()) || parseFloat(cellText3[1].replace(',', '.'))
                const credits = parseFloat($(element).find('td:nth-child(6)').text().replace(',', '.'))
                const acronym = $(element).find('td:nth-child(2)').text()
                grades.push({ uc, year, code, result, credits, acronym, semester })
              }
            })
          } else {
            const cellText3 = $(row).find('td:nth-child(3)').text().split('Por reconhecimento - ')
            const uc = cellText3[0].trim()
            const code = $(row).find('td:nth-child(1)').text()
            const result =
              parseFloat($(row).find('td:nth-child(6)').text()) || parseFloat(cellText3[1].replace(',', '.'))
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
              const localDone = $(element).attr('class') ? $(element).attr('class').includes('feito') : false
              const localAttempted = $(element).attr('class') ? $(element).attr('class').includes('fazer') : false

              if (!$(element).text().includes('Código') && (localDone || localAttempted)) {
                // Option group
                const cellText3 = $(element).find('td:nth-child(3)').text().split('Por reconhecimento - ')
                const uc = cellText3[0].trim()
                const code = $(element).find('td:nth-child(1)').text()
                const result =
                  parseFloat($(element).find('td:nth-child(7)').text()) || parseFloat(cellText3[1].replace(',', '.'))
                const credits = parseFloat($(element).find('td:nth-child(6)').text().replace(',', '.'))
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
