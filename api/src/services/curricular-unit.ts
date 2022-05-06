import * as cheerio from 'cheerio'
import axios from 'axios'
import constants from '@/config/constants'
import {
  Course,
  Teacher,
  CurricularUnit
} from '@/@types/curricular-unit'

// Retrieve the textual information of a Sigarra field
function getTextualInfo($: cheerio.CheerioAPI, target: cheerio.Cheerio<cheerio.Element>) {
  let text = ''
  do {
    let nextSibling = target.get(0).nextSibling
    while (nextSibling.nodeType === 3) { // loose text blocks
      text += $(nextSibling).text().trim()
      if ($(nextSibling).text().trim()) text += ' '
      nextSibling = nextSibling.nextSibling
    }
    if (target.get(0).tagName != 'br' && target.get(0).tagName != 'h3') { // text inside tags
      text += target.text().trim()
      if (target.text().trim()) text += ' '
    }

    target = target.next()
  } while (target && target.get(0).tagName != 'h3')
  return text.trim()
}

async function getCurricularUnitInfo(curricularUnitID: string) {
  const curricularUnitUrl = `${constants.curricularUnitUrl}?pv_ocorrencia_id=${curricularUnitID}`

  const promise = axios.get(curricularUnitUrl, { responseEncoding: 'binary' })
    .then(response => {
      const curricularUnitHTML = response.data

      const $ = cheerio.load(curricularUnitHTML.toString('latin1'))

      // Get the target elements of each information field
      const codeTarget = $('td[class=formulario-legenda] + td')[0]
      const acronymTarget = $('td[class=formulario-legenda] + td')[1]
      const nameTarget = $('a[name=ancora-conteudo] + h1')
      const coursesTarget = $('h3').filter(function () {
        return $(this).text() === 'Ciclos de Estudo/Cursos';
      }).next().find('tr').slice(1);
      const teachersTarget = $('h3').filter(function () {
        return $(this).text() === 'Docência - Horas';
      }).next().next().find('tr').slice(1);
      const languageTarget = $('h3').filter(function () {
        return $(this).text() === 'Língua de trabalho';
      })[0].nextSibling;
      const objectivesTarget = $('h3').filter(function () {
        return $(this).text() === 'Objetivos';
      })
      const evaluationTarget = $('h3').filter(function () {
        return $(this).text() === 'Tipo de avaliação';
      })

      // Get the basic information (code, acronym and name)
      const code = $(codeTarget).text()
      const acronym = $(acronymTarget).text()
      const name = $(nameTarget).text()

      // Get the courses to which the curricular unit belongs
      const courses: Course[] = []
      coursesTarget.each((i, e) => {
        const course: Course = {
          acronym: $($(e).find('td')[0]).text(),
          year: parseInt($($(e).find('td')[3]).text()),
          credits: parseInt($($(e).find('td')[5]).text()),
          hours: parseInt($($(e).find('td')[7]).text())
        }

        courses.push(course)
      })

      // Get the teachers (both theoretical and theoretical-practical classes)
      const teachers: Teacher[] = []
      teachersTarget.each((i, e) => {
        const name = $($(e).find('td').first()).text()
        if (name === 'Teóricas' || name === 'Teórico-Práticas')
          return;

        const repeated = teachers.some(el => el.name === name);
        if (repeated) return;

        const teacher: Teacher = {
          name: name
        }

        teachers.push(teacher)
      })

      // Get the teaching language, objectives and evaluation type
      const language = $(languageTarget).text().trim()
      let objectives = getTextualInfo($, objectivesTarget)
      let evaluation = getTextualInfo($, evaluationTarget)

      // Group the information of the curricular unit
      const curricularUnit: CurricularUnit = {
        code: code,
        acronym: acronym,
        name: name,
        courses: courses,
        teachers: Array.from(new Set(teachers)),
        language: language,
        objectives: objectives,
        evaluation: evaluation
      }

      return curricularUnit
    })

  return promise
}

export default {
  getCurricularUnitInfo,
}
