import express from 'express';
import cors from 'cors';
import initMongo from './init_mongo';

const app = express();
app.use(cors());

initMongo();

app.listen(3000, () => {
  console.log('listening on *:3000');
});

module.exports = app;
