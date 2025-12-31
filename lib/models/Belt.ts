import mongoose, { Schema, Document, Model } from 'mongoose';
import { LocalizedString, LocalizedStringSchemaDefinition } from '../localization';

export interface IBelt extends Document {
    _id: mongoose.Types.ObjectId;
    trackId: mongoose.Types.ObjectId;
    name: LocalizedString;
    code: string;
    order: number;
    description?: LocalizedString;
    minScoreToStart?: number;
    basePriceEGP: number;
    basePriceUSD: number;
    packageLevel: 'pre-foundation' | 'foundation' | 'specialization' | 'advanced';
    purchaseUrl?: string;
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
            type: LocalizedStringSchemaDefinition,
            required: [true, 'Belt name is required'],
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
            type: LocalizedStringSchemaDefinition,
        },
        minScoreToStart: {
            type: Number,
            min: 0,
            max: 100,
        },
        basePriceEGP: {
            type: Number,
            required: [true, 'Base price EGP is required'],
            min: 0,
        },
        basePriceUSD: {
            type: Number,
            required: [true, 'Base price USD is required'],
            min: 0,
        },
        packageLevel: {
            type: String,
            enum: ['pre-foundation', 'foundation', 'specialization', 'advanced'],
            required: [true, 'Package level is required'],
        },
        purchaseUrl: {
            type: String,
            trim: true,
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
