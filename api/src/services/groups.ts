import axios from 'axios'
import * as cheerio from 'cheerio'
import constants from '../config/constants'

type Group = {
  name: string
  information: Record<string, Record<string, string>>
}