const setRequests = (io, userManager) => {
	io.on('connection', (socket) => {
		console.log('a user connected')

		socket.on('disconnect', () => {
			console.log('user disconnected')

			const user = userManager.getUserBySocketId(socket.id)
			if (user) {
				io.emit('notification', `${user} has left the chat`)
			}

			userManager.removeUserBySocketId(socket.id)
		})

		socket.on('username', (username) => {
			console.log('username', username)
			const last = userManager.addUser(username, socket.id)
			if (last) {
				io.emit('notification', `${last} has left the chat`)
			}
			io.emit('notification', `${username} has joined the chat`)
		})

		socket.on('chat message', (msg, to) => {
			console.log('chat message', msg, to)
			// get sender on username
			const sender = userManager.getUserBySocketId(socket.id)

			if (to) {
				io.to(userManager.getUserByUsername(to)).emit('private message', sender, msg)
			} else {
				socket.broadcast.emit('chat message', sender, msg)
			}
		})
	})
}

export default setRequests
