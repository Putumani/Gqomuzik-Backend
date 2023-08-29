//src > schemas > artistSchema.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface Artist extends Document {
  name: string;
}

const artistSchema: Schema<Artist> = new Schema({
  name: String,
});

const ArtistModel: Model<Artist> = mongoose.model('Artist', artistSchema);

export default ArtistModel;


