import express from 'express';
import UserController from '../controllers/UserController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

// GET /api/users/me
router.get('/me', authenticate, authorize([]), UserController.getMe);

// PUT /api/users/me
router.put('/me', authenticate, authorize([]), UserController.updateMe);

// GET /api/users
router.get('/', authenticate, authorize(['admin']), UserController.getAll);

// GET /api/users/:id
router.get('/:id', authenticate, authorize(['admin']), UserController.getById);

export default router;