import express from 'express';
import morgan from 'morgan';
import { AppDataSource } from './data-source';
import authRouter from './routes/auth';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
const origin = 'http://localhost:3000';

app.use(
  cors({
    origin,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_, res) => res.send('running'));
app.use('/api/auth', authRouter);

dotenv.config();

let port = 4000;

app.listen(port, async () => {
  console.log(`server running at http://localhost:${port}`);

  AppDataSource.initialize()
    .then(() => {
      console.log('database initialized');
    })
    .catch((error) => console.log(error));
});
