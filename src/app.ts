import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('this is the backend server!');
});

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gqomuzik-db';

MongoClient.connect(mongoUri)
  .then((client) => {
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Define further routes or perform database operations here
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
