import * as cheerio from 'cheerio'

import { paymentsPageHTML } from '../config/data'

async function fetchPayments() {
  const $ = cheerio.load(paymentsPageHTML.toString())

  // Scrape index for group names (e.g. Despesas nao saldadas; Cacifos; ...)

  // For each group get the table inside the div with id TabX

  // Table headers are the attribute names for each payment

  // For each row of table it corresponds to a new entry in the group

  // Return object with all groups

  return {}
}

export default {
  fetchPayments,
}
