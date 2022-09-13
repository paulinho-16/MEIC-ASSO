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
			if(examsCalendar.seasons.length > 0){
				let requests = examsCalendar.seasons[0].exams.map(({ url }) => axios.get(url, { responseEncoding: 'binary' }))
				axios
					.all(requests)
					.then(
						axios.spread((...responses) => {
							responses.forEach((exam, examId) => {
								const $ = cheerio.load(exam.data.toString('latin1'))
								const day = $('td:contains("Data:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
								const begin = $('td:contains("Hora Início:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
								const duration = $('td:contains("Duração:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
								const rooms = $('td:contains("Salas:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
	
								if (day != "") examsCalendar.seasons[0].exams[examId].day = day.replace(/\s\s+/g, ' ')
								if (begin != "") examsCalendar.seasons[0].exams[examId].begin = begin.replace(/\s\s+/g, ' ')
								if (duration != "") examsCalendar.seasons[0].exams[examId].duration = duration.replace(/\s\s+/g, ' ')
								if (rooms != "") examsCalendar.seasons[0].exams[examId].rooms = rooms.replace(/\s\s+/g, ' ')
							})
						})
						
					).then(() => {
						if(examsCalendar.seasons.length > 1){
							let requests = examsCalendar.seasons[1].exams.map(({ url }) => axios.get(url, { responseEncoding: 'binary' }))
							axios
								.all(requests)
								.then(
									axios.spread((...responses) => {
										responses.forEach((exam, examId) => {
											
											const $ = cheerio.load(exam.data.toString('latin1'))
											const day = $('td:contains("Data:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
											const begin = $('td:contains("Hora Início:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
											const duration = $('td:contains("Duração:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
											const rooms = $('td:contains("Salas:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
				
											if (day != "") examsCalendar.seasons[1].exams[examId].day = day.replace(/\s\s+/g, ' ')
											if (begin != "") examsCalendar.seasons[1].exams[examId].begin = begin.replace(/\s\s+/g, ' ')
											if (duration != "") examsCalendar.seasons[1].exams[examId].duration = duration.replace(/\s\s+/g, ' ')
											if (rooms != "") examsCalendar.seasons[1].exams[examId].rooms = rooms.replace(/\s\s+/g, ' ')
										})
									})
									
								).then(() => {
									if(examsCalendar.seasons.length > 2){
										let requests = examsCalendar.seasons[2].exams.map(({ url }) => axios.get(url, { responseEncoding: 'binary' }))
										axios
											.all(requests)
											.then(
												axios.spread((...responses) => {
													responses.forEach((exam, examId) => {
														
														const $ = cheerio.load(exam.data.toString('latin1'))
														const day = $('td:contains("Data:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
														const begin = $('td:contains("Hora Início:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
														const duration = $('td:contains("Duração:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
														const rooms = $('td:contains("Salas:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
							
														if (day != "") examsCalendar.seasons[2].exams[examId].day = day.replace(/\s\s+/g, ' ')
														if (begin != "") examsCalendar.seasons[2].exams[examId].begin = begin.replace(/\s\s+/g, ' ')
														if (duration != "") examsCalendar.seasons[2].exams[examId].duration = duration.replace(/\s\s+/g, ' ')
														if (rooms != "") examsCalendar.seasons[2].exams[examId].rooms = rooms.replace(/\s\s+/g, ' ')
													})
												})
												
											).then(() => {
												if(examsCalendar.seasons.length > 3){
													let requests = examsCalendar.seasons[3].exams.map(({ url }) => axios.get(url, { responseEncoding: 'binary' }))
													axios
														.all(requests)
														.then(
															axios.spread((...responses) => {
																responses.forEach((exam, examId) => {
																	
																	const $ = cheerio.load(exam.data.toString('latin1'))
																	const day = $('td:contains("Data:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
																	const begin = $('td:contains("Hora Início:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
																	const duration = $('td:contains("Duração:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
																	const rooms = $('td:contains("Salas:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
										
																	if (day != "") examsCalendar.seasons[3].exams[examId].day = day.replace(/\s\s+/g, ' ')
																	if (begin != "") examsCalendar.seasons[3].exams[examId].begin = begin.replace(/\s\s+/g, ' ')
																	if (duration != "") examsCalendar.seasons[3].exams[examId].duration = duration.replace(/\s\s+/g, ' ')
																	if (rooms != "") examsCalendar.seasons[3].exams[examId].rooms = rooms.replace(/\s\s+/g, ' ')
																})
															})
															
														).then(() => {
															res.send(examsCalendar)
														})
												}
												else{
													res.send(examsCalendar)
												}
											})
									}
									else{
										res.send(examsCalendar)
									}
								})
						}
						else{
							res.send(examsCalendar)
						}
					})
			}
			else{
				res.send(examsCalendar)
			}
		})
		.catch(function (e) {
			console.log(e)
		})
}

export default {
    get,
}