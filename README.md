# JuicyCryptoMarket.com
A cryptocurrency broker platform with secure user authentication

## Features

- 🔐 **User Registration**: Create accounts with email and password
- 🔑 **User Login**: Secure authentication with JWT tokens
- 🛡️ **Password Security**: Bcrypt hashing for password storage
- ✅ **Form Validation**: Client-side and server-side validation
- 📊 **Protected Routes**: JWT-based authentication middleware
- 🎨 **Modern UI**: Clean and responsive design
- 💾 **Database Integration**: MongoDB for secure user data storage

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication tokens
- **Bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

### Frontend
- **HTML5** for structure
- **CSS3** for styling
- **Vanilla JavaScript** for interactivity
- **Fetch API** for backend communication

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or remote instance)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Laymanlin/JuicyCryptoMarket.com.git
   cd JuicyCryptoMarket.com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your settings:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/juicycrypto
   JWT_SECRET=your_secure_jwt_secret_here
   JWT_EXPIRES_IN=7d
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env with your Atlas connection string
   ```

5. **Run the application**
   ```bash
   npm start
   ```

6. **Access the application**
   
   Open your browser and navigate to: `http://localhost:3000`

## Usage

### User Registration
1. Navigate to the registration page
2. Enter your email address
3. Create a password (minimum 6 characters)
4. Confirm your password
5. Click "Register"
6. Upon success, you'll be redirected to the dashboard

### User Login
1. Navigate to the login page
2. Enter your registered email and password
3. Click "Login"
4. Upon success, you'll receive a JWT token and be redirected to the dashboard

### Dashboard
- View your account information
- Access protected features
- Logout when finished

## API Endpoints

### Authentication Routes

#### Register User
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

#### Verify Token
```
GET /api/auth/verify
Authorization: Bearer jwt_token_here

Response:
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Both client-side and server-side validation
- **HTTPS Ready**: Application is ready for HTTPS in production
- **XSS Protection**: Input sanitization to prevent cross-site scripting
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Rate Limiting**: Protection against brute force attacks (5 auth attempts per 15 minutes)

## Project Structure

```
JuicyCryptoMarket.com/
├── models/
│   └── User.js              # User model with bcrypt integration
├── routes/
│   └── auth.js              # Authentication routes
├── public/
│   ├── index.html           # Home page
│   ├── register.html        # Registration page
│   ├── login.html           # Login page
│   ├── dashboard.html       # Protected dashboard page
│   ├── styles.css           # Shared styles
│   ├── register.js          # Registration logic
│   ├── login.js             # Login logic
│   └── dashboard.js         # Dashboard logic
├── server.js                # Express server setup
├── package.json             # Dependencies
├── .env.example             # Environment variables template
└── .gitignore               # Git ignore rules
```

## Deployment

### Heroku Deployment

1. **Create a Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Add MongoDB addon**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

3. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your_secret_here
   heroku config:set JWT_EXPIRES_IN=7d
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Environment Variables for Production

Ensure these are set in your production environment:
- `PORT`: Server port (usually set by hosting provider)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Strong secret key for JWT signing
- `JWT_EXPIRES_IN`: Token expiration time

## Testing

To test the authentication system:

1. **Register a new user**
   - Go to registration page
   - Fill in email and password
   - Verify success message and redirect

2. **Login with credentials**
   - Go to login page
   - Enter registered credentials
   - Verify JWT token is stored

3. **Access protected route**
   - Navigate to dashboard
   - Verify authentication check
   - Test logout functionality

4. **Test error cases**
   - Try registering with existing email
   - Try logging in with wrong password
   - Try accessing dashboard without token

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the terms specified in the LICENSE file.

## Support

For issues or questions, please open an issue on GitHub.
