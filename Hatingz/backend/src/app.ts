import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import matchRoutes from './routes/matchRoutes';
import lineupRoutes from './routes/lineupRoutes';
import expulsionVoteRoutes from './routes/expulsionVoteRoutes';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'ratingz-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/lineups', lineupRoutes);
app.use('/api/matches', expulsionVoteRoutes);
app.use(errorHandler);

export default app;
