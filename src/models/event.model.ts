import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  organizer: mongoose.Types.ObjectId;
  eventType: 'concert' | 'wedding' | 'corporate' | 'festival' | 'private' | 'other';
  date: Date;
  duration: number; // in hours
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  budget: number;
  requiredGenres?: string[];
  status: 'draft' | 'published' | 'canceled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventType: {
      type: String,
      required: [true, 'Please specify the event type'],
      enum: ['concert', 'wedding', 'corporate', 'festival', 'private', 'other'],
    },
    date: {
      type: Date,
      required: [true, 'Please add an event date'],
    },
    duration: {
      type: Number,
      required: [true, 'Please specify the event duration in hours'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please add an address'],
      },
      city: {
        type: String,
        required: [true, 'Please add a city'],
      },
      state: {
        type: String,
        required: [true, 'Please add a state'],
      },
      country: {
        type: String,
        required: [true, 'Please add a country'],
      },
      zipCode: {
        type: String,
        required: [true, 'Please add a zip code'],
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    budget: {
      type: Number,
      required: [true, 'Please specify your budget'],
    },
    requiredGenres: {
      type: [String],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'canceled', 'completed'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

// Add index for improved search performance
EventSchema.index({ eventType: 1, date: -1 });
EventSchema.index({ 'location.city': 1, 'location.state': 1 });

export default mongoose.model<IEvent>('Event', EventSchema); 