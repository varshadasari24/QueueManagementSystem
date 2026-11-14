import express from 'express';

import { loginManager, registerManager } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerManager);
router.post('/login', loginManager);

export default router;
