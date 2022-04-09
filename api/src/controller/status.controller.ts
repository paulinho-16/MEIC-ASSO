import { Request, Response } from 'express'

function pad(s: number){
  return (s < 10 ? '0' : '') + s;
}

function format(seconds: number){
  const hours = pad(Math.floor(seconds / (60*60)));
  const minutes = pad(Math.floor(seconds % (60*60) / 60));
  const sec = pad(Math.floor(seconds % 60));

  return hours + ':' + minutes+ ':' + sec;
}

async function get(req: Request, res: Response) {
  const uptime = process.uptime();
  res.send("I've been up for: " + format(uptime));
}

export default {
  get,
}
