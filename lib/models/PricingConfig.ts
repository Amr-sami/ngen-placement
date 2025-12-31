import mongoose, { Schema, Document, Model } from 'mongoose';
import { LocalizedString, LocalizedStringSchemaDefinition } from '../localization';

export interface IPricingConfig extends Document {
    _id: mongoose.Types.ObjectId;
    configType: 'perBelt' | 'package' | 'organization';
    name: LocalizedString;
    packageLevel?: 'pre-foundation' | 'foundation' | 'specialization' | 'advanced';
    discountPercentEGP: number;
    discountPercentUSD: number;
    fixedPriceEGP?: number;
    fixedPriceUSD?: number;
    belts?: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PricingConfigSchema = new Schema<IPricingConfig>(
    {
        configType: {
            type: String,
            enum: ['perBelt', 'package', 'organization'],
            required: [true, 'Config type is required'],
        },
        name: {
            type: LocalizedStringSchemaDefinition,
            required: [true, 'Name is required'],
        },
        packageLevel: {
            type: String,
            enum: ['pre-foundation', 'foundation', 'specialization', 'advanced'],
        },
        discountPercentEGP: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
            default: 0,
        },
        discountPercentUSD: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
            default: 0,
        },
        fixedPriceEGP: {
            type: Number,
            min: 0,
        },
        fixedPriceUSD: {
            type: Number,
            min: 0,
        },
        belts: [{
            type: String,
            trim: true,
        }],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for fast lookups
PricingConfigSchema.index({ configType: 1, isActive: 1 });
PricingConfigSchema.index({ packageLevel: 1 });

const PricingConfig: Model<IPricingConfig> =
    mongoose.models.PricingConfig || mongoose.model<IPricingConfig>('PricingConfig', PricingConfigSchema);

export default PricingConfig;
