import {useEffect, useState} from "react";
import {io} from "socket.io-client";
import Username from '../components/Username';
import GroupChat from '../components/GroupChat'
import {Stack} from "react-bootstrap";

export default function Groups() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:8082')
    setSocket(socket)
    return () => {
      socket.disconnect()
    }
  }, [setSocket]);

  return (
    <div className='mt-3 ms-3'>
      <Username />
      <Stack gap={3} className='ms-5 mt-3'>
        <GroupChat name="AssoT1" socket={socket}/>
        <GroupChat name="AssoT2" socket={socket}/>
        <GroupChat name="AssoT3" socket={socket}/>
      </Stack>
    </div>
  )
}