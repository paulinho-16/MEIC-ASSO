import { Request, Response } from 'express'
import cheerio from 'cheerio'
import axios from 'axios'
import iconv from 'iconv-lite'

type Job = {
  url?: string
  title?: string
  descriptionEN?: string
  descriptionPT?: string
  noticeEN?: string
  noticePT?: string
  startDate?: string
  endDate?: string
}

const rootURL = 'https://sigarra.up.pt/feup/pt/'

async function getHTML(url: string) {
  try {
    const response = await axios.request({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      responseEncoding: 'binary',
    })
    return iconv.decode(response.data, 'iso-8859-15')
  } catch (e) {
    return null
  }
}

async function scrapeIndividualJob(url: string) {
  const html = await getHTML(url)
  const $ = cheerio.load(html)

  const res: Array<string> = []
  const targetUl = $('#conteudoinner')

  const dates = $(targetUl).find('h2').text().split(' ')

  $(targetUl)
    .find('p')
    .each((_, e) => {
      const url = rootURL + $(e).find('a').attr('href')
      const description = $(e).text()

      res.push(description, url)
    })

  res.push(dates[2], dates[4])

  return res
}

async function get(_req: Request, res: Response) {
  const jobs: Job[] = []
  const rootURL = 'https://sigarra.up.pt/feup/pt/'

  const html = await getHTML(`${rootURL}noticias_geral.lista_noticias?p_grupo_noticias=19`)

  if (!html) {
    res.status(500).send({ message: 'Cannot fetch SIGARRA jobs page!' })
    return
  }

  const $ = cheerio.load(html)
  const targetUl = $('#conteudoinner ul')
  $(targetUl)
    .find('li')
    .each((_idx, e) => {
      const url = rootURL + $(e).find('span.titulo a').attr('href')
      const title = $(e).find('span.titulo a').text()

      jobs.push({
        url: url,
        title: title,
      })
    })

  const promises = jobs.map(job => scrapeIndividualJob(job.url!!))

  const results = await Promise.all(promises)

  for (const i in results) {
    const job = jobs[i]
    const result = results[i]

    job.descriptionEN = result[0]
    job.noticeEN = result[1]
    job.descriptionPT = result[2]
    job.noticePT = result[3]
    job.startDate = result[4]
    job.endDate = result[5]
  }

  res.status(200).send(jobs)
}

export default {
  get,
}
