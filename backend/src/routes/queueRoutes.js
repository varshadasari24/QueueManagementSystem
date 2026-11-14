import express from 'express';

import {
  addTokenToQueue,
  cancelToken,
  createQueue,
  getManagerQueues,
  getQueueById,
  moveTokenInQueue,
  serveToken,
} from '../controllers/queueController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getManagerQueues);
router.post('/', createQueue);
router.get('/:id', getQueueById);
router.post('/:id/tokens', addTokenToQueue);
router.patch('/:id/tokens/:tokenId/move', moveTokenInQueue);
router.patch('/:id/tokens/:tokenId/serve', serveToken);
router.delete('/:id/tokens/:tokenId', cancelToken);

export default router;
