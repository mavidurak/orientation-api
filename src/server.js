import 'dotenv/config';
import 'colors';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import router from './router';
import pre_handlers from './pre_handlers';
import errorHandler from './exceptions/errorHandler';

const server = express();
const { PORT } = process.env;

server.use(cors());
server.use(bodyParser.json());
pre_handlers.forEach((h) => server.use(h));
server.use(router);
server.use(errorHandler);

server.get('/health-check', (req, res) => res.status(200).send('OK'));

server.listen(PORT, () => {
  console.log(`🚀 Server listening to ${`http://localhost:${PORT}`.green} , NODE_ENV=${`${process.env.NODE_ENV}`.green}`);
});
