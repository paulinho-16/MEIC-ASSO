import 'module-alias/register';

import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import setRequests from '@/socket';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5500',
    methods: ['GET'],
  },
});

setRequests(io);

server.listen(3000, () => {
  console.log('listening on *:3000');
});
