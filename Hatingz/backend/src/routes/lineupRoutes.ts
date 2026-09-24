// Responsável: João
import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { communityLineupsController, saveLineupController } from '../controllers/lineupController';
import { voteLineupController } from '../controllers/lineupVoteController';

const router = Router();
router.use(authMiddleware);
router.post('/', saveLineupController);
router.get('/community', communityLineupsController);
router.post('/:lineupId/votes', voteLineupController);

export default router;

