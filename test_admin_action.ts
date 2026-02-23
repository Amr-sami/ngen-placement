import mongoose from 'mongoose';
import dbConnect from './lib/mongodb';
import { getPlacementTests } from './lib/actions/admin/operationsActions';

async function run() {
    await dbConnect();
    const result = await getPlacementTests({ page: 1, status: 'all', limit: 3 });
    console.log(JSON.stringify(result.tests, null, 2));
    process.exit(0);
}
run();
