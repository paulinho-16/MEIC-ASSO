// temporary file that handles connected users

export default class UserManager {
	constructor() {
		this.users = {}
	}

	getUserBySocketId = (socketId) => {
		return this.users[socketId]
	}

	getUserByUsername = (username) => {
		return Object.keys(this.users).find((socketId) => this.users[socketId] === username)
	}

	removeUserBySocketId = (socketId) => {
		delete this.users[socketId]
	}

	addUser = (username, socketId) => {
		const pre = this.users[socketId]
		this.users[socketId] = username

		return pre
	}
}
