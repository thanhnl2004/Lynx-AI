import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { hello, goodbye } from '../controllers/hello.controller.js';

const router = Router();

router.get('/hello', hello);
router.get('/goodbye', goodbye);
export default router;