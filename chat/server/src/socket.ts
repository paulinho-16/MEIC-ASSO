const setRequests = (io:any) => {
  io.on('connection', (socket:any) => {
    console.log('a user connected')

    socket.on('disconnect', (username: string) => {
      console.log('user disconnected')
      io.emit('notification', `${username} has left the chat`)
    })

    socket.on('chat message', (msg:string, from:string, room:string, timestamp: string) => {
      console.log('chat message', msg, from, room, timestamp)
      io.to(room).emit(`${room} message`, from, msg, timestamp)
    });

    socket.on('join room', (username:string, room:string) => {
      console.log(`${username} joined ${room}`)
      socket.join(room);
    })
  })
}

export default setRequests
