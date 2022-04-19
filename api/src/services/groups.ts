import axios from 'axios'
import * as cheerio from 'cheerio'
import constants from '../config/constants'

type Group = {
  title: string,
  description: String,
  membersNumberLimit: Int16Array,
  autoAccept: Boolean,
  information: Record<string, Record<string, string>>
}

function getGroups() {
    return 
}

export default {
    getGroups,
}