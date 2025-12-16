import mongoose, { Schema, Document, Model } from 'mongoose';

// Profile subdocument interface
export interface IUserProfile {
    firstName: string;
    lastName: string;
    fullName?: string;
    phoneNumber?: string;
    parentPhoneNumber?: string;
    primaryContactType?: 'student' | 'parent';
    age: number;
    dateOfBirth?: Date;
    address?: {
        country?: string;
        city?: string;
    };
    joinType: 'individual' | 'organization';
    organizationName?: string;
    howDidYouKnowNgen: string;
    avatarUrl?: string;
}

// Progress subdocument interface
export interface IUserProgress {
    currentTrackId?: mongoose.Types.ObjectId;
    currentTrackName?: string;
    currentBeltId?: mongoose.Types.ObjectId;
    currentBeltName?: string;
    beltLevel?: number;
    trackStartedAt?: Date;
    lastProgressUpdateAt?: Date;
    completedBelts?: mongoose.Types.ObjectId[];
}

// PlacementTest summary subdocument interface
export interface IUserPlacementTest {
    hasTakenAnyPlacementTest: boolean;
    allowedAttempts: number;
    attemptsUsed: number;
    remainingAttempts?: number;
    extraAttemptsGrantedBySupport?: number;
    lastPlacementTestId?: mongoose.Types.ObjectId;
    lastPlacementTrackId?: mongoose.Types.ObjectId;
    lastPlacementTrackName?: string;
    resultBeltId?: mongoose.Types.ObjectId;
    resultBeltName?: string;
    resultScorePercent?: number;
    takenAt?: Date;
}

// Main User interface
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    passwordHash?: string;
    authProvider: 'email' | 'google' | 'apple' | 'facebook';
    emailVerified: boolean;
    role: 'student' | 'parent';
    status: 'pending' | 'active' | 'suspended' | 'deleted';
    profile: IUserProfile;
    progress?: IUserProgress;
    placementTest?: IUserPlacementTest;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Address subdocument schema
const AddressSchema = new Schema(
    {
        country: { type: String, trim: true },
        city: { type: String, trim: true },
    },
    { _id: false }
);

// Profile subdocument schema
const ProfileSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        fullName: { type: String, trim: true },
        phoneNumber: { type: String, trim: true },
        parentPhoneNumber: { type: String, trim: true },
        primaryContactType: {
            type: String,
            enum: ['student', 'parent'],
        },
        age: {
            type: Number,
            required: [true, 'Age is required'],
            min: [1, 'Age must be at least 1'],
        },
        dateOfBirth: { type: Date },
        address: AddressSchema,
        joinType: {
            type: String,
            enum: ['individual', 'organization'],
            required: [true, 'Join type is required'],
        },
        organizationName: { type: String, trim: true },
        howDidYouKnowNgen: {
            type: String,
            required: [true, 'How did you know NGEN is required'],
        },
        avatarUrl: { type: String },
    },
    { _id: false }
);

// Progress subdocument schema
const ProgressSchema = new Schema(
    {
        currentTrackId: { type: Schema.Types.ObjectId, ref: 'Track' },
        currentTrackName: { type: String },
        currentBeltId: { type: Schema.Types.ObjectId, ref: 'Belt' },
        currentBeltName: { type: String },
        beltLevel: { type: Number },
        trackStartedAt: { type: Date },
        lastProgressUpdateAt: { type: Date },
        completedBelts: [{ type: Schema.Types.ObjectId, ref: 'Belt' }],
    },
    { _id: false }
);

// PlacementTest summary subdocument schema
const PlacementTestSummarySchema = new Schema(
    {
        hasTakenAnyPlacementTest: { type: Boolean, default: false },
        allowedAttempts: { type: Number, default: 1 },
        attemptsUsed: { type: Number, default: 0 },
        remainingAttempts: { type: Number },
        extraAttemptsGrantedBySupport: { type: Number, default: 0 },
        lastPlacementTestId: { type: Schema.Types.ObjectId, ref: 'PlacementTest' },
        lastPlacementTrackId: { type: Schema.Types.ObjectId, ref: 'Track' },
        lastPlacementTrackName: { type: String },
        resultBeltId: { type: Schema.Types.ObjectId, ref: 'Belt' },
        resultBeltName: { type: String },
        resultScorePercent: { type: Number, min: 0, max: 100 },
        takenAt: { type: Date },
    },
    { _id: false }
);

// Main User schema
const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        passwordHash: {
            type: String,
            select: false, // Don't include in queries by default
        },
        authProvider: {
            type: String,
            enum: ['email', 'google', 'apple', 'facebook'],
            default: 'email',
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ['student', 'parent'],
            default: 'student',
        },
        status: {
            type: String,
            enum: ['pending', 'active', 'suspended', 'deleted'],
            default: 'pending',
        },
        profile: {
            type: ProfileSchema,
            required: true,
        },
        progress: ProgressSchema,
        placementTest: PlacementTestSummarySchema,
        lastLoginAt: { type: Date },
    },
    {
        timestamps: true,
    }
);

// Indexes (email index already created by unique: true)
UserSchema.index({ status: 1 });
UserSchema.index({ 'profile.joinType': 1 });

// Pre-save hook to set fullName
UserSchema.pre('save', function () {
    if (this.profile && this.profile.firstName && this.profile.lastName) {
        this.profile.fullName = `${this.profile.firstName} ${this.profile.lastName}`;
    }
});

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
