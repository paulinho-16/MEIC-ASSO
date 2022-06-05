import {useEffect, useState} from "react";
import useUp from "../hooks/up";
import {io} from "socket.io-client";
import GroupChat from '../components/GroupChat'
import {Stack} from "react-bootstrap";
import axios from "axios";

export default function Groups() {
  const {up} = useUp();
  const [socket, setSocket] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:8082');
    socket.emit('online', up);
    setSocket(socket);
    return () => {
      socket.disconnect()
    }
  }, [setSocket]);

  useEffect(() => {
    axios.get(`http://localhost:8083/group/user/${up}`)
      .then(res => {
        setGroups(res.data);
      })
      .catch(err => {
        console.log(err)
      });
  }, []);

  return (
    <div className='mt-3 ms-3'>
      <p><b>UP:</b>{up}</p>
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