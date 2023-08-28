import mongoose, { Document, Schema, Model } from 'mongoose';

interface Artist extends Document {
  name: string;
}

interface Song extends Document {
  title: string;
  artist: Artist['_id'];
  url: string;
}

const artistSchema: Schema<Artist> = new Schema({
  name: String,
});

const songSchema: Schema<Song> = new Schema({
  title: String,
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  url: String,
});

const ArtistModel: Model<Artist> = mongoose.model('Artist', artistSchema);
const SongModel: Model<Song> = mongoose.model('Song', songSchema);

export { ArtistModel, SongModel };
