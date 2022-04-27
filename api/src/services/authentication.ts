import { User } from '@/@types/user'
import { Pool } from "pg";

const pool = new Pool({
    host: "postgres",
    user: "postgres",
    database: "postgres",
    password: "postgres",
    port: 5432
});
  
const connectToDB = async () => {
    try {
        await pool.connect()
    } catch (err) {
        setTimeout(connectToDB, 2000);
        console.log('Error connecting to db. Retrying in 1s')
    }
}
  
connectToDB()
  

async function insertUser(user: User){
    const query = {
        text: 'INSERT INTO UniUser(username, password, token) VALUES($1, $2, $3)',
        values: [user.username, user.password, user.token],
    }

    try{
        await pool.query(query)
        return true
    }
    catch(err){
        return false
    }
    return false
} 

async function getUser(username: string){
    const query = {
        text: 'SELECT * FROM UniUser WHERE username = $1',
        values: [username],
    }
    
    try {
        const result = await pool.query(query)
        if (result.rows.length == 0) return false
        return result.rows[0]
    }
    catch(err){
        return false
    }
} 

export default {
    getUser,
    insertUser
  }