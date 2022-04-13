import fetch from 'node-fetch'
import cheerio from 'cheerio'
import constants from '@/config/constants'

async function fetchLibraryOcupation() {
  const ocupation = [
    { floor: 1, max: 69, current: 0 },
    { floor: 2, max: 105, current: 0 },
    { floor: 3, max: 105, current: 0 },
    { floor: 4, max: 105, current: 0 },
    { floor: 5, max: 40, current: 0 },
    { floor: 6, max: 64, current: 0 },
  ]

  const data = await fetchSpreadData()

  ocupation.forEach((floor, i) => floor.current = data ? data[i] || 0 : 0)

  return ocupation
}

async function fetchSpreadData() {
  const response = await fetch(constants.libraryUrl)

  const body = await response.text()

  const $ = cheerio.load(body);

  const data = $('[property="og:description"]').attr('content')

  const ocupations = data?.split('\n')
    .filter((line) => line.startsWith('Piso'))
    .map((line) => parseInt(line.split(',')[1]))
  
  return ocupations
}

export default {
  fetchLibraryOcupation,
}