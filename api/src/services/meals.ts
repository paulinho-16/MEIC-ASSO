import fetch from 'node-fetch'
import constants from '@/config/constants'

async function fetchCanteenData() {
  const response = await fetch(constants.canteenUrl)
  const data = await response.json()

  return data
}

export default {
  fetchCanteenData,
}
