import { useEffect, useRef, useState } from 'react'
import Message from '../components/Message'
import { IoSend } from 'react-icons/io5'
import { BsFillPersonFill } from 'react-icons/bs'
import { io } from 'socket.io-client'
import useUsername from '../hooks/username'

const Chat = () => {
	const { username } = useUsername()

	const [socket, setSocket] = useState(null)

	const [messages, setMessages] = useState([])

	useEffect(() => {
		const socket = io('http://localhost:8082')
		setSocket(socket)
		return () => {
			socket.disconnect()
		}
	}, [setSocket])

	useEffect(() => {
		if (socket) {
			socket.emit('username', username)
		}
	}, [socket, username])

	return (
		<div className='w-screen h-screen'>
			<div className='absolute top-0 left-0 overflow-y-hidden w-full h-full'>
				{/* background */}
				<span className='c-dot bg-purple-200 top-96 left-96' />
				<span className='c-dot bg-blue-200 right-96 bottom-52' />
				<span className='c-dot bg-green-200 right-96 bottom-96' />
			</div>

			<div className='backdrop-blur-2xl bg-white/50 flex justify-center items-center h-screen w-screen'>
				<div className='mockup-phone shadow-lg h-5/6 w-96'>
					<div className='camera'></div>
					<div className='display flex flex-col bg-white h-full'>
						<Header socket={socket} />

						{socket ? (
							<>
								<Messages socket={socket} messages={messages} setMessages={setMessages} />
								<Sender socket={socket} messages={messages} setMessages={setMessages} />
							</>
						) : (
							'Not connected'
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

const Header = ({ socket }) => {
	const { username, storeUsername } = useUsername()

	const [notDefinitiveUsername, setNotDefinitiveUsername] = useState(username)

	const handleUsernameChange = (event) => {
		setNotDefinitiveUsername(event.target.value)
	}

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			storeUsername(notDefinitiveUsername)
		}, 2000)

		return () => clearTimeout(delayDebounceFn)
	}, [notDefinitiveUsername, storeUsername])

	return (
		<div className='flex justify-center pt-14 pb-5 w-full'>
			{/* header */}
			<form action='' onSubmit={(event) => event.preventDefault()}>
				<input
					className='text-xl font-bold text-center w-full'
					type='text'
					value={notDefinitiveUsername}
					onChange={handleUsernameChange}
				/>
			</form>
		</div>
	)
}

const Messages = ({ socket, messages, setMessages }) => {
	const { username } = useUsername()

	socket.on('chat message', (sender, content) => {
		setMessages([...messages, { sender, content }])
	})

	socket.on('private message', (sender, content) => {
		setMessages([...messages, { sender, content, to: username }])
	})

	socket.on('notification', (notification) => {
		setMessages([...messages, { sender: 'System', content: notification }])
	})

	const messagesEndRef = useRef(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages.length])

	return (
		<div className='px-6 grow overflow-y-auto'>
			{/* messages */}
			<ul className='flex flex-col gap-1 overflow-auto max-h-full'>
				{messages.map((message, index) => (
					<Message key={index} sender={message.sender} content={message.content} to={message.to} />
				))}
				<div ref={messagesEndRef} />
			</ul>
		</div>
	)
}

const Sender = ({ socket, messages, setMessages }) => {
	const [message, setMessage] = useState('')
	const [to, setTo] = useState('')
	const [isToFormActive, setIsToFormActive] = useState(false)

	const { username } = useUsername()

	const handleMessageChange = (event) => {
		setMessage(event.target.value || '')
	}

	const handleToButton = () => {
		if (isToFormActive) {
			setIsToFormActive(false)
			setTo('')
		} else {
			setIsToFormActive(true)
		}
	}

	const handleToChange = (event) => {
		setTo(event.target.value || '')
	}

	const handleSend = (event) => {
		event.preventDefault()
		const content = message.trim()
		if (content) {
			socket.emit('chat message', content, to)
			setMessages([...messages, { sender: username, content, to }])
			setMessage('')
		}
	}

	return (
		<div className='p-5'>
			{/* sender */}
			<form onSubmit={handleSend}>
				<input
					className={`bg-gray-300 mx-2 px-5 rounded-full relative top-2 ${isToFormActive ? '' : 'hidden'}`}
					value={to}
					onChange={handleToChange}
					autoComplete='off'
					placeholder='To whom?'
				/>
				<div className='flex gap-3'>
					{/* row */}
					<div className='bg-gray-200 flex items-center px-5 py-2 rounded-full w-full'>
						{/* text input */}
						<input
							className='w-full bg-gray-200'
							value={message}
							onChange={handleMessageChange}
							autoComplete='off'
							placeholder='Message here'
						/>
						<span onClick={handleToButton}>
							<BsFillPersonFill />
						</span>
					</div>
					<button className='btn btn-primary rounded-full' type='submit' onClick={handleSend}>
						<IoSend />
					</button>
				</div>
			</form>
		</div>
	)
}

export default Chat
