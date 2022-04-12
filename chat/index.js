const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const cors = require('cors')

const app = express()
app.use(cors())

const userList = {}

const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: 'http://127.0.0.1:5500',
		methods: ['GET'],
	},
})

io.on('connection', (socket) => {
	console.log('a user connected')
	socket.on('disconnect', () => {
		console.log('user disconnected')

		const user = userList[socket.id]
		if (user) {
			io.emit('notification', `${user} has left the chat`)
		}
    
		delete userList[socket.id]
	})

	socket.on('username', (username) => {
		userList[username] = socket.id
		io.emit('notification', `${username} has joined the chat`)
	})

	socket.on('chat message', (msg, to) => {
		// get sender on username
		const sender = Object.keys(userList).find((key) => userList[key] === socket.id)

		if (to) {
			io.to(userList[to]).emit('private message', sender, msg)
		} else {
			socket.broadcast.emit('chat message', sender, msg)
		}
	})
})

server.listen(3000, () => {
	console.log('listening on *:3000')
})
