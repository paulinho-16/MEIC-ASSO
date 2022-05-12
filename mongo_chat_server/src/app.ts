import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";

import indexRouter from './routes/message';

const app = express();
app.use(cors());

console.log(process.env.MONGODB_URI)
mongoose.connect(
  process.env.MONGODB_URI, {
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pass: process.env.MONGO_INITDB_ROOT_PASSWORD
}
).then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB not connected: ' + err.message));



app.listen(3000, () => {
  console.log('listening on *:3000');
});

module.exports = app;

// ir buscar mensagens com uma certa paginação
// criar uma mensagem
// ir buscar grupos
// criar grupos e utilizadores