const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 5511; // Change to your desired port

app.use(cors());
app.use(bodyParser.json());

const mongoURL = "mongodb+srv://tiwariabhi1406:Abhishek%401@cluster0.bnpvium.mongodb.net/";
const client = new MongoClient(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error: ' + err.message);
  }
}

connectToMongoDB();

app.get('/', (req, res) => {
  res.send('Welcome to the server');
});

// Create a MongoDB collection (if it doesn't exist)
async function createCollection() {
  const db = client.db("myCollection");
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map((collection) => collection.name);

  if (!collectionNames.includes('newTable')) {
    await db.createCollection('newTable');
    console.log('MongoDB collection created');
  } else {
    console.log('Collection already exists');
  }
}

createCollection();

app.post('/sendData', async (req, res) => {
  const { email, password, phoneNumber, address, pincode, dateOfBirth, name } = req.body;

  const isValidDate = (dateString) => {
    return !isNaN(new Date(dateString).getTime());
  };

  let dateOfBirthValue = isValidDate(dateOfBirth) ? new Date(dateOfBirth) : new Date('1991-01-01');

  const db = client.db("myCollection");
  const collection = db.collection('newTable');

  const data = {
    email,
    password,
    phoneNumber,
    address,
    pincode,
    dateOfBirth: dateOfBirthValue,
    name,
  };

  try {
    await collection.insertOne(data);
    console.log('Data inserted successfully');
    res.status(200).json({ message: 'Data received and inserted successfully' });
  } catch (err) {
    console.error('Data insertion error: ' + err.message);
    res.status(500).json({ error: 'Data insertion error' });
  }
});

app.post('/checkLogin', async (req, res) => {
  const { email, password } = req.body;

  const db = client.db("myCollection"); // Use the correct database name here
  const collection = db.collection('newTable');

  try {
    const result = await collection.findOne({ email, password });

    if (result) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Database query error: ' + err.message);
    res.status(500).json({ error: 'Database query error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
