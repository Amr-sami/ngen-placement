import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Transaction Model for Paymob Payment Integration
 * 
 * Stores transaction details from Paymob webhooks
 * Each order can have multiple transactions (retries, refunds, etc.)
 */
export interface ITransaction extends Document {
    _id: mongoose.Types.ObjectId;
    orderId: mongoose.Types.ObjectId;
    paymobTxnId: string;
    amount: number;
    currency: string;
    success: boolean;
    pending: boolean;
    responseData: Record<string, unknown>;
    errorMessage?: string;
    createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: [true, 'Order ID is required'],
        },
        paymobTxnId: {
            type: String,
            required: [true, 'Paymob transaction ID is required'],
            unique: true,
        },
        amount: {
            type: Number,
            required: [true, 'Transaction amount is required'],
            min: 0,
        },
        currency: {
            type: String,
            default: 'EGP',
        },
        success: {
            type: Boolean,
            required: true,
        },
        pending: {
            type: Boolean,
            required: true,
        },
        responseData: {
            type: Schema.Types.Mixed,
            required: true,
        },
        errorMessage: {
            type: String,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Indexes for fast lookups
TransactionSchema.index({ orderId: 1 });
TransactionSchema.index({ createdAt: -1 });

const Transaction: Model<ITransaction> =
    mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
