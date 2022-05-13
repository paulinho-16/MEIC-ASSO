import * as cheerio from 'cheerio'

import { Movement, MovementTable, MovementTableHeadings, Movements, PaymentsResponse } from '@/@types/payments'

import { paymentsPageHTML } from '../config/data'

function parseTable(table: cheerio.Element): MovementTable {
  const $ = cheerio.load(table)
  
  // Get table headings
  const tableHeadings: MovementTableHeadings = []
  const tableHeadingsWithColspans: MovementTableHeadings = []
  
  $(table).find('tr').first().find('th').each(function(j, cell) {
    let colspan = parseInt($(cell).attr('colspan') || "1")

    tableHeadings.push($(cell).text().trim())
    while (colspan > 0) {
      tableHeadingsWithColspans.push($(cell).text().trim())
      colspan -= 1
    }
  })
  
  // Get table rows
  const movements: Movement[] = []

  $(table).find('tr').each(function(i, row) {
    const movement: Movement = {}

    let offset = 0

    $(row).find('td').each(function(j, cell) {
      let text = ""
      
      if ($(cell).attr('class')=="l") {
        text = "("+$(cell).find('img').attr('alt')+")"
      } else {
        text = $(cell).text().trim()
      }

      if (movement[tableHeadingsWithColspans[j + offset]]) {
        if (text != "") movement[tableHeadingsWithColspans[j + offset]] += " | " + text
      } else {
        movement[tableHeadingsWithColspans[j + offset]] = text
      }

      offset += parseInt($(cell).attr('colspan') || "1") - 1
    })

    // Skip blank rows
    if (JSON.stringify(movement) != '{}')
      movements.push(movement)
  })

  const movementTable: MovementTable = {
    headings: tableHeadings,
    movements: movements
  }

  return movementTable
}

async function fetchPayments() {
  const $ = cheerio.load(paymentsPageHTML.toString())

  const payments: PaymentsResponse = {}

  const infos = ["code", "name", "nif", "balance"]

  $('table.formulario').first().find('tr td.formulario-legenda + td').each((i, el) => {
    payments[infos[i] as keyof PaymentsResponse] = $(el).text().trim()
  })

  // Get table names
  const indexList = $('#GPAG_CCORRENTE_GERAL_CONTA_CORRENTE_VIEW > ul').first().find('li')
  const index = indexList.map((i, el) => $(el).text()).toArray()

  // Get tables
  const tabs = $('#GPAG_CCORRENTE_GERAL_CONTA_CORRENTE_VIEW').find('div.tab')
  const parsedTables: MovementTable[] = tabs.map((i, el) => parseTable(el)).toArray()

  const movements: Movements = {}

  index.forEach((val, i) => {
    movements[val] = parsedTables[i]
  })

  payments.movements = movements

  return payments
}

export default {
  fetchPayments,
}
