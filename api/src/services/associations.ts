import constants from '../config/constants'
import puppeteer from 'puppeteer'
//import fs from 'fs'

type Association = {
  name: string
  information: Record<string, Record<string, string>>
}

async function scrap() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(constants.associationsUrl)

  const parseAssociations = function (associations: Array<Element>) {
    const results = []

    for (const association of associations) {
      const nameElement = association.querySelector(
        'span.fusion-toggle-heading'
      )
      const bodyElement = association.querySelector('div.panel-body')

      if (!nameElement || !bodyElement) continue

      const name = nameElement.textContent ?? ''
      const body = bodyElement.innerHTML

      results.push({ name, body })
    }
    return results
  }

  const associations1 = await page.$$eval(
    '#accordion-37-1 > div',
    parseAssociations
  )

  const associations2 = await page.$$eval(
    '#accordion-37-2 > div',
    parseAssociations
  )
  await browser.close();

  const associations = associations1.concat(associations2)
  const parsedAssociations = associations.map(parseAssociationBody)

  //   fs.writeFileSync("data.json", JSON.stringify(parsedAssociations), {
  //     flag: "a",
  //   });

  return parsedAssociations
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
