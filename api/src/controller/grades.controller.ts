import axios from 'axios'
import * as cheerio from 'cheerio'
import { Request, Response } from 'express'
import { gradesManyHTML } from '../config/data'
// import { Grade, Grades } from '../@types/grades'

type InspectMajor = {
  link: string
  name: string
}

const STUDENT_NUMBER = 201704790
const MAIN_URL = 'https://sigarra.up.pt/feup'
// const STUDENT_PAGE_URL = `https://sigarra.up.pt/feup/pt/fest_geral.cursos_list?pv_num_unico=${STUDENT_NUMBER}`

async function get(req: Request, res: Response) {
  const inspectMajors: InspectMajor[] = []
  // const results: Grades[] = []

  axios
    .get('https://google.com', { responseEncoding: 'binary' })
    .then(() => {
      const $ = cheerio.load(gradesManyHTML.toString())
      const majorDivs = $('div .estudante-lista-curso-activo')

      for (const majorDiv of majorDivs) {
        const link = $(majorDiv).find('.estudante-lista-curso-detalhes a').attr('href')
        const clickableMajor = $(majorDiv).find('.estudante-lista-curso-nome a').text()
        const unclickableMajor = $(majorDiv).find('.estudante-lista-curso-nome').text()

        inspectMajors.push({
          link: link ? `${MAIN_URL}/${link}` : null,
          name: clickableMajor || unclickableMajor,
        })
      }

      inspectMajors.length === 0
        ? res.send(`No majors found for student ${STUDENT_NUMBER}`)
        : res.send({ majors: inspectMajors })
    })
    .then(() => {
      console.log('resposta')
    })
    .catch(function (e) {
      console.log(e)
    })
}

export default {
  get,
}
