import { Request, Response } from 'express'
import cheerio from 'cheerio'
import axios from 'axios'
import iconv from 'iconv-lite'

type Job = {
  url?: string
  title?: string
  description?: string
}

async function get(req: Request, res: Response) {
  const jobs: Job[] = []

  axios
    .request({
      method: 'GET',
      url: 'https://sigarra.up.pt/feup/pt/noticias_geral.lista_noticias?p_grupo_noticias=19',
      responseType: 'arraybuffer',
      responseEncoding: 'binary',
    })
    .then(response => {
      const html = iconv.decode(response.data, 'iso-8859-15')
      const $ = cheerio.load(html)
      const targetUl = $('#conteudoinner ul')
      $(targetUl)
        .find('li')
        .each((i, e) => {
          const url = $(e).find('span.titulo a').attr('href')
          const title = $(e).find('span.titulo a').text()
          const description = $(e).find('p.textopequenonoticia').text().split(' [ Ler toda a')[0]

          jobs.push({
            url: url,
            title: title,
            description: description,
          })
        })

      res.send(jobs)
    })
    .catch(function (e) {
      console.log(e)
    })
}

export default {
  get,
}