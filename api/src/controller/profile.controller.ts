import axios from 'axios'
import * as cheerio from 'cheerio'
import { Request, Response } from 'express'
//import { profilePageHTML } from '../config/data'

async function get(req: Request, res: Response) {
    const mock = true
    const api = axios.create({ responseEncoding: 'binary' })
    const studentNumber = req.params.studentNumber
    const studentPageUrl = mock
        ? 'https://sigarra.up.pt/feup/pt'
        : `https://sigarra.up.pt/feup/pt/fest_geral.info_pessoal_completa_view?pv_num_unico=${studentNumber}`

    api
        .get(studentPageUrl)
        .then(response => {

            const studentHTML = response.data //mock ? profilePageHTML : response.data
            const $ = cheerio.load(studentHTML.toString())
            const target = $('#conteudoinner > div:nth-child(8) > div:nth-child(1)')
            const targetBody = $(target).find('tbody')

            const tableRowNumber = [1, 4, 12]
            const tableRowPositions = [[1,2], [2,2], [3,2], [0,2], [1,3], [2,3]]

            // First table
            const name = targetBody.first().find('tr:nth-child(' + tableRowPositions[0][0] + ') > td:nth-child(' + tableRowPositions[0][1] + ')').text().trim()
            const sex = targetBody.first().find('tr:nth-child(' + tableRowPositions[1][0] + ') > td:nth-child(' + tableRowPositions[1][1] + ')').text().trim()
            const birthday = targetBody.first().find('tr:nth-child(' + tableRowPositions[2][0] + ') > td:nth-child(' + tableRowPositions[2][1] + ')').text().trim()

            // Second table
            const nationality = $('#conteudoinner > div:nth-child(8) > div:nth-child(1) > table:nth-child(' + tableRowNumber[1] + ') > tbody > tr > td:nth-child(' + tableRowPositions[3][1] + ')').text().trim()

            // Third table
            const number = $('#conteudoinner > div:nth-child(8) > div:nth-child(1) > table:nth-child(' + tableRowNumber[2] + ') > tbody > tr:nth-child(' + tableRowPositions[4][0] + ') > td:nth-child(' + tableRowPositions[4][1] + ')').text().trim()
            const email = $('#conteudoinner > div:nth-child(8) > div:nth-child(1) > table:nth-child('+ tableRowNumber[2] + ') > tbody > tr:nth-child(' + tableRowPositions[5][0] + ') > td:nth-child(' + tableRowPositions[5][1] + ')').text().trim()

            const profile = { name, studentNumber, sex, birthday, nationality, number, email }

            res.send(profile)

        })
        .catch(function (e) {
            console.log(e)
        })
}

export default {
    get,
}