import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model';
import Artist from '../models/artist.model';
import Event from '../models/event.model';
import { connectDB } from '../config/db';

// Load env vars
dotenv.config();

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'John Artist',
    email: 'artist1@example.com',
    password: 'password123',
    role: 'artist',
  },
  {
    name: 'Jane Artist',
    email: 'artist2@example.com',
    password: 'password123',
    role: 'artist',
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
  },
];

const artists = [
  {
    user: null, // Will be set after user creation
    stageName: 'John Doe',
    bio: 'Professional guitarist with 10 years of experience',
    genres: ['Rock', 'Pop'],
    hourlyRate: 100,
    profileImage: 'default-profile.jpg',
    gallery: ['image1.jpg', 'image2.jpg'],
    socialLinks: {
      website: 'johndoe.com',
      instagram: 'johndoe_music',
      twitter: 'johndoe_official',
      facebook: 'johndoemusic',
      youtube: 'johndoemusic',
      spotify: 'johndoe',
    },
    availability: [
      {
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        isAvailable: true,
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        isAvailable: true,
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        isAvailable: true,
      },
    ],
  },
  {
    user: null, // Will be set after user creation
    stageName: 'Jane Smith',
    bio: 'Award-winning jazz vocalist and pianist',
    genres: ['Jazz', 'Blues'],
    hourlyRate: 150,
    profileImage: 'default-profile.jpg',
    gallery: ['image3.jpg', 'image4.jpg'],
    socialLinks: {
      website: 'janesmith.com',
      instagram: 'janesmith_music',
      twitter: 'janesmith_official',
      facebook: 'janesmithmusic',
      youtube: 'janesmithmusic',
      spotify: 'janesmith',
    },
    availability: [
      {
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        isAvailable: true,
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        isAvailable: true,
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        isAvailable: true,
      },
    ],
  },
];

const events = [
  {
    title: 'Wedding Reception',
    description: 'Elegant wedding reception requiring live music',
    organizer: null, // Will be set after user creation
    eventType: 'wedding',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    duration: 4, // hours
    location: {
      address: '123 Plaza Street',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    budget: 2000,
    requiredGenres: ['Jazz', 'Pop'],
    status: 'published'
  },
  {
    title: 'Corporate Gala',
    description: 'Annual corporate celebration with live entertainment',
    organizer: null, // Will be set after user creation
    eventType: 'corporate',
    date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    duration: 5, // hours
    location: {
      address: '456 Ritz Blvd',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      zipCode: '90001',
      coordinates: {
        lat: 34.0522,
        lng: -118.2437
      }
    },
    budget: 3000,
    requiredGenres: ['Classical', 'Jazz'],
    status: 'published'
  }
];

// Import into DB
const importData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Artist.deleteMany({});
    await Event.deleteMany({});
    
    console.log('Database cleared');
    
    // Create users
    const createdUsers = await User.create(users);
    console.log('Users imported');
    
    // Link artists with different users
    const artist1User = createdUsers.find(user => user.email === 'artist1@example.com');
    const artist2User = createdUsers.find(user => user.email === 'artist2@example.com');
    
    if (artist1User) {
      artists[0].user = artist1User._id;
    }

    if (artist2User) {
      artists[1].user = artist2User._id;
    }
    
    // Create artists
    const createdArtists = await Artist.create(artists);
    console.log('Artists imported');
    
    // Link events with user
    const regularUser = createdUsers.find(user => user.email === 'user@example.com');
    
    if (regularUser) {
      events[0].organizer = regularUser._id;
      events[1].organizer = regularUser._id;
    }
    
    // Create events
    await Event.create(events);
    console.log('Events imported');
    
    console.log('Data import complete!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();
    
    await User.deleteMany({});
    await Artist.deleteMany({});
    await Event.deleteMany({});
    
    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error('Error deleting data:', error);
    process.exit(1);
  }
};

// Run with argument
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please add proper argument: -i (import) or -d (delete)');
  process.exit();
} 