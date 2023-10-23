require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT||5511; // Change to your desired port

app.use(cors());
app.use(bodyParser.json());

const mongoURL = process.env.MONGO_URI

// Connect to MongoDB
mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

// Define Mongoose Schemas
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  phoneNumber: String,
  address: String,
  pincode: String,
  dateOfBirth: Date,
  name: String,
}, { collection: 'users' }); // Specify collection name manually

const User = mongoose.model('User', userSchema);

const bookingSchema = new mongoose.Schema({
  checkin: Date,
  checkout: Date,
  adult: Number,
  children: Number,
  email: String,
}, { collection: 'bookings' }); // Specify collection name manually

const Booking = mongoose.model('Booking', bookingSchema);

// Routes

app.get('/', (req, res) => {
  res.send('Welcome to the server');
});

// Create a new user
app.post('/sendData', async (req, res) => {
  const { email, password, phoneNumber, address, pincode, dateOfBirth, name } = req.body;
  // Create a new user document
  const newUser = new User({
    email,
    password,
    phoneNumber,
    address,
    pincode,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date('1991-01-01'),
    name,
  });

  try {
    await newUser.save();
    console.log('User data inserted successfully');
    res.status(200).json({ message: 'User data received and inserted successfully' });
  } catch (err) {
    console.error('User data insertion error: ' + err.message);
    res.status(500).json({ error: 'User data insertion error' });
  }
});
app.post('/checkLogin', async (req, res) => {
  const { email, password } = req.body;

  // Add your authentication logic here to check if the provided email and password are valid.
  // For example, you can query the 'User' model in the database to validate the user's credentials.

  User.findOne({ email, password }, (err, user) => {
    if (err) {
      console.error('Database query error: ' + err.message);
      res.status(500).json({ error: 'Database query error' });
    } else if (user) {
      // User authentication is successful
      res.status(200).json({ message: 'Login successful', data: user });
    } else {
      // Invalid email or password
      res.status(401).json({ error: 'Invalid email or password' });
    }
  });
});

// Handle booking request
app.post('/book-room', async (req, res) => {
  const { checkin, checkout, adult, children, email, type} = req.body;
  // Create a new booking document
  const newBooking = new Booking({
    checkin,
    checkout,
    adult,
    children,
    email,
    type,
  });

  try {
    await newBooking.save();
    console.log('Booking data inserted successfully');
    res.status(200).json({ message: 'Booking data received and inserted successfully' });
  } catch (err) {
    console.error('Booking data insertion error: ' + err.message);
    res.status(500).json({ error: 'Booking data insertion error' });
  }
});
