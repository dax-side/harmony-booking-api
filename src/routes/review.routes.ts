import express from 'express';
import {
  getReviews,
  getReview,
  createReview,
  deleteReview,
} from '../controllers/review.controller';
import { protect, isAdmin } from '../middlewares/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';

const router = express.Router();

// Review validation
const reviewValidation = [
  body('booking').isMongoId().withMessage('Booking ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('text')
    .isLength({ min: 5, max: 500 })
    .withMessage('Review text must be between 5 and 500 characters'),
];

router.route('/')
  .get(protect, isAdmin, getReviews)
  .post(protect, reviewValidation, validate, createReview);

router.route('/:id')
  .get(getReview)
  .delete(protect, deleteReview);

export default router; 