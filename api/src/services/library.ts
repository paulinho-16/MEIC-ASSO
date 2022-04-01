import fetch from 'node-fetch'
import cheerio from 'cheerio'

const floorUrls = [
  "https://docs.google.com/spreadsheets/d/e/2CAIWO3elLJh7BZUyNtOCufNpEy3rgW7Q3_y1bm9PcKmGfidnG4virJpEvpbxGOVDBOr_GyrzzyW6GyiU1Bg/gviz/chartiframe?authuser=0&oid=202902829&resourcekey",
  "https://docs.google.com/spreadsheets/d/e/2CAIWO3elLJh7BZUyNtOCufNpEy3rgW7Q3_y1bm9PcKmGfidnG4virJpEvpbxGOVDBOr_GyrzzyW6GyiU1Bg/gviz/chartiframe?authuser=0&oid=667562839&resourcekey",
  "https://docs.google.com/spreadsheets/d/e/2CAIWO3elLJh7BZUyNtOCufNpEy3rgW7Q3_y1bm9PcKmGfidnG4virJpEvpbxGOVDBOr_GyrzzyW6GyiU1Bg/gviz/chartiframe?authuser=0&oid=959784934&resourcekey",
  "https://docs.google.com/spreadsheets/d/e/2CAIWO3elLJh7BZUyNtOCufNpEy3rgW7Q3_y1bm9PcKmGfidnG4virJpEvpbxGOVDBOr_GyrzzyW6GyiU1Bg/gviz/chartiframe?authuser=0&oid=1567588231&resourcekey",
  "https://docs.google.com/spreadsheets/d/e/2CAIWO3elLJh7BZUyNtOCufNpEy3rgW7Q3_y1bm9PcKmGfidnG4virJpEvpbxGOVDBOr_GyrzzyW6GyiU1Bg/gviz/chartiframe?authuser=0&oid=1606063858&resourcekey",
  "https://docs.google.com/spreadsheets/d/e/2CAIWO3elLJh7BZUyNtOCufNpEy3rgW7Q3_y1bm9PcKmGfidnG4virJpEvpbxGOVDBOr_GyrzzyW6GyiU1Bg/gviz/chartiframe?authuser=0&oid=653921166&resourcekey"
]

async function fetchLibraryOcupation() {
  const ocupation = [
    { floor: 1, max: 69, current: 0 },
    { floor: 2, max: 105, current: 0 },
    { floor: 3, max: 105, current: 0 },
    { floor: 4, max: 105, current: 0 },
    { floor: 5, max: 40, current: 0 },
    { floor: 6, max: 64, current: 0 },
  ]

  const promises = ocupation.map((floor, i) => fetchLibraryFloorOcupation(floorUrls[i]))

  const current = await Promise.all(promises)

  ocupation.forEach((floor, i) => floor.current = current[i])

  return ocupation
}

async function fetchLibraryFloorOcupation(url: string) {
  const response = await fetch(url)

  const body = await response.text()

  const $ = cheerio.load(body);

  console.log($('.docs-charts-tooltip').first())
  
  return parseInt($('.docs-charts-tooltip').first().text())
}

export default {
  fetchLibraryOcupation,
}