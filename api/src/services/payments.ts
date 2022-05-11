import * as cheerio from 'cheerio'

import { Payment, PaymentsTable, PaymentsTableHeadings, PaymentsResponse } from '@/@types/payments'

import { paymentsPageHTML } from '../config/data'

function parseTable(table: cheerio.Element): PaymentsTable {
  const $ = cheerio.load(table)
  
  // Get table headings
  const tableHeadings: PaymentsTableHeadings = []
  const tableHeadingsWithColspans: PaymentsTableHeadings = []
  
  $(table).find('tr').first().find('th').each(function(j, cell) {
    let colspan = parseInt($(cell).attr('colspan') || "1")

    tableHeadings.push($(cell).text().trim())
    while (colspan > 0) {
      tableHeadingsWithColspans.push($(cell).text().trim())
      colspan -= 1
    }
  })
  
  // Get table rows
  const payments: Payment[] = []

  $(table).find('tr').each(function(i, row) {
    const payment: Payment = {}

    let offset = 0

    $(row).find('td').each(function(j, cell) {
      payment[tableHeadingsWithColspans[j + offset]] = payment[tableHeadingsWithColspans[j + offset]] 
        ? payment[tableHeadingsWithColspans[j + offset]] + ", " + $(cell).text().trim()
        : $(cell).text().trim()

      offset += parseInt($(cell).attr('colspan') || "1") - 1
    })

    // Skip blank rows
    if (JSON.stringify(payment) != '{}')
      payments.push(payment)
  })

  const paymentsTable: PaymentsTable = {
    headings: tableHeadings,
    payments: payments
  }

  return paymentsTable
}

async function fetchPayments() {
  const $ = cheerio.load(paymentsPageHTML.toString())

  const paymentsTables: PaymentsResponse = {}

  // Get table names
  const indexList = $('#GPAG_CCORRENTE_GERAL_CONTA_CORRENTE_VIEW > ul').first().find('li')
  const index = indexList.map((i, el) => $(el).text()).toArray()

  // Get tables
  const tabs = $('#GPAG_CCORRENTE_GERAL_CONTA_CORRENTE_VIEW').find('div.tab')
  const parsedTables: PaymentsTable[] = tabs.map((i, el) => parseTable(el)).toArray()

  index.forEach((val, i) => {
    paymentsTables[val] = parsedTables[i]
  })

  return paymentsTables
}

export default {
  fetchPayments,
}
