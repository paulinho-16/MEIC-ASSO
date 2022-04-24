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
const STUDENT_PAGE_URL = `https://sigarra.up.pt/feup/pt/fest_geral.cursos_list?pv_num_unico=${STUDENT_NUMBER}`

async function get(req: Request, res: Response) {
  const api = axios.create({})
  const results: Grades[] = []

  api
    .get('https://google.com', { responseEncoding: 'binary' })
    .then(() => {
      const inspectMajors = cheerioGetInspectMajors()
      if (inspectMajors === null) res.send(`No majors found for student ${STUDENT_NUMBER}`)

      const planPositionURL = cheerioGetPlanPositionURL()
      res.send({ planPositionURL })
    })
    .catch(function (e) {
      console.log(e)
    })
}

function cheerioGetInspectMajors(): InspectMajor[] {
  const inspectMajors: InspectMajor[] = []
  const $ = cheerio.load(studentPageHTML.toString())
  const majorDivs = $('div .estudante-lista-curso-activo')

  for (const majorDiv of majorDivs) {
    const href = $(majorDiv).find('.estudante-lista-curso-detalhes a').attr('href')
    const clickableMajor = $(majorDiv).find('.estudante-lista-curso-nome a').text()
    const unclickableMajor = $(majorDiv).find('.estudante-lista-curso-nome').text()

    inspectMajors.push({
      url: href ? `${MAIN_URL}/${href}` : null,
      name: clickableMajor || unclickableMajor,
    })
  }

  if (inspectMajors.length === 0) return null
  else return inspectMajors
}

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

function cheerioScrapeGrades(): Grades {
  const $ = cheerio.load(planPositionPageHTML.toString())
  const target = $('.estudantes-curso-lista-opcoes')

  return null
}

export default {
  get,
}
