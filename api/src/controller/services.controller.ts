import { Request, Response } from 'express'
import cheerio from 'cheerio'
import axios from 'axios'
import constants from '@/config/constants'
import {
  Services
} from '@/@types/services'

async function getServices(req: Request, res: Response) {
  const services: Services[] = []
  const serviceID = req.params.id

  axios
    .get(constants.servicesUrl, { responseEncoding: 'binary' })
    .then(response => {
      const $ = cheerio.load(response.data.toString('latin1'))
      const targetUl = $('div ~ ul')

      $(targetUl)
        .find('li')
        .each((i, e) => {
          const title = $(e).find('a[href="uni_geral.unidade_view?pv_unidade=' + serviceID + '"]').text()
          const url = $(e).find('a').attr('href')

          if (title != "") {
            services.push({
              title: title,
              url: constants.mainUrl + "/" + url
            })
          }
        })
    })
    .then(() => {
      const requests = services.map(({ url }) => axios.get(url, { responseEncoding: 'binary' }))
      axios
        .all(requests)
        .then(
          axios.spread((...responses) => {
            responses.forEach((item, index) => {
              const $ = cheerio.load(item.data.toString('latin1'))
              const acronym = $('td:contains("Sigla:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
              const head = $('td:contains("Responsável:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
              const mission = $('td:contains("Missão:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
              const description = $('td:contains("Descrição:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
              const schedule = $('td:contains("Horário:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
              const contact = $('td:contains("Telefone:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
              const address = $('td:contains("Morada:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
              const postalCode = $('td:contains("Código Postal:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();
              const locality = $('td:contains("Localidade:")').next().text().replace(/\n/g, ' ').replace(/\r/g, ' ').trim();

              if (acronym!="") services[index].acronym = acronym.replace(/\s\s+/g, ' ')
              if (mission!="") services[index].mission = mission.replace(/\s\s+/g, ' ')
              if (description!="") services[index].description = description.replace(/\s\s+/g, ' ')
              if (schedule!="") services[index].schedule = schedule.replace(/\s\s+/g, ' ')
              if (head!="") services[index].head = head.replace(/\s\s+/g, ' ')
              if (contact!="") services[index].contact = contact.replace(/\s\s+/g, ' ')
              if (address!="") services[index].address = address.replace(/\s\s+/g, ' ')
              if (postalCode!="") services[index].postalCode = postalCode.replace(/\s\s+/g, ' ') 
              if (locality!="") services[index].locality = locality.replace(/\s\s+/g, ' ')
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
  getServices,
}