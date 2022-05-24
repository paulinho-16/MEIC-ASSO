<<<<<<< HEAD
import 'module-alias/register';

import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import setRequests from '@/socket';
import UserManager from '@/userManager';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5500',
    methods: ['GET'],
  },
});

const userManager = new UserManager();

setRequests(io, userManager);

server.listen(3000, () => {
  console.log('listening on *:3000');
});
=======
import 'module-alias/register';

import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import setRequests from '@/socket';

const app = express();
app.use(cors());

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
>>>>>>> 705b0e4bc1db26a2e7fc9a8357956fb3c3dcaaa3
