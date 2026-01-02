import mongoose, { Schema, Document, Model } from 'mongoose';
import { LocalizedString, LocalizedStringSchemaDefinition } from '../localization';

export interface ITrack extends Document {
    _id: mongoose.Types.ObjectId;
    name: LocalizedString;
    slug: string;
    description?: LocalizedString;
    isActive: boolean;
    belts: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const TrackSchema = new Schema<ITrack>(
    {
        name: {
            type: LocalizedStringSchemaDefinition,
            required: [true, 'Track name is required'],
        },
        slug: {
            type: String,
            required: [true, 'Track slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: LocalizedStringSchemaDefinition,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        belts: [{
            type: Schema.Types.ObjectId,
            ref: 'Belt',
        }],
    },
    {
        timestamps: true,
    }
);



const Track: Model<ITrack> =
    mongoose.models.Track || mongoose.model<ITrack>('Track', TrackSchema);

export default Track;
