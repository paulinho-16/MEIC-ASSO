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

async function createNotification(userID:number){
    const query = {
        text: 'INSERT INTO Notifications(userID, description, author) VALUES($1, $2, $3)',
        values: [userID, 'My notification description', 'James Bond'],
    }

    try{
        let res = await client.query(query)
        return true
    }
    catch(err){
        console.log(err);
        return false
    }

}

async function getAllNotifications(userID:number) {

    const query = {
        text: 'SELECT * FROM Notifications WHERE userID=$1',
        values: [userID]
    }

    try{
        let res = await client.query(query)
        return true
    }
    catch(err){
        console.log(err);
        return false
    }
}

export default {
    createNotification,
    getAllNotifications
}