import express, { request } from 'express';
import routes from './routes';
import cors from 'cors';
import path from 'path';

const app = express();

app.listen(3333);
app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

    