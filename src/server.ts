import express from 'express';
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/gqomuzik-db', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

const app = express();
const port = 3000; // You can change this to any port you prefer

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, this is your backend server!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

