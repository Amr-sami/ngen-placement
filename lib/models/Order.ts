import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Order Model for Paymob Payment Integration
 * 
 * Stores order information for track/belt purchases
 */
export interface IOrder extends Document {
    _id: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    trackId?: mongoose.Types.ObjectId;
    beltId?: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    paymobOrderId?: string;
    transactionId?: string;
    paymentMethod?: 'card' | 'wallet';
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        trackId: {
            type: Schema.Types.ObjectId,
            ref: 'Track',
            required: false,
        },
        beltId: {
            type: Schema.Types.ObjectId,
            ref: 'Belt',
            required: false,
        },
        amount: {
            type: Number,
            required: [true, 'Order amount is required'],
            min: 0,
        },
        currency: {
            type: String,
            default: 'EGP',
            enum: ['EGP', 'USD'],
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        paymobOrderId: {
            type: String,
            unique: true,
            sparse: true, // Allows null values while maintaining uniqueness
        },
        transactionId: {
            type: String,
        },
        paymentMethod: {
            type: String,
            enum: ['card', 'wallet'],
        },
        customerName: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true,
        },
        customerEmail: {
            type: String,
            required: [true, 'Customer email is required'],
            lowercase: true,
            trim: true,
        },
        customerPhone: {
            type: String,
            required: [true, 'Customer phone is required'],
            trim: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for fast lookups
OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ userId: 1 });

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
