import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();

app.get('/api/songs', (_req, res) => {
  const songsDirectory = path.join(process.cwd(), './audios');
  const songs = fs.readdirSync(songsDirectory);

  res.status(200).json(songs);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
