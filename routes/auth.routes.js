import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middlewares/auth.middleware.js';
import { register, login, logout, changePassword, resetPassword, updatePassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], register);

router.post('/login', [
    body('email').isEmail(),
    body('password').exists()
], login);

router.post('/logout', authenticate, logout);

router.post('/change-password', authenticate, [
  body('currentPassword').exists(),
  body('newPassword').isLength({ min: 6 }),
], changePassword);

router.post('/reset-password', [
  body('email').isEmail(),
], resetPassword);

router.post('/update-password', [
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
], updatePassword);

export default router;