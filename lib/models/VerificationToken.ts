import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';

export interface IVerificationToken extends Document {
    email: string;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        tokenHash: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
    },
    {
        timestamps: true,
    }
);

// Index for cleanup of expired tokens
VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Index for quick lookup
VerificationTokenSchema.index({ email: 1, tokenHash: 1 });

/**
 * Generate a secure verification token
 */
export function generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

const VerificationToken: Model<IVerificationToken> =
    mongoose.models.VerificationToken ||
    mongoose.model<IVerificationToken>('VerificationToken', VerificationTokenSchema);

export default VerificationToken;
