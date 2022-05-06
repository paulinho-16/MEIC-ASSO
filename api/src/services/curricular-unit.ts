import * as cheerio from 'cheerio'
import axios from 'axios'
import constants from '@/config/constants'
import {
  Course,
  Teacher,
  AssessmentComponent,
  CourseUnitTime,
  CurricularUnit
} from '@/@types/curricular-unit'

// Retrieve the textual information of a Sigarra field
function getTextualInfo($: cheerio.CheerioAPI, target: cheerio.Cheerio<cheerio.Element>) {
  let text = ''
  do {
    if (target.get(0) && target.get(0).tagName === 'br') text += '\n'
    else if (target.get(0).tagName != 'h3') { // text inside tags
      text += target.text().trim()
      if (target.text().trim()) text += ' '
    }

    let nextSibling = target.get(0).nextSibling
    while (nextSibling && nextSibling.nodeType === 3) { // loose text blocks
      text += $(nextSibling).text().trim()
      if ($(nextSibling).text().trim()) text += ' '
      nextSibling = nextSibling.nextSibling
    }

    target = target.next()
  } while (target.get(0) && target.get(0).tagName != 'h3')
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
      const programTarget = $('h3').filter(function () {
        return $(this).text() === 'Programa';
      })
      const mandatoryLiteratureTarget = $('h3').filter(function () {
        return $(this).text() === 'Bibliografia Obrigatória';
      })
      const evaluationTarget = $('h3').filter(function () {
        return $(this).text() === 'Tipo de avaliação';
      })
      const assessmentComponentsTarget = $('h3').filter(function () {
        return $(this).text() === 'Componentes de Avaliação';
      }).next().find('tr').slice(1);
      const courseUnitsTimesTarget = $('h3').filter(function () {
        return $(this).text() === 'Componentes de Ocupação';
      }).next().find('tr').slice(1);
      const examEligibilityTarget = $('h3').filter(function () {
        return $(this).text() === 'Obtenção de frequência';
      })
      const calculationFormulaTarget = $('h3').filter(function () {
        return $(this).text() === 'Fórmula de cálculo da classificação final';
      })
      const specialAssessmentTarget = $('h3').filter(function () {
        return $(this).text() === 'Avaliação especial (TE, DA, ...)';
      })
      const classificationImprovementTarget = $('h3').filter(function () {
        return $(this).text() === 'Melhoria de classificação';
      })
      const teachingMethodsAndActivitiesTarget = $('h3').filter(function () {
        return $(this).text() === 'Métodos de ensino e atividades de aprendizagem';
      })
      const outcomesAndCompetencesTarget = $('h3').filter(function () {
        return $(this).text() === 'Resultados de aprendizagem e competências';
      })
      const workingMethodTarget = $('h3').filter(function () {
        return $(this).text() === 'Modo de trabalho';
      })
      const requirementsTarget = $('h3').filter(function () {
        return $(this).text() === 'Pré-requisitos (conhecimentos prévios) e co-requisitos (conhecimentos simultâneos)';
      })
      const complementaryBibliographyTarget = $('h3').filter(function () {
        return $(this).text() === 'Bibliografia Complementar';
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

      // Get the teaching language, objectives, program, mandatory literature, teaching method and learning activities, evaluation type
      const language = $(languageTarget).text().trim()
      let objectives = getTextualInfo($, objectivesTarget)
      let program = getTextualInfo($, programTarget)
      let mandatoryLiterature = getTextualInfo($, mandatoryLiteratureTarget)
      let teachingMethodsAndActivities = getTextualInfo($, teachingMethodsAndActivitiesTarget)
      let evaluation = getTextualInfo($, evaluationTarget)

      // Get the assessment components
      const assessmentComponents: AssessmentComponent[] = []
      assessmentComponentsTarget.each((i, e) => {
        const component: AssessmentComponent = {
          designation: $($(e).find('td')[0]).text(),
          weight: parseInt($($(e).find('td')[1]).text())
        }

        assessmentComponents.push(component)
      })

      // Get the amount of time allocated to each course unit
      const courseUnitsTimes: CourseUnitTime[] = []
      courseUnitsTimesTarget.each((i, e) => {
        const unit: CourseUnitTime = {
          designation: $($(e).find('td')[0]).text(),
          hours: parseInt($($(e).find('td')[1]).text())
        }

        courseUnitsTimes.push(unit)
      })

      // Get the eligibility for exams, calculation formula of final grade, special assessment (TE, DA, ...) and classification improvement
      let examEligibility = getTextualInfo($, examEligibilityTarget)
      let calculationFormula = getTextualInfo($, calculationFormulaTarget)
      let specialAssessment = getTextualInfo($, specialAssessmentTarget)
      let classificationImprovement = getTextualInfo($, classificationImprovementTarget)

      // Group the information of the curricular unit
      const curricularUnit: CurricularUnit = {
        code: code,
        acronym: acronym,
        name: name,
        courses: courses,
        teachers: Array.from(new Set(teachers)),
        language: language,
        objectives: objectives,
        program: program,
        mandatoryLiterature: mandatoryLiterature,
        teachingMethodsAndActivities: teachingMethodsAndActivities,
        evaluation: evaluation,
        assessmentComponents: assessmentComponents,
        courseUnitsTimes: courseUnitsTimes,
        examEligibility: examEligibility,
        calculationFormula: calculationFormula,
        specialAssessment: specialAssessment,
        classificationImprovement: classificationImprovement
      }

      // Get the optional fields information
      if (outcomesAndCompetencesTarget.length != 0) {
        let outcomesAndCompetences = getTextualInfo($, outcomesAndCompetencesTarget)
        curricularUnit.outcomesAndCompetences = outcomesAndCompetences
      }
      if (workingMethodTarget.length != 0) {
        let workingMethod = getTextualInfo($, workingMethodTarget)
        curricularUnit.workingMethod = workingMethod
      }
      if (requirementsTarget.length != 0) {
        let requirements = getTextualInfo($, requirementsTarget)
        curricularUnit.requirements = requirements
      }
      if (complementaryBibliographyTarget.length != 0) {
        let complementaryBibliography = getTextualInfo($, complementaryBibliographyTarget)
        curricularUnit.complementaryBibliography = complementaryBibliography
      }

      return curricularUnit
    })

  return promise
}

export default {
  getCurricularUnitInfo,
}
