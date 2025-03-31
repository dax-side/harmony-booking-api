import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  event: mongoose.Types.ObjectId;
  artist: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
  price: number;
  startTime: Date;
  endTime: Date;
  notes?: string;
  payment: {
    paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';
    paymentStatus: 'pending' | 'completed' | 'refunded' | 'failed';
    transactionId?: string;
    paidAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'canceled', 'completed'],
      default: 'pending',
    },
    price: {
      type: Number,
      required: [true, 'Please specify the booking price'],
    },
    startTime: {
      type: Date,
      required: [true, 'Please specify the start time'],
    },
    endTime: {
      type: Date,
      required: [true, 'Please specify the end time'],
    },
    notes: {
      type: String,
    },
    payment: {
      paymentMethod: {
        type: String,
        enum: ['credit_card', 'paypal', 'bank_transfer', 'cash'],
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'refunded', 'failed'],
        default: 'pending',
      },
      transactionId: {
        type: String,
      },
      paidAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Enforce uniqueness for event-artist combinations
BookingSchema.index({ event: 1, artist: 1 }, { unique: true });

// Additional indexes for query optimization
BookingSchema.index({ user: 1, status: 1 });
BookingSchema.index({ artist: 1, status: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema); 