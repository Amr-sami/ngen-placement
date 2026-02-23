import mongoose, { Schema, Document, Model } from 'mongoose';

// Question subdocument interface
export interface IPlacementTestQuestion {
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
    points?: number;
    timeTakenSeconds?: number;
}

// Main PlacementTest interface
export interface IPlacementTest extends Document {
    _id: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId | null;
    trackId?: mongoose.Types.ObjectId | null;
    trackName?: string;
    attemptNumber: number;
    testType?: 'technical' | 'soft_skills';
    status: 'in_progress' | 'completed' | 'cancelled';
    scorePercent?: number;
    resultBeltId?: mongoose.Types.ObjectId;
    resultBeltName?: string;
    questions?: IPlacementTestQuestion[];
    guestDetails?: {
        name?: string;
        email?: string;
        phone?: string;
        age?: string;
        country?: string;
        city?: string;
        schoolName?: string;
        preferredHouse?: string;
        techExperience?: string;
        heardAboutUs?: string;
    };
    detailedEvaluation?: any; // Stores the complex JSON result from new evaluator
    startedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Question subdocument schema
const QuestionSchema = new Schema(
    {
        questionId: {
            type: String,
            required: true,
        },
        selectedOptionId: {
            type: String,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            required: true,
        },
        points: {
            type: Number,
        },
        timeTakenSeconds: {
            type: Number,
        },
        // We might want to store more context here for re-evaluation if needed
        belt: { type: String },
        difficulty: { type: Number },
    },
    { _id: false }
);

// Main PlacementTest schema
const PlacementTestSchema = new Schema<IPlacementTest>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            // required: false, since guests take tests now
        },
        trackId: {
            type: Schema.Types.ObjectId,
            ref: 'Track',
            // required: false, since guests take tests now
        },
        trackName: {
            type: String,
        },
        attemptNumber: {
            type: Number,
            required: [true, 'Attempt number is required'],
            min: 1,
        },
        testType: {
            type: String,
            enum: ['technical', 'soft_skills'],
            default: 'technical',
        },
        status: {
            type: String,
            enum: ['in_progress', 'completed', 'cancelled'],
            required: true,
            default: 'in_progress',
        },
        scorePercent: {
            type: Number,
            min: 0,
            max: 100,
        },
        resultBeltId: {
            type: Schema.Types.ObjectId,
            ref: 'Belt',
        },
        resultBeltName: {
            type: String,
        },
        questions: [QuestionSchema],
        detailedEvaluation: {
            type: Schema.Types.Mixed, // Flexible for the complex result object
        },
        guestDetails: {
            name: String,
            email: String,
            phone: String,
            age: String,
            country: String,
            city: String,
            schoolName: String,
            preferredHouse: String,
            techExperience: String,
            heardAboutUs: String,
        },
        startedAt: {
            type: Date,
        },
        completedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
PlacementTestSchema.index({ userId: 1 });
PlacementTestSchema.index({ userId: 1, trackId: 1 });
PlacementTestSchema.index({ status: 1 });

const PlacementTest: Model<IPlacementTest> =
    mongoose.models.PlacementTest ||
    mongoose.model<IPlacementTest>('PlacementTest', PlacementTestSchema);

export default PlacementTest;
