import mongoose, { Document, Schema } from 'mongoose';

export interface IArtist extends Document {
  user: mongoose.Types.ObjectId;
  stageName: string;
  bio: string;
  genres: string[];
  hourlyRate: number;
  profileImage: string;
  gallery: string[];
  socialLinks: {
    website?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    spotify?: string;
  };
  availability: {
    date: Date;
    isAvailable: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ArtistSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stageName: {
      type: String,
      required: [true, 'Please add a stage name'],
    },
    bio: {
      type: String,
      required: [true, 'Please add a bio'],
    },
    genres: {
      type: [String],
      required: [true, 'Please add at least one genre'],
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Please add your hourly rate'],
    },
    profileImage: {
      type: String,
      default: 'default-profile.jpg',
    },
    gallery: {
      type: [String],
      default: [],
    },
    socialLinks: {
      website: String,
      instagram: String,
      twitter: String,
      facebook: String,
      youtube: String,
      spotify: String,
    },
    availability: [
      {
        date: {
          type: Date,
          required: true,
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent user from creating more than one artist profile
ArtistSchema.index({ user: 1 }, { unique: true });

export default mongoose.model<IArtist>('Artist', ArtistSchema); 