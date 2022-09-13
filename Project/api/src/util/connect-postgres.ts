import { Pool } from 'pg'

const postgresClient = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_SCHEMA,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
})

const connectPostgres = async () => {
  try {
    await postgresClient.connect()
    console.log('Connected to Postgres')
  } catch (err) {
    setTimeout(connectPostgres, 2000)
    console.log('Error connecting to Postgres. Retrying in 2s')
  }
}

connectPostgres()

export default postgresClient
