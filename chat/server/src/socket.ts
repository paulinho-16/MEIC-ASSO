import axios from 'axios';

const setRequests = (io: any) => {
  io.on('connection', (socket: any) => {
    console.log('a user connected')

    socket.on('online', (up: string) => {
      // Store up number
      socket.up = up;
      console.log(`User ${up} connected!`);

      axios.post(`http://mongo_chat_server:3000/user/${up}`, {online: true})
        .then((res: any) => {
          console.log(res.data);
        })
        .catch((err: any) => {
          console.log(err);
        });
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.up} disconnected`);

      axios.post(`http://mongo_chat_server:3000/user/${socket.up}`, {online: false})
        .then(
          (res: any) => {
            console.log(res.data);
          }
        )
        .catch(
          (err: any) => {
            console.log(err);
          }
        );
    })

    socket.on('chat message', (msg: string, from: string, room: string, timestamp: string) => {
      console.log('chat message', msg, from, room, timestamp);
        axios.post('http://mongo_chat_server:3000/message/', { group: room, message: msg, from: from})
          .then(
              (res: any) => {
                  console.log("hello")
                console.log(res.data);
              }
          )
          .catch(
              (err: any) => {
                console.error(err);
              }
          );
      io.to(room).emit(`${room} message`, from, msg, timestamp)
    });

    socket.on('join room', (username: string, room: string) => {
      console.log(`${username} joined ${room}`)
      socket.join(room);
    })
  })
}

export default setRequests
