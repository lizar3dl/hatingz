// Respons?vel: Jo?o
import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { castExpulsionVoteController, listExpulsionVoteCandidatesController } from '../controllers/expulsionVoteController';

const router = Router();
router.use(authMiddleware);
router.get('/:matchId/expulsion-votes', listExpulsionVoteCandidatesController);
router.post('/:matchId/expulsion-votes', castExpulsionVoteController);

export default router;
