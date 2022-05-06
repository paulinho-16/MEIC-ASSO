import { Request, Response } from 'express'
import cheerio from 'cheerio'
import axios from 'axios'

type Services = {
  title: string
  url: string
  acronym?: string
  head?: string
  mission?: string
  //description?: string
  schedule?: string
  contact?: string
  address?: string
  postalCode?: string
  locality?: string
}

const SERVICES_URL = 'https://sigarra.up.pt/feup/pt/uni_geral.nivel_list?pv_nivel_id=4'
const MAIN_URL = 'https://sigarra.up.pt/feup/pt'

async function get(req: Request, res: Response) {
  const services: Services[] = []

  axios
    .get(SERVICES_URL, { responseEncoding: 'binary' })
    .then(response => {
      console.log("HERE")
      const $ = cheerio.load(response.data.toString('latin1'))
      const targetUl = $('div ~ ul')
      
      $(targetUl)
        .find('li')
        .each((i, e) => {
          console.log("HERE2")
          console.log(e)
          const title = $(e).find('a[href*="uni_geral.unidade_view?pv_unidade="]').text()
          const url = $(e).find('a').attr('href')
          
          if (title != ""){
            services.push({
              title: title,
              url: url
            })
          }
        })

      //res.send(services)
      
    })
    .then(() => {
      const requests = services.map(({ url }) => axios.get(MAIN_URL + "/" + url, { responseEncoding: 'binary' }))
      axios
        .all(requests)
        .then(
          axios.spread((...responses) => {
            responses.forEach((item, index) => {
              const $ = cheerio.load(item.data.toString('latin1'))
              const acronym = $('td:contains("Sigla:")').next().text().replace(/\n/g,' ').replace(/\r/g,' ');
              const head = $('td:contains("Responsável:")').next().text().replace(/\n/g,' ').replace(/\r/g,' ');
              const mission = $('td:contains("Missão:")').next().text().replace(/\n/g,' ').replace(/\r/g,' ');
              //const description = $('td:contains("Descrição:")').next().text().replace(/\n/g,' ').replace(/\r/g,' ');
              const schedule = $('td:contains("Horário:")').next().text().replace(/\n/g,' ').replace(/\r/g,' ');
              const contact = $('td:contains("Telefone:")').next().text().replace(/\n/g,' ').replace(/\r/g,' ');
              const address = $('td:contains("Morada:")').next().text().replace(/\n/g,' ').replace(/\r/g,' ');
              const postalCode = $('td:contains("Código Postal:")').next().text().replace(/\n/g,' ').replace(/\r/g,' ');
              const locality = $('td:contains("Localidade:")').next().text().replace(/\n/g,' ').replace(/\r/g,' ');

              services[index].acronym = acronym.replace(/\s\s+/g, ' ')
              services[index].mission = mission.replace(/\s\s+/g, ' ')
              //services[index].description = description.replace(/\s\s+/g, ' ')
              services[index].schedule = schedule.replace(/\s\s+/g, ' ')
              services[index].head = head.replace(/\s\s+/g, ' ')
              services[index].contact = contact.replace(/\s\s+/g, ' ')
              services[index].address = address.replace(/\s\s+/g, ' ')
              services[index].postalCode = postalCode.replace(/\s\s+/g, ' ')
              services[index].locality = locality.replace(/\s\s+/g, ' ')

            })
          })
        )
        .then(() => {
          res.send(services)
        })
    })
    .catch(function (e) {
      console.log(e)
    })
}

export default {
  get,
}