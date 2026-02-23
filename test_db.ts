import mongoose from 'mongoose';
import dbConnect from './lib/mongodb';
import PlacementTest from './lib/models/PlacementTest';

async function run() {
    await dbConnect();
    const tests = await PlacementTest.find({}).sort({ createdAt: -1 }).limit(10).lean();
    console.log("RECENT TESTS:");
    for (const t of tests) {
        console.log(`- ID: ${t._id}, Type: ${t.testType || t.trackName || 'unknown'}, Date: ${t.createdAt}, Status: ${t.status}, Guest: ${t.guestDetails ? t.guestDetails.name : 'NO GUEST DETAILS'}, User: ${t.userId}`);
    }
    process.exit(0);
}
run();
