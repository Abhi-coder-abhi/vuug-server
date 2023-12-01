require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT||4000; // Change to your desired port

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
  phoneNumber: String,
  address: String,
  dateOfBirth: Date,
  firstName: String,
  lastName:String,
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
  const { email, phoneNumber, address, dateOfBirth, firstName, lastName } = req.body;
  // Create a new user document
  const newUser = new User({
    email,
    phoneNumber,
    address,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date('1991-01-01'),
    firstName,
    lastName,
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

