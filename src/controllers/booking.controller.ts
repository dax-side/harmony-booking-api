import { Request, Response, NextFunction } from 'express';
import Booking from '../models/booking.model';
import Event from '../models/event.model';
import Artist from '../models/artist.model';
import { ErrorResponse } from '../middlewares/error.middleware';

// @desc    Get bookings
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let query: any;

    // If user is an admin, get all bookings
    if (req.user.role === 'admin') {
      query = Booking.find();
    } else {
      // If user is an artist, find bookings where they are the artist
      // or if they're a regular user, find bookings they created
      query = Booking.find({
        $or: [{ user: req.user.id }, { artist: req.user.id }],
      });
    }

    // Add standard query functionality
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Filtering
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = query.find(JSON.parse(queryStr)) as any;

    // Select fields
    if (req.query.select) {
      const fields = (req.query.select as string).split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Booking.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Populate
    query = query.populate([
      { path: 'event', select: 'title date location' },
      { path: 'artist', select: 'stageName hourlyRate' },
      { path: 'user', select: 'name email' },
    ]);

    // Execute query
    const bookings = await query;

    // Pagination result
    const pagination: any = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      pagination,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id).populate([
      { path: 'event', select: 'title date location' },
      { path: 'artist', select: 'stageName hourlyRate' },
      { path: 'user', select: 'name email' },
    ]);

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is booking owner, the booked artist, or admin
    if (
      booking.user.toString() !== req.user.id &&
      booking.artist.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(`Not authorized to access this booking`, 401)
      );
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check if the event exists
    const event = await Event.findById(req.body.event);
    if (!event) {
      return next(new ErrorResponse(`Event not found`, 404));
    }

    // Check if the artist exists
    const artist = await Artist.findById(req.body.artist);
    if (!artist) {
      return next(new ErrorResponse(`Artist not found`, 404));
    }

    // Check if this is a duplicate booking (same artist, same event)
    const existingBooking = await Booking.findOne({
      event: req.body.event,
      artist: req.body.artist,
    });

    if (existingBooking) {
      return next(
        new ErrorResponse(
          `This artist is already booked for this event`,
          400
        )
      );
    }

    // Check if artist is available on the event date
    const eventDate = new Date(event.date);
    const isAvailable = artist.availability.some(
      slot => {
        const slotDate = new Date(slot.date);
        return (
          slotDate.getFullYear() === eventDate.getFullYear() &&
          slotDate.getMonth() === eventDate.getMonth() &&
          slotDate.getDate() === eventDate.getDate() &&
          slot.isAvailable
        );
      }
    );

    if (!isAvailable) {
      return next(
        new ErrorResponse(`Artist is not available on this date`, 400)
      );
    }

    // Calculate price based on artist's hourly rate and event duration
    const price = artist.hourlyRate * event.duration;
    req.body.price = price;

    // Set start and end times based on event
    req.body.startTime = event.date;
    const endDate = new Date(event.date);
    endDate.setHours(endDate.getHours() + event.duration);
    req.body.endTime = endDate;

    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
      );
    }

    // Check authorization
    // Only the booking creator, the artist, or an admin can update the booking
    if (
      booking.user.toString() !== req.user.id &&
      booking.artist.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(`Not authorized to update this booking`, 401)
      );
    }

    // Update only the status field
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedBooking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
      );
    }

    // Only the booking creator or admin can cancel
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`Not authorized to cancel this booking`, 401)
      );
    }

    // Update booking status to canceled
    booking.status = 'canceled';
    await booking.save();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Booking has been canceled',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Process payment for booking
// @route   POST /api/bookings/:id/payment
// @access  Private
export const processPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if booking belongs to the user
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`Not authorized to process payment for this booking`, 401)
      );
    }

    // Check if booking is already paid
    if (booking.payment.paymentStatus === 'completed') {
      return next(new ErrorResponse(`Payment has already been completed`, 400));
    }

    // Process payment (this would typically integrate with a payment gateway)
    // For this exercise, we'll just simulate a successful payment
    booking.payment = {
      paymentMethod: req.body.paymentMethod,
      paymentStatus: 'completed',
      transactionId: `txn_${Date.now()}`,
      paidAt: new Date(),
    };

    // Once payment is successful, confirm the booking
    booking.status = 'confirmed';
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Payment processed successfully',
    });
  } catch (err) {
    next(err);
  }
}; 