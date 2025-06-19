import express from 'express';
import { loginAdmin, registerAdmin } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/login', loginAdmin);

// One-time use route to register an admin (remove later in production)
router.post('/register', registerAdmin);

export default router;
