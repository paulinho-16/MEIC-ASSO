import * as cheerio from 'cheerio'
import axios from 'axios'
import constants from '@/config/constants'
import { classesHTML } from '../config/mockHtml/classes'
import {
  Course,
  Teacher,
  AssessmentComponent,
  CourseUnitTime,
  Student,
  Class,
  CurricularUnit
} from '@/@types/curricular-unit'

// Retrieve the heading tag <h3> with a given title
function getHeading($: cheerio.CheerioAPI, title: string) {
  return $('h3').filter(function () {
    return $(this).text() === title;
  })
}

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
  const classesUrl = `${constants.classesUrl}?pv_curso_id=742&pv_ocorrencia_id=272558&pv_ano_lectivo=2011&pv_periodo_id=1&pv_no_menu=1` // TODO: Dynamic Url after the authentication is resolved

  const curricularUnit: CurricularUnit = <CurricularUnit>{}

  const promise = axios.get(curricularUnitUrl, { responseEncoding: 'binary' })
    .then(response => {
      const curricularUnitHTML = response.data

      const $ = cheerio.load(curricularUnitHTML.toString('latin1'))

      // Get the target elements of each information field
      const codeTarget = $('td[class=formulario-legenda] + td')[0]
      const acronymTarget = $('td[class=formulario-legenda] + td')[1]
      const nameTarget = $('a[name=ancora-conteudo] + h1')
      const coursesTarget = getHeading($, 'Ciclos de Estudo/Cursos').next().find('tr').slice(1);
      const teachersTarget = getHeading($, 'Docência - Horas').next().next().find('tr').slice(1);
      const languageTarget = getHeading($, 'Língua de trabalho')[0].nextSibling;
      const objectivesTarget = getHeading($, 'Objetivos')
      const programTarget = getHeading($, 'Programa')
      const mandatoryLiteratureTarget = getHeading($, 'Bibliografia Obrigatória')
      const evaluationTarget = getHeading($, 'Tipo de avaliação')
      const assessmentComponentsTarget = getHeading($, 'Componentes de Avaliação').next().find('tr').slice(1);
      const courseUnitsTimesTarget = getHeading($, 'Componentes de Ocupação').next().find('tr').slice(1);
      const examEligibilityTarget = getHeading($, 'Obtenção de frequência')
      const calculationFormulaTarget = getHeading($, 'Fórmula de cálculo da classificação final')
      const specialAssessmentTarget = getHeading($, 'Avaliação especial (TE, DA, ...)')
      const classificationImprovementTarget = getHeading($, 'Melhoria de classificação')
      const teachingMethodsAndActivitiesTarget = getHeading($, 'Métodos de ensino e atividades de aprendizagem')
      const outcomesAndCompetencesTarget = getHeading($, 'Resultados de aprendizagem e competências')
      const workingMethodTarget = getHeading($, 'Modo de trabalho')
      const requirementsTarget = getHeading($, 'Pré-requisitos (conhecimentos prévios) e co-requisitos (conhecimentos simultâneos)')
      const complementaryBibliographyTarget = getHeading($, 'Bibliografia Complementar')

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

      // Set the information of the curricular unit
      curricularUnit.code = code
      curricularUnit.acronym = acronym
      curricularUnit.name = name
      curricularUnit.courses = courses
      curricularUnit.teachers = teachers
      curricularUnit.assessmentComponents = assessmentComponents
      curricularUnit.courseUnitsTimes = courseUnitsTimes

      // Get the optional fields information
      if (languageTarget) curricularUnit.language = $(languageTarget).text().trim()
      if (objectivesTarget.length != 0) curricularUnit.objectives = getTextualInfo($, objectivesTarget)
      if (programTarget.length != 0) curricularUnit.program = getTextualInfo($, programTarget)
      if (mandatoryLiteratureTarget.length != 0) curricularUnit.mandatoryLiterature = getTextualInfo($, mandatoryLiteratureTarget)
      if (teachingMethodsAndActivitiesTarget.length != 0) curricularUnit.teachingMethodsAndActivities = getTextualInfo($, teachingMethodsAndActivitiesTarget)
      if (evaluationTarget.length != 0) curricularUnit.evaluation = getTextualInfo($, evaluationTarget)
      if (outcomesAndCompetencesTarget.length != 0) curricularUnit.outcomesAndCompetences = getTextualInfo($, outcomesAndCompetencesTarget)
      if (workingMethodTarget.length != 0) curricularUnit.workingMethod = getTextualInfo($, workingMethodTarget)
      if (requirementsTarget.length != 0) curricularUnit.requirements = getTextualInfo($, requirementsTarget)
      if (complementaryBibliographyTarget.length != 0) curricularUnit.complementaryBibliography = getTextualInfo($, complementaryBibliographyTarget)
      if (examEligibilityTarget.length != 0) curricularUnit.examEligibility = getTextualInfo($, examEligibilityTarget)
      if (calculationFormulaTarget.length != 0) curricularUnit.calculationFormula = getTextualInfo($, calculationFormulaTarget)
      if (specialAssessmentTarget.length != 0) curricularUnit.specialAssessment = getTextualInfo($, specialAssessmentTarget)
      if (classificationImprovementTarget.length != 0) curricularUnit.classificationImprovement = getTextualInfo($, classificationImprovementTarget)

      return curricularUnit
    })
    .then(() => {
      // TODO: Change to a request after the authentication is resolved, for now use a static HTML page
      /*axios.get(classesUrl, { responseEncoding: 'binary' })
      .then(response => {
        const classesHTML = response.data

        const $ = cheerio.load(classesHTML.toString('latin1'))
      })*/

      const $ = cheerio.load(classesHTML)

      const classesTarget = $('h3').slice(1)
      const studentsTarget = $('h3 + table').slice(1)

      const classes: Class[] = []

      // Get the information about the classes of the given curricular unit
      classesTarget.each((i, e) => {
        const students: Student[] = []
        const classStudents = $(studentsTarget[i]).find('tr').slice(1);

        // Get the information about the students of each class
        classStudents.each((i, e) => {
          const student: Student = {
            name: $($(e).find('td')[0]).text(),
            number: $($(e).find('td')[1]).text(),
            email: $($(e).find('td')[2]).text(),
            allocationDate: $($(e).find('td')[3]).text().trim(),
            enrolled: ($($(e).find('td')[4]).children().first().attr('alt') === 'Verificar') ? true : false
          }

          students.push(student)
        })

        // Set the information of each class
        const classObj: Class = {
          name: $(e).text().trim().split(' ')[1],
          students: students
        }

        classes.push(classObj)
      })

      curricularUnit.classes = classes

      return curricularUnit
    })

  return promise
}

export default {
  getCurricularUnitInfo,
}
