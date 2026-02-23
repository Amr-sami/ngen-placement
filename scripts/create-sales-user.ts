import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env');
    process.exit(1);
}

// Minimal User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    authProvider: { type: String, enum: ['email', 'google'] },
    emailVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['student', 'parent', 'superadmin', 'sales'], default: 'student' },
    status: { type: String, enum: ['pending', 'active', 'suspended', 'deleted'], default: 'pending' },
    profile: {
        firstName: String,
        lastName: String,
        phoneNumber: String,
        age: Number,
        joinType: String,
        howDidYouKnowNgen: String,
    }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createSalesUser() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected.');

        const email = 'sales@ngen.com';
        const rawPassword = 'salesngen2026$$';

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`User ${email} already exists. Updating role to "sales"...`);
            existingUser.role = 'sales';
            existingUser.status = 'active'; // Force active to bypass email verification

            // Re-hash password in case it was requested to be updated
            const saltRounds = 12;
            existingUser.passwordHash = await bcrypt.hash(rawPassword, saltRounds);

            await existingUser.save();
            console.log('User updated successfully!');
            process.exit(0);
        }

        console.log('Hashing password...');
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(rawPassword, saltRounds);

        console.log('Creating user document...');
        const newUser = new User({
            email: email.toLowerCase(),
            passwordHash,
            authProvider: 'email',
            emailVerified: true, // Auto-verify
            role: 'sales',
            status: 'active', // Skip pending
            profile: {
                firstName: 'Sales',
                lastName: 'Team',
                age: 25,
                joinType: 'individual',
                howDidYouKnowNgen: 'Internal',
            }
        });

        await newUser.save();
        console.log(`Successfully created Sales user: ${email}`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating sales user:', error);
        process.exit(1);
    }
}

createSalesUser();
