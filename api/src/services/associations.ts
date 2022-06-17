import axios from 'axios'
import * as cheerio from 'cheerio'
import constants from '../config/constants'

type Association = {
  name: string
  information: Record<string, Record<string, string>>
}

async function scrap() {
  const result: Association[] = []
  return axios
    .get(constants.associationsUrl)
    .then(response => {
      const $ = cheerio.load(response.data.toString())
      const target1 = $(`#accordion-37-1`)
      const target2 = $(`#accordion-37-2`)

      const parseAssociations = (e: cheerio.Element) => {
        const name = $(e).find('span.fusion-toggle-heading').text().trim() ?? ''
        const body = $(e).find('div.panel-body').html()

        if (!name || !body) return

        result.push(parseAssociationBody({ name, body }))
      }

      $(target1)
        .find('div')
        .each((_, e) => parseAssociations(e))
      $(target2)
        .find('div')
        .each((_, e) => parseAssociations(e))

      return result
    })
    .catch(function (e) {
      console.log(e)
    })
}

function parseAssociationBody(association: { name: string; body: string }) {
  const parsedAssociation: Association = {
    name: association.name,
    information: {},
  }

  const lines = association.body.split('\n')
  let body = {}

  for (let line of lines) {
    if (line === '') continue

    line = line.replace(/(<([^>]+)>)|(\s)|(&[a-z]+;)/gi, '')

    const colonIndex = line.indexOf(':')

    let datapointName = line.substring(0, colonIndex)
    const datapointValue = line.substring(colonIndex + 1, line.length)

    switch (datapointName) {
      case 'Horário':
        datapointName = 'timetable'
        break
      case 'Telefone':
        datapointName = 'phone'
        break
      case 'Email':
        datapointName = 'email'
        break
      case 'Site':
        datapointName = 'website'
        break
      case 'Facebook':
        datapointName = 'facebook'
        break
      case 'Instagram':
        datapointName = 'instagram'
        break
    }

    body = Object.assign(body, { [datapointName]: datapointValue })
  }

  parsedAssociation.information = body

  return parsedAssociation
}

export default {
  scrap,
}
