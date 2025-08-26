# ShowMate API Documentation

## Overview
The ShowMate API provides endpoints for managing movies, shows, bookings, users, and payments in a movie ticket booking system.

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a valid Clerk authentication token in the request headers:
```
Authorization: Bearer <clerk_token>
```

## Response Format
All API responses follow this standard format:
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "statusCode": 200,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "error": "Detailed error information (development only)",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🎬 Movie Endpoints

### 1. Get Now Playing Movies
```http
GET /movies/now-playing
```

**Response:**
```json
{
  "success": true,
  "movies": [
    {
      "id": 123,
      "title": "Movie Title",
      "overview": "Movie description...",
      "poster_path": "/path/to/poster.jpg",
      "backdrop_path": "/path/to/backdrop.jpg",
      "release_date": "2024-01-15",
      "vote_average": 8.5,
      "runtime": 120
    }
  ]
}
```

### 2. Search Movies
```http
GET /movies/search?query=movie_title
```

**Parameters:**
- `query` (required): Search term (min 2 characters)

**Response:**
```json
{
  "success": true,
  "movies": [
    {
      "id": 123,
      "title": "Movie Title",
      "overview": "Movie description...",
      "poster_path": "/path/to/poster.jpg",
      "backdrop_path": "/path/to/backdrop.jpg",
      "release_date": "2024-01-15",
      "vote_average": 8.5,
      "runtime": 120
    }
  ]
}
```

### 3. Get Movie Details
```http
GET /movies/:movieId
```

**Response:**
```json
{
  "success": true,
  "movie": {
    "_id": "123",
    "title": "Movie Title",
    "overview": "Movie description...",
    "poster_path": "/path/to/poster.jpg",
    "backdrop_path": "/path/to/backdrop.jpg",
    "release_date": "2024-01-15",
    "original_language": "en",
    "tagline": "Movie tagline",
    "genres": [
      {
        "id": 28,
        "name": "Action"
      }
    ],
    "casts": [
      {
        "id": 123,
        "name": "Actor Name",
        "character": "Character Name"
      }
    ],
    "vote_average": 8.5,
    "runtime": 120,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Get Popular Movies
```http
GET /movies/popular
```

### 5. Get Top Rated Movies
```http
GET /movies/top-rated
```

### 6. Get Upcoming Movies
```http
GET /movies/upcoming
```

### 7. Get Movies by Genre
```http
GET /movies/genre/:genreId
```

---

## 🎭 Show Endpoints

### 1. Get All Shows
```http
GET /shows/all
```

**Response:**
```json
{
  "success": true,
  "shows": [
    {
      "_id": "show_id",
      "movie": {
        "_id": "123",
        "title": "Movie Title",
        "poster_path": "/path/to/poster.jpg"
      },
      "showDateTime": "2024-01-15T20:00:00.000Z",
      "showPrice": 12.99,
      "occupiedSeats": {}
    }
  ]
}
```

### 2. Get Shows for Movie
```http
GET /shows/:movieId
```

**Response:**
```json
{
  "success": true,
  "movie": {
    "_id": "123",
    "title": "Movie Title",
    "poster_path": "/path/to/poster.jpg"
  },
  "dateTime": {
    "2024-01-15": [
      {
        "time": "2024-01-15T14:00:00.000Z",
        "showId": "show_id_1"
      },
      {
        "time": "2024-01-15T17:00:00.000Z",
        "showId": "show_id_2"
      }
    ]
  }
}
```

### 3. Add New Show (Admin Only)
```http
POST /shows/add
Content-Type: application/json

{
  "movieId": "123",
  "showInput": [
    {
      "date": "2024-01-15",
      "time": ["14:00", "17:00", "20:00"]
    }
  ],
  "showPrice": 12.99
}
```

**Response:**
```json
{
  "success": true,
  "message": "Show Added Successfully!"
}
```

---

## 🎫 Booking Endpoints

### 1. Create Booking
```http
POST /bookings/create
Content-Type: application/json

