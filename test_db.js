require('dotenv').config({ path: '.env.local' });
if (!process.env.MONGODB_URI) {
    require('dotenv').config({ path: '.env' });
}
const mongoose = require('mongoose');

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const tests = await mongoose.connection.db.collection('placementtests').find({}).sort({ createdAt: -1 }).limit(3).toArray();
        console.log(JSON.stringify(tests, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
run();
