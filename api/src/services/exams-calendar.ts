import * as cheerio from 'cheerio'
import axios from 'axios'
import constants from '@/config/constants'
import {
	Exam,
	ExamsCalendar, 
	Season
} from '@/@types/exams-calendar'

function getTime($: cheerio.CheerioAPI, target: cheerio.Cheerio<cheerio.Element>) {
	let text = ''
	
	
	return text
  }

  
function getExamsFromSeason($: cheerio.CheerioAPI, target: cheerio.Cheerio<cheerio.Element>){
	const exams: Exam[] = []
	const examsTarget = target.find('td.exame')
	examsTarget.each((i, e) => {		
		const exam: Exam = {			
			acronym: $($(e).find('a')[0]).text(),
			day: "",
			time: "",
			rooms: $($(e).find('span.exame-sala')[0]).text(),
		}
		exams.push(exam)
	}) 
	return exams
}
async function getExamsCalendar(courseID: string) {
    const examsCalendarUrl = `${constants.examsCalendarUrl}?p_curso_id=${courseID}`
	console.log(examsCalendarUrl)
	const promise = axios.get(examsCalendarUrl, { responseEncoding: 'binary'})
		.then(response => {
			const examsCalendarHTML = response.data
			const $ = cheerio.load(examsCalendarHTML.toString('latin1'))

			// Get Targets
			const courseTarget = $('a[name=ancora-conteudo] + h1 + h2')
			const seasonsTarget = $('h3')

			// Get Name
			const course = $(courseTarget).text()

			// Get Season
			const seasons: Season[] = []
			seasonsTarget.each((i, e) => {
				const season: Season = {
					name: $($(e)).text(),
					exams: getExamsFromSeason($, $(e).next().find('table').slice(1))
				}
				seasons.push(season)
			})
			
			// Get Exams Calendar
			const examsCalendar: ExamsCalendar = {
				course: course,
				seasons: seasons,
			}

			
			return examsCalendar
		})

	return promise
}

export default {
    getExamsCalendar,
}
