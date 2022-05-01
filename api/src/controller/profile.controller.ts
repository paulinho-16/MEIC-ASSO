import axios from 'axios'
import * as cheerio from 'cheerio'
import { Request, Response } from 'express'
import { profilePageHTML } from '../config/data'

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

            const studentHTML = mock ? profilePageHTML : response.data
            const $ = cheerio.load(studentHTML.toString())
            const name = $('#conteudoinner > div:nth-child(8) > div:nth-child(1) > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(2)').text().trim()
            const sex = $('#conteudoinner > div:nth-child(8) > div:nth-child(1) > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(2)').text().trim()
            const birthday = $('#conteudoinner > div:nth-child(8) > div:nth-child(1) > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(2)').text().trim()
            const nationality = $('#conteudoinner > div:nth-child(8) > div:nth-child(1) > table:nth-child(4) > tbody > tr > td:nth-child(2)').text().trim()
            const number = $('#conteudoinner > div:nth-child(8) > div:nth-child(1) > table:nth-child(12) > tbody > tr:nth-child(1) > td:nth-child(3)').text().trim()
            const email = $('#conteudoinner > div:nth-child(8) > div:nth-child(1) > table:nth-child(12) > tbody > tr:nth-child(2) > td:nth-child(3)').text().trim()

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