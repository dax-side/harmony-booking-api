import express from 'express';
import {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
  getArtistReviews,
  getArtistAvailability,
  updateArtistAvailability,
} from '../controllers/artist.controller';
import { protect, isArtist } from '../middlewares/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';

const router = express.Router();

// Artist validation
const artistValidation = [
  body('stageName').not().isEmpty().withMessage('Stage name is required'),
  body('bio').not().isEmpty().withMessage('Bio is required'),
  body('genres').isArray().withMessage('Genres must be an array'),
  body('hourlyRate').isNumeric().withMessage('Hourly rate must be a number'),
];

// Availability validation
const availabilityValidation = [
  body('availability').isArray().withMessage('Availability must be an array'),
  body('availability.*.date').isISO8601().withMessage('Date must be valid ISO8601 date format'),
  body('availability.*.isAvailable').isBoolean().withMessage('isAvailable must be a boolean'),
];

router.route('/')
  .get(getArtists)
  .post(protect, artistValidation, validate, createArtist);

router.route('/:id')
  .get(getArtist)
  .put(protect, artistValidation, validate, updateArtist)
  .delete(protect, deleteArtist);

router.route('/:id/reviews').get(getArtistReviews);

router.route('/:id/availability')
  .get(getArtistAvailability)
  .put(protect, isArtist, availabilityValidation, validate, updateArtistAvailability);

export default router; 