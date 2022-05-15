import { User } from '@/@types/user'
import { Pool } from 'pg'

const pool = new Pool({
  host: 'postgres',
  user: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})

const connectToDB = async () => {
  try {
    await pool.connect()
  } catch (err) {
    setTimeout(connectToDB, 2000)
    console.log('Error connecting to db. Retrying in 2s')
  }
}

connectToDB()

async function insertUser(user: User) {
  const query = {
    text: 'INSERT INTO UniUser(email, password) VALUES($1, $2) RETURNING id',
    values: [user.email, user.password],
  }

  const result = await pool.query(query)
  if (result.rows.length == 0) return -1
  return result.rows[0]
}

async function getUserById(id: number) {
  const query = {
    text: 'SELECT * FROM UniUser WHERE id = $1',
    values: [id],
  }

  const result = await pool.query(query)
  if (result.rows.length == 0) return false
  return result.rows[0]
}

async function getUserByEmail(email: string) {
  const query = {
    text: 'SELECT * FROM UniUser WHERE email = $1',
    values: [email],
  }

  const result = await pool.query(query)
  if (result.rows.length == 0) return false
  return result.rows[0]
}

async function existsUserById(id: number) {
  const query = {
    text: 'SELECT id FROM UniUser WHERE id = $1',
    values: [id],
  }

  const result = await pool.query(query)
  if (result.rows.length == 0) return false
  return true
}

async function existsUserByEmail(email: string) {
  const query = {
    text: 'SELECT id FROM UniUser WHERE email = $1',
    values: [email],
  }

  const result = await pool.query(query)
  if (result.rows.length == 0) return false
  return true
}

async function deleteUserById(id: number) {
  const query = {
    text: 'DELETE FROM UniUser WHERE id = $1',
    values: [id],
  }

  await pool.query(query)
}

async function updatePassword(id: number, password: string) {
  const query = {
    text: 'UPDATE UniUser SET password=$1 WHERE id=$2',
    values: [password, id],
  }

  await pool.query(query)
}

export default {
  getUserByEmail,
  getUserById,
  existsUserById,
  existsUserByEmail,
  insertUser,
  deleteUserById,
  updatePassword,
}
