import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'

const socket = io('http://localhost:3000')

let username = ''
const usernameForm = document.querySelector('#username-form')
const usernameInput = document.querySelector('#username')

usernameForm.addEventListener('submit', (e) => {
	e.preventDefault()
	const value = usernameInput.value.trim()
	if (value) {
		username = value
		socket.emit('username', value)
		// deletes the username form
		usernameForm.remove()
		usernameInput.value = ''
	}
})

const form = document.getElementById('form')
const input = document.getElementById('input')
const to = document.getElementById('to')

form.addEventListener('submit', function (e) {
	e.preventDefault()

	if (!username) {
		alert('Please enter a username')
		return
	}

	if (input.value) {
		socket.emit('chat message', input.value, to.value)
		addMessage('You', input.value)
		input.value = ''
	}
})

socket.on('chat message', function (sender, msg) {
	addMessage(sender, msg, false)
})

socket.on('private message', (sender, msg) => {
	addMessage(sender, msg, true)
})

socket.on('notification', (msg) => {
	const item = document.createElement('li')
	item.textContent = msg
	// item color red
	item.style.color = 'red'
	messages.appendChild(item)
	window.scrollTo(0, document.body.scrollHeight)
})

function addMessage(sender, msg, pvt) {
	const item = document.createElement('li')
	item.textContent = (pvt ? '(private) ' : '') + sender + ': ' + msg
	messages.appendChild(item)
	window.scrollTo(0, document.body.scrollHeight)
}
