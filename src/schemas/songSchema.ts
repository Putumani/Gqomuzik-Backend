import mongoose, { Document, Schema, Model } from 'mongoose';
import { Artist } from './artistSchema';

export interface Song extends Document {
  title: string;
  artist: Artist['_id'];
  url: string;
}

const songSchema: Schema<Song> = new Schema({
  title: String,
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  url: String,
});

const SongModel: Model<Song> = mongoose.model('Song', songSchema);

export default SongModel;


