import * as cheerio from 'cheerio'
import axios from 'axios'
import constants from '@/config/constants'
import {
	Exam,
	ExamsCalendar
} from '@/@types/exams-calendar'

async function getExamsCalendar(courseID: string) {
    const examsCalendarUrl = `${constants.examsCalendarUrl}?p_curso_id=${courseID}`
	console.log(examsCalendarUrl)
	const promise = axios.get(examsCalendarUrl, { responseEncoding: 'binary'})
		.then(response => {
			const examsCalendarHTML = response.data
			const $ = cheerio.load(examsCalendarHTML.toString('latin1'))

			// Get Targets
			const courseTarget = $('a[name=ancora-conteudo] + h1 + h2')
			const examsTarget = $('td[class=exame]') // not working

			// Get Name
			const course = $(courseTarget).text()

			// Get Exams
			const exams: Exam[] = []
			examsTarget.each((i, e) => {
				const exam: Exam = {
					subject: $($(e).find('a')[0]).text(),

				}
				exams.push(exam)
			})

			// Get Exams Calendar
			const examsCalendar: ExamsCalendar = {
				course: course,
				exams: exams
			}
			
			return examsCalendar
		})

	return promise
}

export default {
    getExamsCalendar,
}
