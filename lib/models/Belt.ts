import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBelt extends Document {
    _id: mongoose.Types.ObjectId;
    trackId: mongoose.Types.ObjectId;
    name: string;
    code: string;
    order: number;
    description?: string;
    minScoreToStart?: number;
    createdAt: Date;
    updatedAt: Date;
}

const BeltSchema = new Schema<IBelt>(
    {
        trackId: {
            type: Schema.Types.ObjectId,
            ref: 'Track',
            required: [true, 'Track ID is required'],
        },
        name: {
            type: String,
            required: [true, 'Belt name is required'],
            trim: true,
        },
        code: {
            type: String,
            required: [true, 'Belt code is required'],
            uppercase: true,
            trim: true,
        },
        order: {
            type: Number,
            required: [true, 'Belt order is required'],
        },
        description: {
            type: String,
            trim: true,
        },
        minScoreToStart: {
            type: Number,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for track + order (belt progression)
BeltSchema.index({ trackId: 1, order: 1 });
// Index for fast code lookups
BeltSchema.index({ code: 1 });

const Belt: Model<IBelt> =
    mongoose.models.Belt || mongoose.model<IBelt>('Belt', BeltSchema);

export default Belt;
