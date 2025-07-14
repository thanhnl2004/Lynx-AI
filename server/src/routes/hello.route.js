import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { hello } from '../controllers/hello.controller.js';

const router = Router();
router.use(requireAuth);
router.get('/', hello);
export default router;