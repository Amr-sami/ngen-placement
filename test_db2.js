require('dotenv').config({ path: '.env.local' });
if (!process.env.MONGODB_URI) {
    require('dotenv').config({ path: '.env' });
}
const mongoose = require('mongoose');

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const tests = await mongoose.connection.db.collection('placementtests')
            .find({}, { projection: { _id: 1, testType: 1, guestDetails: 1, createdAt: 1, trackName: 1 } })
            .sort({ createdAt: -1 })
            .limit(10)
            .toArray();
        console.log("RECENT TESTS (10):");
        console.log(JSON.stringify(tests, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
run();
