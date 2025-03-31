import { Request, Response, NextFunction } from 'express';
import Review from '../models/review.model';
import Booking from '../models/booking.model';
import { ErrorResponse } from '../middlewares/error.middleware';

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reviews = await Review.find()
      .populate({
        path: 'user',
        select: 'name',
      })
      .populate({
        path: 'artist',
        select: 'stageName',
      })
      .populate({
        path: 'booking',
        select: 'event',
        populate: {
          path: 'event',
          select: 'title',
        },
      });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
export const getReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name',
      })
      .populate({
        path: 'artist',
        select: 'stageName',
      })
      .populate({
        path: 'booking',
        select: 'event',
        populate: {
          path: 'event',
          select: 'title',
        },
      });

    if (!review) {
      return next(
        new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check if the booking exists
    const booking = await Booking.findById(req.body.booking);
    if (!booking) {
      return next(new ErrorResponse(`Booking not found`, 404));
    }

    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`Not authorized to create a review for this booking`, 401)
      );
    }

    // Check if the booking is completed
    if (booking.status !== 'completed') {
      return next(
        new ErrorResponse(`Can only review completed bookings`, 400)
      );
    }

    // Add artist from booking to the review
    req.body.artist = booking.artist;

    // Check if user already reviewed this booking
    const existingReview = await Review.findOne({
      user: req.user.id,
      booking: req.body.booking,
    });

    if (existingReview) {
      return next(
        new ErrorResponse(`User has already reviewed this booking`, 400)
      );
    }

    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(
        new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is review owner or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`User ${req.user.id} is not authorized to delete this review`, 401)
      );
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
}; 