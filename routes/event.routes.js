import express from 'express';
import { body } from 'express-validator';
import { createEvent, inviteUsers, listEvents, getEventDetails, updateEvent } from '../controllers/event.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, [
  body('title').notEmpty(),
  body('date').isISO8601()
], createEvent);

router.post('/:id/invite', authenticate, [
  body('emails').isArray({ min: 1 })
], inviteUsers);

router.get('/', authenticate, listEvents);

router.get('/:id', authenticate, getEventDetails);

router.put('/:id', authenticate, updateEvent);

export default router;
