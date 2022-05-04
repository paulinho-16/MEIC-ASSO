import * as cheerio from 'cheerio'
import axios from 'axios'
import constants from '@/config/constants'
import {
  CurricularUnit,
  Course
} from '@/@types/curricular-unit'

async function getCurricularUnitInfo() {
  const curricularUnitID = 368723
  const curricularUnitUrl = `${constants.curricularUnitUrl}?pv_ocorrencia_id=${curricularUnitID}`

  const promise = axios.get(curricularUnitUrl, { responseEncoding: 'binary' })
    .then(response => {
      const curricularUnitHTML = response.data

      const $ = cheerio.load(curricularUnitHTML.toString('latin1'))

      const codeTarget = $('td[class=formulario-legenda] + td')[0]
      const acronymTarget = $('td[class=formulario-legenda] + td')[1]
      const nameTarget = $('a[name=ancora-conteudo] + h1')
      const coursesTarget = $('h3').filter(function() {
        return $(this).text() === 'Ciclos de Estudo/Cursos';
      }).next().find('tr').slice(1);

      const code = $(codeTarget).text()
      const acronym = $(acronymTarget).text()
      const name = $(nameTarget).text()
      const courses: Course[] = []
      coursesTarget.each((i, e) => {
        const course: Course = {
          acronym: $($(e).find('td')[0]).text(),
          credits: parseInt($($(e).find('td')[5]).text())
        }

        courses.push(course)
      })

      const curricularUnit: CurricularUnit = {
        code: code,
        acronym: acronym,
        name: name,
        courses: courses
      }

      return curricularUnit
    })

  return promise
}

export default {
  getCurricularUnitInfo,
}
