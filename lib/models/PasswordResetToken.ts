import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';

export interface IPasswordResetToken extends Document {
    email: string;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
}

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>(
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
            default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
    },
    {
        timestamps: true,
    }
);

// Index for cleanup of expired tokens
PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Index for quick lookup
PasswordResetTokenSchema.index({ email: 1, tokenHash: 1 });

/**
 * Generate a secure password reset token
 */
export function generatePasswordResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

const PasswordResetToken: Model<IPasswordResetToken> =
    mongoose.models.PasswordResetToken ||
    mongoose.model<IPasswordResetToken>('PasswordResetToken', PasswordResetTokenSchema);

export default PasswordResetToken;
