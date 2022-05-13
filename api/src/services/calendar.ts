import { Client } from 'pg'

const client = new Client({
    user: 'postgres',
    host: 'postgres',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
})

client.connect()
  .then(() => console.log('connected'))
  .catch((err) => console.error('connection error', err.stack))

function getCalendarEvent(date:string){
    const query = 'SELECT * FROM Event WHERE date = $1'
    const values = [date]

    try{
        let res = await client.query(query, values)
        return res.rows
      }
      catch(err){
        console.log(err);
        return false
      }

}

function putCalendarEvent(summary:string, description:string, location:string, date:string, start:string, end:string, recurrence:string, isUni:boolean){
    const query = 'INSERT INTO Event(summary, description, location, date, start, end, recurrence, isUni) VALUES ($1, $2, 3$, 4$, 5$, 6$, 7$, 8$)'
    const values = [summary, description, location, date, start, end, recurrence, isUni]



}

