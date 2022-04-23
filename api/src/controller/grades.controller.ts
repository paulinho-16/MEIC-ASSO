import axios from 'axios'
import * as cheerio from 'cheerio'
import { Request, Response } from 'express'
import { gradesHTML } from '../config/data'

type Grade = {
  uc: string
  result: string
}

const GRADES_URL = 'https://google.com'
// const MAIN_URL = 'https://sigarra.up.pt/feup/pt'
// const FALLBACK_URL = 'https://sigarra.up.pt/feup/pt'

async function get(req: Request, res: Response) {
  let result: string
  const grades: Grade[] = []

  console.log(req)
  console.log(res)
  console.log(grades)
  console.log(gradesHTML)

  axios
    .get(GRADES_URL, { responseEncoding: 'binary' })
    .then(response => {
      console.log(response.data)
      const $ = cheerio.load(gradesHTML.toString())

      const target = $(`#conteudo`)[0]
      result = $(target).html()
    })
    .then(() => {
      res.send(result)
      // const requests = grades.map(({ url }) => axios.get(url, { responseEncoding: 'binary' }))
      // axios
      //   .all(requests)
      //   .then(
      //     axios.spread((...responses) => {
      //       responses.forEach((item, index) => {
      //         // const $ = cheerio.load(item.data.toString('latin1'))
      //         // const target = $('#conteudoinner')
      //       })
      //     })
      //   )
      //   .then(() => {
      //     res.send(grades)
      //   })
    })
    .catch(function (e) {
      console.log(e)
    })
}

export default {
  get,
}
