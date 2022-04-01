import { Request, Response } from 'express'
import cheerio from 'cheerio'
import axios from 'axios'

type News = {
  url: string
  title: string
  excerpt: string
  header?: string
  details?: string
  content?: string
}

const NEWS_URL = 'https://sigarra.up.pt/feup/pt/noticias_geral.lista_noticias'
const MAIN_URL = 'https://sigarra.up.pt/feup/pt'
const FALLBACK_URL = 'https://sigarra.up.pt/feup/pt'

async function get(req: Request, res: Response) {
  const news: News[] = []

  axios
    .get(NEWS_URL, { responseEncoding: 'binary' })
    .then(response => {
      const $ = cheerio.load(response.data.toString('latin1'))
      const targetUl = $('a[name=gruponot7] ~ ul')[0]
      $(targetUl)
        .find('li')
        .each((i, e) => {
          const url = $(e).find('span.titulo a').attr('href') || FALLBACK_URL
          const title = $(e).find('span.titulo a').text()
          const excerpt = $(e).find('p.textopequenonoticia').text()

          news.push({
            url: `${MAIN_URL}/${url}`,
            title: title,
            excerpt: excerpt,
          })
        })
    })
    .then(() => {
      const requests = news.map(({ url }) => axios.get(url, { responseEncoding: 'binary' }))
      axios
        .all(requests)
        .then(
          axios.spread((...responses) => {
            responses.forEach((item, index) => {
              const $ = cheerio.load(item.data.toString('latin1'))
              const target = $('#conteudoinner')
              const header = $(target).first().find('h1').text()
              const details = $(target).first().find('h2').text()
              const content = $(target).first().find('p').text()

              news[index].header = header
              news[index].details = details
              news[index].content = content
            })
          })
        )
        .then(() => {
          res.send(news)
        })
    })
    .catch(function (e) {
      console.log(e)
    })
}

export default {
  get,
}
