import express from 'express';
import {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  processPayment,
} from '../controllers/booking.controller';
import { protect } from '../middlewares/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';

const router = express.Router();

// Booking validation
const bookingValidation = [
  body('event').isMongoId().withMessage('Event ID is required'),
  body('artist').isMongoId().withMessage('Artist ID is required'),
  body('notes').optional().trim().escape(),
];

// Status validation
const statusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'canceled', 'completed'])
    .withMessage('Invalid status'),
];

// Payment validation
const paymentValidation = [
  body('paymentMethod')
    .isIn(['credit_card', 'paypal', 'bank_transfer', 'cash'])
    .withMessage('Invalid payment method'),
];

router.route('/')
  .get(protect, getBookings)
  .post(protect, bookingValidation, validate, createBooking);

router.route('/:id')
  .get(protect, getBooking)
  .put(protect, statusValidation, validate, updateBooking)
  .delete(protect, cancelBooking);

router.route('/:id/payment')
  .post(protect, paymentValidation, validate, processPayment);

export default router;