{
  "showId": "show_id",
  "selectedSeats": ["A1", "A2"],
  "amount": 25.98
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "_id": "booking_id",
    "user": "user_id",
    "show": "show_id",
    "bookedSeats": ["A1", "A2"],
    "amount": 25.98,
    "isPaid": false,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Get User Bookings
```http
GET /bookings/my-bookings
```

**Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "_id": "booking_id",
      "show": {
        "_id": "show_id",
        "movie": {
          "_id": "123",
          "title": "Movie Title",
          "poster_path": "/path/to/poster.jpg",
          "runtime": 120
        },
        "showDateTime": "2024-01-15T20:00:00.000Z"
      },
      "bookedSeats": ["A1", "A2"],
      "amount": 25.98,
      "isPaid": false,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 3. Cancel Booking
```http
PUT /bookings/cancel/:bookingId
```

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

### 4. Get All Bookings (Admin Only)
```http
GET /bookings/all
```

### 5. Update Booking Status (Admin Only)
```http
PUT /bookings/status/:bookingId
Content-Type: application/json

{
  "status": "confirmed"
}
```

---

## 👤 User Endpoints

### 1. Get User Profile
```http
GET /users/profile
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://example.com/profile.jpg"
  }
}
```

### 2. Update User Profile
```http
PUT /users/profile
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "image": "https://example.com/profile.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://example.com/profile.jpg"
  }
}
```

### 3. Get All Users (Admin Only)
```http
GET /users/all
```

### 4. Delete User (Admin Only)
```http
DELETE /users/:userId
```

---

## 💳 Payment Endpoints

### 1. Process Payment
```http
POST /payments/process
Content-Type: application/json

{
  "bookingId": "booking_id",
  "paymentMethod": "card",
  "paymentDetails": {
    "cardNumber": "4242424242424242",
    "expiryMonth": "12",
    "expiryYear": "2025",
    "cvv": "123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "paymentId": "pay_123456789",
  "booking": {
    "_id": "booking_id",
    "isPaid": true,
    "paymentId": "pay_123456789",
    "status": "confirmed"
  }
}
```

### 2. Get Payment Status
```http
GET /payments/status/:bookingId
```

**Response:**
```json
{
  "success": true,
  "isPaid": true,
  "paymentId": "pay_123456789",
  "status": "confirmed"
}
```

### 3. Refund Payment (Admin Only)
```http
POST /payments/refund/:bookingId
Content-Type: application/json

{
  "reason": "Customer request"
}
```

---

## 🔧 Admin Endpoints

### 1. Get Dashboard Statistics
```http
GET /admin/dashboard
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "totalMovies": 25,
    "totalShows": 100,
    "totalBookings": 75,
    "totalRevenue": 1250.50,
    "monthlyRevenue": 450.25
  },
  "recentBookings": [
    {
      "_id": "booking_id",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "show": {
        "movie": {
          "title": "Movie Title"
        }
      },
      "amount": 25.98,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 2. Update Show
```http
PUT /admin/shows/:showId
Content-Type: application/json

{
  "showDateTime": "2024-01-15T20:00:00Z",
  "showPrice": 15.99
}
```

### 3. Delete Show
```http
DELETE /admin/shows/:showId
```

### 4. Get System Health
```http
GET /admin/health
```

**Response:**
```json
{
  "success": true,
  "health": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 3600,
    "database": "connected"
  }
}
```

---

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🔒 Rate Limiting

The API implements rate limiting to prevent abuse:
- General endpoints: 100 requests per minute
- Authentication endpoints: 10 requests per minute
- Admin endpoints: 50 requests per minute

## 📝 Error Handling

All errors are returned with appropriate HTTP status codes and descriptive messages. In development mode, additional error details are included.

## 🔄 Webhooks

The API supports webhooks for real-time updates:
- User creation/deletion/updates
- Booking confirmations
- Payment status changes

## 📱 Mobile Support

All endpoints are optimized for mobile applications with consistent response formats and efficient data structures.

---

## 🚀 Getting Started

1. Set up your environment variables
2. Install dependencies: `npm install`
3. Start the server: `npm run server`
4. Test the API endpoints using the examples above

## 🧪 Testing

Use tools like Postman, Insomnia, or curl to test the API endpoints. Remember to include authentication tokens for protected routes.

## 📞 Support

For API support and questions, please refer to the main README or create an issue in the repository.
