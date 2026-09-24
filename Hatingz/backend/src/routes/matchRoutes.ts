import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { listMatchesController } from '../controllers/matchController';

const router = Router();
router.use(authMiddleware);
router.get('/', listMatchesController);

export default router;
