import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
}

const TransactionSchema = new mongoose.Schema({
    amount: Number,
    currency: String,
    paymobTxnId: String,
    responseData: Object,
    createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        const lastTxn = await Transaction.findOne().sort({ createdAt: -1 });
        if (!lastTxn) {
            console.log('No transactions found');
        } else {
            console.log(JSON.stringify(lastTxn.responseData, null, 2));
        }
        await mongoose.connection.close();
    } catch (error) {
        console.error(error);
    }
}

run();
