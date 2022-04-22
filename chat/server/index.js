import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import setRequests from './socket.js'
import UserManager from './userManager.js'

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:5500',
		methods: ['GET'],
	},
})

const userManager = new UserManager()

setRequests(io, userManager)

server.listen(3000, () => {
	console.log('listening on *:3000')
})
