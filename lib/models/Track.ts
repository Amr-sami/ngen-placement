import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITrack extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TrackSchema = new Schema<ITrack>(
    {
        name: {
            type: String,
            required: [true, 'Track name is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, 'Track slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for fast slug lookups
TrackSchema.index({ slug: 1 }, { unique: true });

const Track: Model<ITrack> =
    mongoose.models.Track || mongoose.model<ITrack>('Track', TrackSchema);

export default Track;
