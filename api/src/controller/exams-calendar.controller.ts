import { Request, Response } from 'express'
import * as cheerio from 'cheerio'
import axios from 'axios'
import constants from '@/config/constants'
import {
	Exam,
	ExamsCalendar,
	Season
} from '@/@types/exams-calendar'

function getExamsFromSeason($: cheerio.CheerioAPI, target: cheerio.Cheerio<cheerio.Element>) {
	const exams: Exam[] = []
	const examsTarget = target.find('td.exame')
	examsTarget.each((i, e) => {
		const exam: Exam = {
			acronym: $($(e).find('a')[0]).text(),
			url: constants.mainUrl + "/" + $($(e)).find('a').attr('href')
		}
		exams.push(exam)
	})
	return exams
}

async function get(req: Request, res: Response) {
	const courseID = req.params.id
	let examsCalendar : ExamsCalendar
	const examsCalendarUrl = `${constants.examsCalendarUrl}?p_curso_id=${courseID}`
	axios
		.get(examsCalendarUrl, {responseEncoding: 'binary'})
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
			examsCalendar = ({
				course: course,
				seasons: seasons,
			})

		}).then(() => {
			examsCalendar.seasons.forEach(function(season, seasonId){
				let requests = season.exams.map(({ url }) => axios.get(url, { responseEncoding: 'binary' }))
				axios
					.all(requests)
					.then(
						axios.spread((...responses) => {
							responses.forEach((exam, examId) => {
								const $ = cheerio.load(exam.data.toString('latin1'))
								const day = $('td:contains("Data:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();

								if (day != "") examsCalendar.seasons[seasonId].exams[examId].day = day.replace(/\s\s+/g, ' ')
							})
						})
						
					)
			})
			res.send(examsCalendar)
			
		})
		.catch(function (e) {
			console.log(e)
		})
}

export default {
    get,
}