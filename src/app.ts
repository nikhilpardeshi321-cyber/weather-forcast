import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import analyticsRouter from './routes/analytics';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/analytics', analyticsRouter);

app.get('/', (_req, res) => {
  res.json({ message: 'Weather Analytics API' });
});

export default app;

