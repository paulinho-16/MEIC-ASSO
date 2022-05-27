import {useEffect, useState} from "react";
import {io} from "socket.io-client";
import Username from '../components/Username';
import GroupChat from '../components/GroupChat'
import {Stack} from "react-bootstrap";
import axios from "axios";

export default function Groups() {
  const [socket, setSocket] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:8082')
    setSocket(socket)
    return () => {
      socket.disconnect()
    }
  }, [setSocket]);

  useEffect(() => {
    axios.get('http://localhost:8083/group').then(res => {
      setGroups(res.data);
    }).catch(err => {
      console.log(err)
    })
  }, []);

  return (
    <div className='mt-3 ms-3'>
      <Username/>
      <Stack gap={3} className='ms-5 mt-3'>
        {
          groups.map((group, index) => (
            <GroupChat key={index} data={group} socket={socket}/>
          ))
        }
      </Stack>
    </div>
  )
}