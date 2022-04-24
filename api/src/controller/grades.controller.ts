import axios from 'axios'
import * as cheerio from 'cheerio'
import { Request, Response } from 'express'
import { studentPageHTML, academicPathPageHTML, planPositionPageHTML } from '../config/data'
import { Grade, Grades } from '../@types/grades'

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
      const scrapeGradesResults = cheerioScrapeGrades()
      res.send({ ola: planPositionURL })
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
function cheerioScrapeGrades(): Grades {
  const majorName = 'Mestrado em Engenharia Informática e Computação'

  const $ = cheerio.load(planPositionPageHTML.toString())
  const years = $('#conteudoinner > div.caixa > div.caixa > div.caixa > table.dadossz')

  for (const year of years) {
    console.log($(year).find('table.dadossz > tbody tbody > tr').length)
  }

  return {
    major: majorName,
    grades: null,
  }
}

export default {
  get,
}
