import { BsFillPersonFill } from 'react-icons/bs'
import useUsername from '../hooks/username'

const SystemMessage = ({ content }) => {
	return (
		<div className='pb-3 flex flex-col items-center'>
			<div className='text-xs text-gray-400'>
				<BsFillPersonFill className='inline-block mr-2' />
				{content}
			</div>
		</div>
	)
}

const UserMessage = ({ sender, content, to }) => {
	const { username } = useUsername()

	const own = sender === username

	return (
		<div className={`flex flex-col ${own ? 'items-end pl-10' : 'items-start pr-10'}`}>
			{/* if to */}
			<div className='text-xs text-gray-400'>
				{/* if not own */}
				{!own && <span>{sender}</span>}
				{/*  if to */}
				{to && <span className='font-bold'> to {to}</span>}
			</div>
			<div
				className={`px-3 py-1 rounded-3xl w-fit ${
					own ? 'bg-primary text-white text-right' : 'bg-gray-200 text-black text-gray-600'
				}`}>
				{/* bubble */}
				<p className='w-fit'>{content}</p>
			</div>
		</div>
	)
}

const Message = ({ sender, content, to }) => {
	if (sender === 'System') {
		return <SystemMessage content={content} />
	} else {
		return <UserMessage sender={sender} content={content} to={to} />
	}
}

export default Message
