import { User } from '@/@types/user'
import postgresClient from '@/util/connect-postgres'

async function insertUser(user: User) {
  const query = {
    text: 'INSERT INTO UniUser(email, password) VALUES($1, $2) RETURNING id',
    values: [user.email, user.password],
  }

  const result = await postgresClient.query(query)
  if (result.rows.length == 0) return -1
  return result.rows[0]
}

async function getUserById(id: number) {
  const query = {
    text: 'SELECT * FROM UniUser WHERE id = $1',
    values: [id],
  }

  const result = await postgresClient.query(query)
  if (result.rows.length == 0) return false
  return result.rows[0]
}

async function getUserByEmail(email: string) {
  const query = {
    text: 'SELECT * FROM UniUser WHERE email = $1',
    values: [email],
  }

  const result = await postgresClient.query(query)
  if (result.rows.length == 0) return false
  return result.rows[0]
}

async function existsUserById(id: number) {
  const query = {
    text: 'SELECT id FROM UniUser WHERE id = $1',
    values: [id],
  }

  const result = await postgresClient.query(query)
  if (result.rows.length == 0) return false
  return true
}

async function existsUserByEmail(email: string) {
  const query = {
    text: 'SELECT id FROM UniUser WHERE email = $1',
    values: [email],
  }

  const result = await postgresClient.query(query)
  if (result.rows.length == 0) return false
  return true
}

async function deleteUserById(id: number) {
  const query = {
    text: 'DELETE FROM UniUser WHERE id = $1',
    values: [id],
  }

  await postgresClient.query(query)
}

async function updatePassword(id: number, password: string) {
  const query = {
    text: 'UPDATE UniUser SET password=$1 WHERE id=$2',
    values: [password, id],
  }

  await postgresClient.query(query)
}

function getPasswordErrors(password: string): string | null {
  const errors = []

  // At least 6 characters
  const characters = password.length
  if (characters === 0) errors.push('no characters')
  else if (characters < 6)
    errors.push(`only ${password.length} character${characters == 1 ? '' : 's'}`)

  // One numeric digit
  if (!password.match(/^.*\d.*$/)) errors.push('no digits')

  // One uppercase character
  if (!password.match(/^.*(?=.*[A-Z]).*$/)) errors.push('no uppercase letters')

  // One lowercase character
  if (!password.match(/^.*(?=.*[a-z]).*$/)) errors.push('no lowercase letters')

  // No errors
  if (errors.length === 0) return null

  // Build a message with all the errors of the password
  let errorMessage = errors.pop()
  if (errors.length !== 0) errorMessage = errors.join(', ') + ' and ' + errorMessage

  return `it needs at least 6 characters, one numeric digit, one uppercase and one lowercase letter, but it has ${errorMessage}`
}

export default {
  getUserByEmail,
  getUserById,
  existsUserById,
  existsUserByEmail,
  insertUser,
  deleteUserById,
  updatePassword,
  getPasswordErrors,
}
