import { BsFillPersonFill } from 'react-icons/bs';
import useUp from '../hooks/up';

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

const UserMessage = ({ sender, content }) => {
	const {up} = useUp();

	const own = sender === up;

	return (
		<>
			{ !own && <p className='mb-0'>{sender}</p> }
			<p className={(own ? 'bg-primary text-white text-end' : 'bg-light') + ' rounded p-2'}>
				{content}
			</p>
		</>
	)
}

const Message = ({ sender, content }) => {
	if (sender === 'System') {
		return <SystemMessage content={content} />
	} else {
		return <UserMessage sender={sender} content={content}/>
	}
}

export default Message
