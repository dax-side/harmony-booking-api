# Using the Harmony Booking API with Postman

This guide explains how to use the provided Postman collection to test the Harmony Booking API.

## Getting Started

### 1. Import the Collection

1. Open Postman
2. Click "Import" in the top left corner
3. Select the `Harmony_Booking_API.postman_collection.json` file
4. The collection will appear in your Postman workspace

### 2. Set Up Environment

1. Click on "Environments" in the sidebar
2. Create a new environment (e.g., "Harmony API Local")
3. Add a variable:
   - Name: `base_url`
   - Value: `http://localhost:3000/api`
4. Add a variable:
   - Name: `token`
   - Value: (leave empty for now)
5. Save the environment
6. Select this environment from the dropdown in the top right corner

## Testing Flow

Follow this sequence to test the entire API functionality:

### Step 1: Authentication

**Login**
1. Open "Auth" > "Login"
2. Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
3. Send the request
4. The token will be automatically saved to your environment

**Verify Current User**
1. Open "Auth" > "Get Current User"
2. Send the request
3. You should see your user profile

### Step 2: Browse Artists and Events

**Get All Artists**
1. Open "Artists" > "Get All Artists"
2. Send the request
3. Note down an artist ID for later

**Get All Events**
1. Open "Events" > "Get All Events"
2. Send the request
3. Note down an event ID for later

### Step 3: Update Artist Availability

To make a booking, the artist needs to be available on the event date.

1. **Switch to Artist Account**
   - Go back to "Auth" > "Login"
   - Body:
   ```json
   {
     "email": "artist1@example.com",
     "password": "password123"
   }
   ```
   - Send the request (this updates your token)

2. **Check Event Date**
   - From Step 2, note the date of the event you want to book

3. **Update Availability**
   - Open "Artists" > "Update Artist Availability"
   - Update the URL parameter with the artist ID
   - Update the request body with the correct event date:
   ```json
   {
     "availability": [
       {
         "date": "YOUR_EVENT_DATE_HERE",
         "isAvailable": true
       }
     ]
   }
   ```
   - Replace YOUR_EVENT_DATE_HERE with the event date in ISO format
   - Send the request

### Step 4: Create a Booking

1. **Switch Back to User Account**
   - Go back to "Auth" > "Login"
   - Body:
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```
   - Send the request (this updates your token)

2. **Create Booking**
   - Open "Bookings" > "Create Booking"
   - Update the request body:
   ```json
   {
     "artist": "ARTIST_ID_HERE",
     "event": "EVENT_ID_HERE",
     "message": "We would like to hire you for our event."
   }
   ```
   - Replace ARTIST_ID_HERE and EVENT_ID_HERE with actual IDs
   - Send the request
   - Note down the booking ID from the response

3. **View Your Bookings**
   - Open "Bookings" > "Get All Bookings"
   - Send the request
   - You should see your new booking

### Step 5: Update Booking Status (Artist's Perspective)

1. **Switch to Artist Account**
   - Go back to "Auth" > "Login" with artist credentials
   
2. **Update Booking Status**
   - Open "Bookings" > "Update Booking Status"
   - Update the URL parameter with the booking ID
   - Body:
   ```json
   {
     "status": "accepted"
   }
   ```
   - Send the request

### Step 6: Leave a Review

1. **Switch Back to User Account**
   - Go back to "Auth" > "Login" with user credentials
   
2. **Create Review**
   - Open "Reviews" > "Create Review"
   - Update the URL parameter with the artist ID
   - Body:
   ```json
   {
     "rating": 5,
     "title": "Amazing Performance",
     "text": "The artist was fantastic and professional. Highly recommend!"
   }
   ```
   - Send the request

3. **View Artist Reviews**
   - Open "Reviews" > "Get All Reviews for Artist"
   - Update the URL parameter with the artist ID
   - Send the request
   - You should see your review

## Troubleshooting

### Authentication Issues
- If you get a 401 Unauthorized error, your token may have expired
- Login again to get a new token
- Make sure the token is correctly saved in your environment

### Artist Not Available
- If you get an error about artist availability when creating a booking
- Make sure you've updated the artist's availability for the exact event date
- Dates must match exactly (including time)

### Data Not Found
- If you get a 404 Not Found when using an ID
- Make sure you're using a valid ID from a previous request
- IDs are case-sensitive and must be exact

## Advanced Usage

### Filtering and Pagination

Many endpoints support filtering and pagination:

- **Filtering Example**:
  `/artists?genres=Jazz&hourlyRate[lte]=200`
  
- **Pagination Example**:
  `/artists?page=1&limit=10`
  
- **Sorting Example**:
  `/artists?sort=-rating` (descending by rating)
  
- **Field Selection Example**:
  `/artists?select=stageName,bio,hourlyRate`

### Adding Query Parameters in Postman

1. Open the request
2. Go to the "Params" tab
3. Add your key-value pairs
4. Send the request 