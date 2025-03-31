import { Request, Response, NextFunction } from 'express';
import Artist from '../models/artist.model';
import Review from '../models/review.model';
import { ErrorResponse } from '../middlewares/error.middleware';

// @desc    Get all artists
// @route   GET /api/artists
// @access  Public
export const getArtists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let query: any = Artist.find(JSON.parse(queryStr)).populate('user', 'name');

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
    const total = await Artist.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const artists = await query;

    // Format response data to make IDs more user-friendly
    const formattedArtists = artists.map(artist => {
      const artistData = artist.toObject();
      return {
        artistId: artist._id,
        ...artistData
      };
    });

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
      count: artists.length,
      pagination,
      data: formattedArtists,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single artist
// @route   GET /api/artists/:id
// @access  Public
export const getArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const artist = await Artist.findById(req.params.id).populate('user', 'name');

    if (!artist) {
      return next(
        new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404)
      );
    }

    // Format response to include clear artistId
    const artistData = artist.toObject();
    const formattedArtist = {
      artistId: artist._id,
      ...artistData
    };

    res.status(200).json({
      success: true,
      data: formattedArtist,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new artist
// @route   POST /api/artists
// @access  Private
export const createArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check for existing artist
    const existingArtist = await Artist.findOne({ user: req.user.id });

    // If the user is not an admin, they can only add one artist profile
    if (existingArtist && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`User ${req.user.id} already has an artist profile`, 400)
      );
    }

    const artist = await Artist.create(req.body);

    res.status(201).json({
      success: true,
      data: artist,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update artist
// @route   PUT /api/artists/:id
// @access  Private
export const updateArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let artist = await Artist.findById(req.params.id);

    if (!artist) {
      return next(
        new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is artist owner or admin
    if (artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`User ${req.user.id} is not authorized to update this artist`, 401)
      );
    }

    artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: artist,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete artist
// @route   DELETE /api/artists/:id
// @access  Private
export const deleteArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return next(
        new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is artist owner or admin
    if (artist.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(`User ${req.user.id} is not authorized to delete this artist`, 401)
      );
    }

    await artist.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get artist reviews
// @route   GET /api/artists/:id/reviews
// @access  Public
export const getArtistReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reviews = await Review.find({ artist: req.params.id }).populate({
      path: 'user',
      select: 'name',
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

// @desc    Get artist availability
// @route   GET /api/artists/:id/availability
// @access  Public
export const getArtistAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return next(
        new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: artist?.availability || [],
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update artist availability
// @route   PUT /api/artists/:id/availability
// @access  Private
export const updateArtistAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let artist = await Artist.findById(req.params.id);

    if (!artist) {
      return next(
        new ErrorResponse(`Artist not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is artist owner
    if (artist.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update availability for this artist`,
          401
        )
      );
    }

    artist = await Artist.findByIdAndUpdate(
      req.params.id,
      { availability: req.body.availability },
      {
        new: true,
        runValidators: true,
      }
    );

    // Add explicit null check
    if (!artist) {
      return next(
        new ErrorResponse(`Artist not found after update with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: artist.availability || [],
    });
  } catch (err) {
    next(err);
  }
}; 