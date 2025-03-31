import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  booking: mongoose.Types.ObjectId;
  artist: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
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
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please add a rating between 1 and 5'],
    },
    text: {
      type: String,
      required: [true, 'Please add review text'],
      trim: true,
      maxlength: [500, 'Review cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per booking
ReviewSchema.index({ booking: 1, user: 1 }, { unique: true });

// Static method to get average rating and save
ReviewSchema.statics.getAverageRating = async function (artistId) {
  const obj = await this.aggregate([
    {
      $match: { artist: artistId },
    },
    {
      $group: {
        _id: '$artist',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
};

// Call getAverageRating after save
ReviewSchema.post('save', function () {
  // @ts-ignore
  this.constructor.getAverageRating(this.artist);
});

// Call getAverageRating after findOneAndDelete
ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    // @ts-ignore
    await doc.constructor.getAverageRating(doc.artist);
  }
});

// Add a pre middleware for the document's deleteOne method
ReviewSchema.pre('deleteOne', { document: true, query: false }, async function() {
  // @ts-ignore
  await this.constructor.getAverageRating(this.artist);
});

export default mongoose.model<IReview>('Review', ReviewSchema); 