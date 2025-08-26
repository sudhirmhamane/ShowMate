# ShowMate Backend Server

A full-stack movie ticket booking application backend built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Movie Management**: Integration with TMDB API for movie data
- **Show Scheduling**: Create and manage movie shows with pricing
- **Seat Booking**: Real-time seat selection and booking system
- **User Authentication**: Secure authentication using Clerk
- **Payment Processing**: Mock payment system (ready for real payment gateway integration)
- **Admin Panel**: Comprehensive admin dashboard and management tools
- **Real-time Updates**: Webhook integration for user synchronization

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **Background Jobs**: Inngest
- **Image Storage**: Cloudinary (configured)
- **Payment**: Mock system (Stripe ready)

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Clerk account for authentication
- TMDB API key

## 🚀 Installation

1. **Clone the repository**
   ```bash
   cd server
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp config.env.example .env
   ```
   
   Fill in your environment variables in the `.env` file:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017
   TMDB_API_KEY=your_tmdb_api_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

3. **Start the server**
   ```bash
   npm run server  # Development with nodemon
   npm start       # Production
   ```

## 📚 API Documentation

### Authentication
All protected routes require a valid Clerk authentication token in the request headers.

### Base URL
```
http://localhost:3000/api
```

### Movie Endpoints

#### Get Now Playing Movies
```http
GET /movies/now-playing
```

#### Search Movies
```http
GET /movies/search?query=movie_title
```

#### Get Movie Details
```http
GET /movies/:movieId
```

#### Get Popular Movies
```http
GET /movies/popular
```

#### Get Top Rated Movies
```http
GET /movies/top-rated
```

#### Get Upcoming Movies
```http
GET /movies/upcoming
```

#### Get Movies by Genre
```http
GET /movies/genre/:genreId
```

### Show Endpoints

#### Get All Shows
```http
GET /shows/all
```

#### Get Shows for Movie
```http
GET /shows/:movieId
```

#### Add New Show (Admin Only)
```http
POST /shows/add
Content-Type: application/json

{
  "movieId": "movie_id",
  "showInput": [
    {
      "date": "2024-01-15",
      "time": ["14:00", "17:00", "20:00"]
    }
  ],
  "showPrice": 12.99
}
```

### Booking Endpoints

#### Create Booking
```http
POST /bookings/create
Content-Type: application/json

{
  "showId": "show_id",
  "selectedSeats": ["A1", "A2"],
  "amount": 25.98
}
```

#### Get User Bookings
```http
GET /bookings/my-bookings
```

#### Cancel Booking
```http
PUT /bookings/cancel/:bookingId
```

#### Get All Bookings (Admin Only)
```http
GET /bookings/all
```

#### Update Booking Status (Admin Only)
```http
PUT /bookings/status/:bookingId
Content-Type: application/json

{
  "status": "confirmed"
}
```

### User Endpoints

#### Get User Profile
```http
GET /users/profile
```

#### Update User Profile
```http
PUT /users/profile
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "image": "profile_url"
}
```

#### Get All Users (Admin Only)
```http
GET /users/all
```

#### Delete User (Admin Only)
```http
DELETE /users/:userId
```

### Payment Endpoints

#### Process Payment
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

#### Get Payment Status
```http
GET /payments/status/:bookingId
```

#### Refund Payment (Admin Only)
```http
POST /payments/refund/:bookingId
Content-Type: application/json

{
  "reason": "Customer request"
}
```

### Admin Endpoints

#### Get Dashboard Statistics
```http
GET /admin/dashboard
```

#### Update Show
```http
PUT /admin/shows/:showId
Content-Type: application/json

{
  "showDateTime": "2024-01-15T20:00:00Z",
  "showPrice": 15.99
}
```

#### Delete Show
```http
DELETE /admin/shows/:showId
```

#### Get System Health
```http
GET /admin/health
```

## 🔐 Authentication

The backend uses Clerk for authentication. Protected routes require:

1. Valid Clerk session token
2. User role verification for admin routes

### Middleware

- `protectUser`: Ensures user is authenticated
- `protectAdmin`: Ensures user is authenticated and has admin role

## 🗄️ Database Models

### User
- `_id`: String (Clerk user ID)
- `name`: String
- `email`: String
- `image`: String

### Movie
- `_id`: String (TMDB movie ID)
- `title`: String
- `overview`: String
- `poster_path`: String
- `backdrop_path`: String
- `release_date`: String
- `genres`: Array
- `casts`: Array
- `vote_average`: Number
- `runtime`: Number

### Show
- `movie`: ObjectId (ref: Movie)
- `showDateTime`: Date
- `showPrice`: Number
- `occupiedSeats`: Object

### Booking
- `user`: String (ref: User)
- `show`: ObjectId (ref: Show)
- `bookedSeats`: Array
- `amount`: Number
- `isPaid`: Boolean
- `paymentId`: String
- `status`: String

## 🔄 Background Jobs

The backend uses Inngest for background job processing:

- **User Sync**: Automatically syncs user data from Clerk
- **User Updates**: Handles user profile updates
- **User Deletion**: Manages user data cleanup

## 🚀 Deployment

### Vercel
The backend is configured for Vercel deployment with `vercel.json`.

### Environment Variables
Ensure all required environment variables are set in your deployment platform.

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔮 Future Enhancements

- [ ] Real payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Push notifications
- [ ] Real-time seat updates with WebSocket
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Mobile app API endpoints
- [ ] Advanced caching with Redis
- [ ] Rate limiting and security enhancements
