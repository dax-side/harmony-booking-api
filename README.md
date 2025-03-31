# Harmony Booking API

A comprehensive RESTful API for a music artist booking platform. This API enables users to discover and book musicians for events, while artists can manage their profiles, availability, and bookings.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Payment Processing](#payment-processing)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Recent Updates](#recent-updates)

## Features

- **User Authentication**: Register, login, and manage user profiles with JWT authentication
- **Role-Based Access Control**: Three user roles - Admin, Artist, and User (Customer)
- **Artist Profiles**: Create and manage detailed artist profiles with genres, hourly rates, and availability
- **Event Management**: Create and browse events with detailed information
- **Booking System**: Request, confirm, and manage bookings between users and artists
- **Reviews & Ratings**: Leave and view reviews for artists
- **Search & Filtering**: Find artists and events based on various criteria
- **Payment Processing**: Simulated payment processing with different payment methods

## Tech Stack

- **Node.js & Express**: Backend framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **Express Validator**: Request validation
- **Helmet**: Security headers

## Getting Started

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/harmony-booking-api.git
cd harmony-booking-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a .env file with:
```
PORT=3000
MONGODB_URI=mongodb+srv://your-mongodb-connection-string
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

## Testing

### Test Database

**Note: The following connection string is provided temporarily for evaluation purposes only and will be disabled after review. In a real production environment, connection details would never be included in documentation.**

For evaluation of this API, use the following MongoDB connection string:
```
mongodb+srv://damolaadegbite77:UA5ft5FFtvAiE5Hr@cluster0.kst2mqi.mongodb.net/harmony-booking?retryWrites=true&w=majority
```

This database is pre-populated with sample data including users, artists, events, bookings, and reviews for testing the API endpoints.

### Test User Credentials

You can use these pre-created user accounts for testing:

**Admin User:**
- Email: admin@example.com
- Password: Password123

**Artist User:**
- Email: artist@example.com
- Password: Password123

**Regular User:**
- Email: user@example.com
- Password: Password123

### Postman Collection

A Postman collection is included in the repository (`Harmony_Booking_API.postman_collection.json`). Import this collection into Postman to test all available endpoints.

The collection includes:
- Authentication requests
- Artist management (create, read, update, delete)
- Event management (create, read, update, delete)
- Booking operations
- Review functionality

## API Documentation

### Base URL
All API requests should be made to: `http://localhost:3000/api`

### Authentication Endpoints

#### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "user" // "admin", "artist", or "user"
}
```
- **Response**: User object and JWT token

#### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response**: User object and JWT token

#### Get Current User
- **URL**: `/auth/me`
- **Method**: `GET`
- **Auth**: Required
- **Response**: User profile

### Artist Endpoints

#### Get All Artists
- **URL**: `/artists`
- **Method**: `GET`
- **Query Parameters**:
  - `genre`: Filter by genre
  - `hourlyRate[lte]`: Max hourly rate
  - `sort`: Sort field (e.g., `-rating` for highest rated)
  - `select`: Fields to return
  - `page`: Page number
  - `limit`: Results per page
- **Response**: List of artists

#### Get Single Artist
- **URL**: `/artists/:id`
- **Method**: `GET`
- **Response**: Artist details

#### Create Artist Profile
- **URL**: `/artists`
- **Method**: `POST`
- **Auth**: Required (role: artist)
- **Body**:
```json
{
  "stageName": "Artist Name",
  "bio": "Professional artist with experience",
  "genres": ["Rock", "Jazz"],
  "hourlyRate": 100,
  "profileImage": "default-profile.jpg",
  "gallery": ["image1.jpg", "image2.jpg"],
  "socialLinks": {
    "website": "website.com",
    "instagram": "artist_insta",
    "twitter": "artist_twitter"
  },
  "availability": [
    {
      "date": "2023-07-15T00:00:00.000Z",
      "isAvailable": true
    }
  ]
}
```
- **Response**: Created artist profile

#### Update Artist Availability
- **URL**: `/artists/:id/availability`
- **Method**: `PUT`
- **Auth**: Required (own profile or admin)
- **Body**:
```json
{
  "availability": [
    {
      "date": "2023-07-15T00:00:00.000Z",
      "isAvailable": true
    }
  ]
}
```
- **Response**: Updated artist with availability

### Event Endpoints

#### Get All Events
- **URL**: `/events`
- **Method**: `GET`
- **Query Parameters**: Similar filtering as artists
- **Response**: List of events

#### Get Single Event
- **URL**: `/events/:id`
- **Method**: `GET`
- **Response**: Event details

#### Create Event
- **URL**: `/events`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
```json
{
  "title": "Event Title",
  "description": "Event description",
  "eventType": "wedding",
  "date": "2023-12-15T18:00:00Z",
  "duration": 4,
  "location": {
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  },
  "budget": 2000,
  "requiredGenres": ["Jazz", "Pop"]
}
```
- **Response**: Created event

### Booking Endpoints

#### Get All Bookings
- **URL**: `/bookings`
- **Method**: `GET`- **Auth**: Required
- **Response**: List of bookings (filtered by user role)

#### Get Single Booking
- **URL**: `/bookings/:id`
- **Method**: `GET`
- **Auth**: Required
- **Response**: Booking details

#### Create Booking
- **URL**: `/bookings`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
```json
{
  "artist": "artist_id_here",
  "event": "event_id_here",
  "message": "We would like to hire you for our event"
}
```
- **Response**: Created booking

#### Update Booking Status
- **URL**: `/bookings/:id/status`
- **Method**: `PUT`
- **Auth**: Required (artist being booked or admin)
- **Body**:
```json
{
  "status": "accepted" // or "rejected", "canceled", "completed"
}
```
- **Response**: Updated booking

#### Process Payment
- **URL**: `/bookings/:id/payment`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
```json
{
  "paymentMethod": "credit_card" // or "paypal", "bank_transfer", "cash"
}
```
- **Response**: Updated booking with payment information

### Review Endpoints

#### Get All Reviews for Artist
- **URL**: `/artists/:artistId/reviews`
- **Method**: `GET`
- **Response**: List of reviews for the artist

#### Create Review
- **URL**: `/artists/:artistId/reviews`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
```json
{
  "rating": 5,
  "title": "Amazing Performance",
  "text": "The artist was fantastic and professional."
}
```
- **Response**: Created review

## Database Models

### User
- **name**: String
- **email**: String (unique)
- **password**: String (hashed)
- **role**: String (enum: "admin", "artist", "user")
- **createdAt**: Date

### Artist
- **user**: Reference to User
- **stageName**: String
- **bio**: String
- **genres**: [String]
- **hourlyRate**: Number
- **profileImage**: String
- **gallery**: [String]
- **socialLinks**: Object
- **availability**: Array of date objects
- **createdAt**: Date

### Event
- **title**: String
- **description**: String
- **organizer**: Reference to User
- **eventType**: String (enum)
- **date**: Date
- **duration**: Number (hours)
- **location**: Object
- **budget**: Number
- **requiredGenres**: [String]
- **status**: String (enum)
- **createdAt**: Date

### Booking
- **user**: Reference to User
- **artist**: Reference to Artist
- **event**: Reference to Event
- **message**: String
- **status**: String (enum: "pending", "accepted", "rejected", "canceled", "completed")
- **price**: Number
- **startTime**: Date
- **endTime**: Date
- **payment**: Object
- **createdAt**: Date

### Review
- **user**: Reference to User
- **artist**: Reference to Artist
- **rating**: Number (1-5)
- **title**: String
- **text**: String
- **createdAt**: Date

## Authentication

The API uses JSON Web Tokens (JWT) for authentication. To access protected routes:

1. Login to obtain a token
2. Include the token in the Authorization header of your requests:
   `Authorization: Bearer YOUR_TOKEN_HERE`

## Payment Processing

The API includes a simulated payment system for handling booking payments. In the current implementation:

1. Users can process payments for bookings using various payment methods
2. The system updates booking status to 'confirmed' once payment is processed
3. Payment details are stored with the booking

**Supported Payment Methods**:
- Credit Card
- PayPal
- Bank Transfer
- Cash

**Note**: The current implementation simulates payment processing. In a production environment, this would be integrated with a real payment gateway like Stripe, PayPal, or Square.

## Recent Updates

### Version 1.1.0
- Added consistent error handling with appropriate HTTP status codes
- Fixed type issues with Mongoose models and controllers
- Added TypeScript support for all API components
- Improved query handling with proper type safety
- Updated Mongoose model hooks to use current supported methods

### Version 1.0.0
- Initial release of the Harmony Booking API
- Basic CRUD operations for all resources
- Authentication with JWT
- Role-based access control

## Error Handling

The API returns consistent error responses with appropriate HTTP status codes:

```json
{
  "success": false,
  "message": "Error message",
  "stack": "Error stack trace (in development mode)"
}
``` 
