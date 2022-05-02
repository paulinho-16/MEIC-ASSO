import 'module-alias/register';

import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import setRequests from '@/socket';
import UserManager from '@/userManager';
import mongoose from "mongoose";


const app = express();
app.use(cors());

mongoose.connect(
  process.env.MONGODB_URI, {
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pass: process.env.MONGO_INITDB_ROOT_PASSWORD
}
).then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB not connected: ' + err.message));

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
