import mongoose, { Schema, Document, Model } from 'mongoose';
import { LocalizedString, LocalizedStringSchemaDefinition } from '../localization';

export interface IBelt extends Document {
    _id: mongoose.Types.ObjectId;
    // trackId removed
    name: LocalizedString;
    code: string;
    order: number;
    description?: LocalizedString;
    minScoreToStart?: number;
    basePriceEGP: number;
    basePriceUSD: number;
    packageLevel: 'pre-foundation' | 'foundation' | 'specialization' | 'advanced';
    purchaseUrl?: string;
    salesEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BeltSchema = new Schema<IBelt>(
    {
        // Removed trackId - Belts are global now
        name: {
            type: LocalizedStringSchemaDefinition,
            required: [true, 'Belt name is required'],
        },
        code: {
            type: String,
            required: [true, 'Belt code is required'],
            uppercase: true,
            trim: true,
            unique: true, // Belts must be unique globally (White, Yellow, etc.)
        },
        order: {
            type: Number,
            required: [true, 'Belt order is required'],
            unique: true, // Order defines the global progression
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
        salesEnabled: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);



const Belt: Model<IBelt> =
    mongoose.models.Belt || mongoose.model<IBelt>('Belt', BeltSchema);

export default Belt;
