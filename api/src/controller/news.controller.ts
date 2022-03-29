import { Request, Response } from 'express'
import cheerio from 'cheerio'
import axios from 'axios'

type News = {
  url?: string
  title?: string
  smallDescription?: string
  description?: string
}

async function get(req: Request, res: Response) {
  const news: News[] = []

  axios
    .get('https://sigarra.up.pt/feup/pt/noticias_geral.lista_noticias')
    .then(response => {
      const $ = cheerio.load(response.data)
      const targetUl = $('a[name=gruponot6] ~ ul')[0]
      $(targetUl)
        .find('li')
        .each((i, e) => {
          const url = $(e).find('span.titulo a').attr('href')
          const title = $(e).find('span.titulo a').text()
          const smallDescription = $(e).find('p.textopequenonoticia').text()

          news.push({
            url: url,
            title: title,
            smallDescription: smallDescription,
            description: 'TBD',
          })
        })

      res.send(news)
    })
    .catch(function (e) {
      console.log(e)
    })
}

export default {
  get,
}
