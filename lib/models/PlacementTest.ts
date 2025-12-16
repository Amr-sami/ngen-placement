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
    userId: mongoose.Types.ObjectId;
    trackId: mongoose.Types.ObjectId;
    trackName?: string;
    attemptNumber: number;
    status: 'in_progress' | 'completed' | 'cancelled';
    scorePercent?: number;
    resultBeltId?: mongoose.Types.ObjectId;
    resultBeltName?: string;
    questions?: IPlacementTestQuestion[];
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
    },
    { _id: false }
);

// Main PlacementTest schema
const PlacementTestSchema = new Schema<IPlacementTest>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        trackId: {
            type: Schema.Types.ObjectId,
            ref: 'Track',
            required: [true, 'Track ID is required'],
        },
        trackName: {
            type: String,
        },
        attemptNumber: {
            type: Number,
            required: [true, 'Attempt number is required'],
            min: 1,
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
