import { Request, Response } from 'express'
import axios from 'axios'

const url = 'https://sigarra.up.pt/feup/pt/instalacs_geral.ocupacao_parques'

async function getCapacity(req: Request, res: Response) {
  const response = await axios.request({
    method: 'GET',
    url: url,
    responseType: 'arraybuffer',
    responseEncoding: 'binary',
  })
  let json = JSON.parse(response.data)
  res.send(json.itdc[0].resposta)
}

export default {
  getCapacity,
}
