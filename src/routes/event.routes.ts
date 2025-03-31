import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/event.controller';
import { protect } from '../middlewares/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';

const router = express.Router();

// Event validation
const eventValidation = [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('description').not().isEmpty().withMessage('Description is required'),
  body('eventType')
    .isIn(['concert', 'wedding', 'corporate', 'festival', 'private', 'other'])
    .withMessage('Invalid event type'),
  body('date').isISO8601().withMessage('Date must be valid ISO8601 date format'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('location.address').not().isEmpty().withMessage('Address is required'),
  body('location.city').not().isEmpty().withMessage('City is required'),
  body('location.state').not().isEmpty().withMessage('State is required'),
  body('location.country').not().isEmpty().withMessage('Country is required'),
  body('location.zipCode').not().isEmpty().withMessage('Zip code is required'),
  body('budget').isNumeric().withMessage('Budget must be a number'),
];

router.route('/')
  .get(getEvents)
  .post(protect, eventValidation, validate, createEvent);

router.route('/:id')
  .get(getEvent)
  .put(protect, eventValidation, validate, updateEvent)
  .delete(protect, deleteEvent);

export default router; 