<<<<<<< HEAD
import UserManager from "@/userManager";

const setRequests = (io:any, userManager:UserManager) => {
  io.on('connection', (socket:any) => {
    console.log('a user connected')

    socket.on('disconnect', () => {
      console.log('user disconnected')

      const user = userManager.getUserBySocketId(socket.id)
      if (user) {
        io.emit('notification', `${user} has left the chat`)
      }

      userManager.removeUserBySocketId(socket.id)
    })

    socket.on('username', (username:string) => {
      console.log('username', username)
      const last = userManager.addUser(username, socket.id)
      if (last) {
        io.emit('notification', `${last} has left the chat`)
      }
      io.emit('notification', `${username} has joined the chat`)
    })

    socket.on('chat message', (msg:string, to:string) => {
      console.log('chat message', msg, to)
      // get sender on username
      const sender = userManager.getUserBySocketId(socket.id)

      if (to) {
        io.to(userManager.getUserByUsername(to)).emit('private message', sender, msg)
      } else {
        socket.broadcast.emit('chat message', sender, msg)
      }
    })
  })
}

export default setRequests
=======
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
>>>>>>> 705b0e4bc1db26a2e7fc9a8357956fb3c3dcaaa3
