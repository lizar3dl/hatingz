import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { listTeamPlayersController } from '../controllers/teamController';

const router = Router();
router.use(authMiddleware);
router.get('/:teamSlug/players', listTeamPlayersController);

export default router;
