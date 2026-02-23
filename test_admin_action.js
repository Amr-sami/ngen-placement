require('dotenv').config({ path: '.env.local' });
if (!process.env.MONGODB_URI) {
    require('dotenv').config({ path: '.env' });
}
const mongoose = require('mongoose');

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Define Mongoose Schema just like the app
        const PlacementTestSchema = new mongoose.Schema({
            guestDetails: {
                name: String, email: String, phone: String, age: String
            },
            status: String,
            testType: String,
            trackName: String
        });
        
        const PT = mongoose.models.PlacementTest || mongoose.model('PlacementTest', PlacementTestSchema);
        
        const tests = await PT.find({}).sort({ createdAt: -1 }).limit(3).lean();
        
        console.log("TESTS RETURNED BY MONGOOSE:");
        console.log(JSON.stringify(tests, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
run();
