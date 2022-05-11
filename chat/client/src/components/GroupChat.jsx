import {useEffect, useState} from "react";
import {Button, Form, Modal, Row} from "react-bootstrap";
import useUsername from "../hooks/username";
import Message from "./Message";

export default function GroupChat({name, socket}) {
  const { username } = useUsername();

  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleMessageChange = (event) => {
    setMessage(event.target.value || '')
  }

  const handleSend = (event) => {
    event.preventDefault()
    const content = message.trim()
    if (content) {
      console.log(name)
      socket.emit('chat message', content, username, name, new Date().toLocaleString())
      setMessage('')
    }
  }

  useEffect(() => {
    if (socket) {
      socket.emit("join room", username, name);
    }
  }, [socket]);

  if (socket) {
    socket.on(`${name} message`, (from, message, timestamp) => {
      setMessages([...messages, { from, message, timestamp }])
    })
  }

  return (
    <Row>
      <Button variant="primary" className='w-auto' onClick={handleShow}>
        {name}'s Chat
      </Button>

      <Modal show={show} size='lg' onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{name}'s Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='px-6 grow overflow-y-auto'>
            <ul className='px-3 flex flex-col gap-1 overflow-auto max-h-full'>
              {messages.map((message, index) => (
                <Message key={index} sender={message.from} content={message.message} />
              ))}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer className='justify-content-start'>
          <Form className='w-100' onSubmit={handleSend} >
            <Form.Control type="text" placeholder="Message" value={message} onChange={handleMessageChange}/>
            <Button className='mt-1' variant="primary" type="submit">Send</Button>
          </Form>
        </Modal.Footer>
      </Modal>
    </Row>
  )
}
