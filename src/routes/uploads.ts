import express from 'express';
import busboy from 'busboy';
import fs from 'fs';
import { MongoClient } from 'mongodb';
import ArtistModel from '../schemas/artistSchema';
import SongModel from '../schemas/songSchema';
import path from 'path';


const app = express();

const mongoUrl = 'mongodb://localhost:27017/?useNewUrlParser=true&useUnifiedTopology=true';
const dbName = 'gqomuzik-db';
const client = new MongoClient(mongoUrl);

interface Audio {
  id: string;
  url: string;
}

const audios: Audio[] = [];

app.post('/api/upload', async (req, res) => {
  const bb = busboy({ headers: req.headers });

  bb.on('file', (_, file, info) => {
    const fileName = info.filename;
    const filePath = `./audios/${fileName}`;

    const stream = fs.createWriteStream(filePath);

    file.pipe(stream);
  });

  bb.on('finish', async () => {
    try {
      const artist = req.headers.artist as string;
      const songName = req.headers.songname as string;

      // Store the artist and song name in MongoDB
      const artistDocument = new ArtistModel({ name: artist });
      await artistDocument.save();

      const songData = {
        title: songName,
        artist: artistDocument._id, // Reference to the artist
        url: `${songName}.mp3`,
      };

      const songDocument = new SongModel(songData);
      await songDocument.save();

      res.writeHead(200, { Connection: 'close' });
      res.end('Uploaded successfully!!!');
    } catch (error) {
      console.error('Error uploading audio:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  req.pipe(bb);
});


const CHUNK_SIZE_IN_BYTES = 1000000; // 1 MB

app.get('/api/audios/:audioId', (req, res) => {
  const range = req.headers.range;

  if (!range) {
    return res.status(400).send('Range must be provided');
  }

  const audioId = req.params.audioId as string;

  const audioPath = path.join(process.cwd(), `./audios/${audioId}.mp3`);

  const audioSizeInBytes = fs.statSync(audioPath).size;

  const chunkStart = Number(range.replace(/\D/g, ''));

  const chunkEnd = Math.min(chunkStart + CHUNK_SIZE_IN_BYTES, audioSizeInBytes - 1);

  const contentLength = chunkEnd - chunkStart + 1;

  const headers = {
    'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${audioSizeInBytes}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'audio/mp3',
  };

  res.writeHead(206, headers);

  const audioStream = fs.createReadStream(audioPath, { start: chunkStart, end: chunkEnd });

  audioStream.pipe(res);
});

app.get('/api/audios', (req, res) => {
  res.status(200).json({ audios });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


