'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
// Import all models to ensure they are registered with Mongoose
import '@/lib/models';
import Order from '@/lib/models/Order';
import Transaction from '@/lib/models/Transaction';
import PlacementTest from '@/lib/models/PlacementTest';
import { requireSuperAdmin } from '@/lib/auth/adminAuth';

/**
 * Get paginated orders
 */
export async function getOrders(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}) {
    await requireSuperAdmin();
    await connectToDatabase();

    const {
        page = 1,
        limit = 20,
        search = '',
        status = '',
    } = options;

    const query: Record<string, unknown> = {};

    if (search) {
        query.$or = [
            { customerEmail: { $regex: search, $options: 'i' } },
            { customerName: { $regex: search, $options: 'i' } },
            { paymobOrderId: { $regex: search, $options: 'i' } },
            { transactionId: { $regex: search, $options: 'i' } },
        ];
    }

    if (status && status !== 'all') {
        query.status = status;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('trackId', 'name')
        .populate('beltId', 'name code')
        .lean();

    return {
        orders: orders.map(order => ({
            id: order._id.toString(),
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            amount: order.amount,
            currency: order.currency,
            status: order.status,
            paymobOrderId: order.paymobOrderId,
            transactionId: order.transactionId,
            paymentMethod: order.paymentMethod,
            track: order.trackId ? (order.trackId as unknown as { name: { en: string } }).name?.en : null,
            belt: order.beltId ? (order.beltId as unknown as { name: { en: string }; code: string }).name?.en : null,
            beltCode: order.beltId ? (order.beltId as unknown as { code: string }).code : null,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

/**
 * Get order details with transactions
 */
export async function getOrderDetails(orderId: string) {
    await requireSuperAdmin();
    await connectToDatabase();

    const order = await Order.findById(orderId)
        .populate('trackId', 'name')
        .populate('beltId', 'name code')
        .populate('userId', 'email profile.firstName profile.lastName')
        .lean();

    if (!order) {
        return null;
    }

    const transactions = await Transaction.find({ orderId })
        .sort({ createdAt: -1 })
        .lean();

    return {
        order: {
            id: order._id.toString(),
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            amount: order.amount,
            currency: order.currency,
            status: order.status,
            paymobOrderId: order.paymobOrderId,
            transactionId: order.transactionId,
            paymentMethod: order.paymentMethod,
            metadata: order.metadata,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        },
        transactions: transactions.map(txn => ({
            id: txn._id.toString(),
            paymobTxnId: txn.paymobTxnId,
            amount: txn.amount,
            currency: txn.currency,
            success: txn.success,
            pending: txn.pending,
            errorMessage: txn.errorMessage,
            createdAt: txn.createdAt,
        })),
    };
}

/**
 * Get paginated placement tests
 */
export async function getPlacementTests(options: {
    page?: number;
    limit?: number;
    status?: string;
}) {
    await requireSuperAdmin();
    await connectToDatabase();

    const {
        page = 1,
        limit = 20,
        status = '',
    } = options;

    const query: Record<string, unknown> = {};

    if (status && status !== 'all') {
        query.status = status;
    }

    const total = await PlacementTest.countDocuments(query);
    const tests = await PlacementTest.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'email profile.firstName profile.lastName')
        .populate('trackId', 'name')
        .populate('resultBeltId', 'name code')
        .lean();

    return {
        tests: tests.map(test => {
            const user = test.userId as unknown as { _id: { toString: () => string }; email: string; profile: { firstName: string; lastName: string } } | null;
            const track = test.trackId as unknown as { name: { en: string } } | null;
            const belt = test.resultBeltId as unknown as { name: { en: string }; code: string } | null;

            return {
                id: test._id.toString(),
                userId: user?._id?.toString() || null,
                userEmail: user?.email || 'Unknown',
                userName: user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Unknown',
                trackName: track?.name?.en || test.trackName || 'Unknown',
                attemptNumber: test.attemptNumber,
                status: test.status,
                testType: test.testType || 'technical',
                scorePercent: test.scorePercent,
                resultBeltName: belt?.name?.en || test.resultBeltName || null,
                resultBeltCode: belt?.code || null,
                questionsCount: test.questions?.length || 0,
                detailedEvaluation: test.detailedEvaluation || null,
                startedAt: test.startedAt,
                completedAt: test.completedAt,
                createdAt: test.createdAt,
            };
        }),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

/**
 * Get placement test statistics
 */
export async function getPlacementTestStats() {
    await requireSuperAdmin();
    await connectToDatabase();

    const [
        total,
        completed,
        inProgress,
        avgScore,
    ] = await Promise.all([
        PlacementTest.countDocuments(),
        PlacementTest.countDocuments({ status: 'completed' }),
        PlacementTest.countDocuments({ status: 'in_progress' }),
        PlacementTest.aggregate([
            { $match: { status: 'completed', scorePercent: { $exists: true } } },
            { $group: { _id: null, avg: { $avg: '$scorePercent' } } },
        ]),
    ]);

    const averageScore = avgScore[0]?.avg || 0;

    return {
        total,
        completed,
        inProgress,
        averageScore: Math.round(averageScore * 10) / 10,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
}

/**
 * Update order status (admin override)
 */
export async function updateOrderStatus(orderId: string, status: 'pending' | 'paid' | 'failed' | 'refunded') {
    await requireSuperAdmin();
    await connectToDatabase();

    const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
    );

    if (!order) {
        throw new Error('Order not found');
    }

    revalidatePath('/en/admin/orders');

    return { success: true };
}

import { loadQuestionBank } from '@/lib/soft-skills/question-bank';

/**
 * Get single placement test details
 */
export async function getPlacementTest(id: string) {
    await requireSuperAdmin();
    await connectToDatabase();

    const test = await PlacementTest.findById(id)
        .populate('userId', 'email profile.firstName profile.lastName profile.age profile.phoneNumber')
        .populate('trackId', 'name')
        .populate('resultBeltId', 'name code')
        .lean();

    if (!test) {
        return null;
    }

    const user = test.userId as any;
    const track = test.trackId as any;
    const belt = test.resultBeltId as any;

    let enrichedEvaluation = test.detailedEvaluation;

    // Enrich soft skills data with question text
    if (test.testType === 'soft_skills' && enrichedEvaluation && enrichedEvaluation.raw_data?.answers) {
        try {
            const questionBank = loadQuestionBank();
            // Assuming the age group is in the meta or we search all
            const ageGroup = enrichedEvaluation.meta?.age_group;
            const questions = ageGroup ? questionBank[ageGroup] : [];

            if (questions && questions.length > 0) {
                const enrichedAnswers = Object.entries(enrichedEvaluation.raw_data.answers).map(([qid, ansIdx]: [string, any]) => {
                    const question = questions.find((q: any) => q.id === Number(qid));
                    if (question) {
                        return {
                            id: qid,
                            text: question.question_en,
                            text_ar: question.question_ar,
                            selectedOption: question.options_en[ansIdx as number],
                            selectedOption_ar: question.options_ar[ansIdx as number]
                        };
                    }
                    return { id: qid, selectedOption: ansIdx };
                });
                enrichedEvaluation = {
                    ...enrichedEvaluation,
                    enriched_answers: enrichedAnswers
                };
            }
        } catch (error) {
            console.error("Error loading question bank for enrichment:", error);
        }
    }

    return {
        id: test._id.toString(),
        userId: user?._id?.toString() || null,
        userEmail: user?.email || 'Unknown',
        userName: user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Unknown',
        userAge: user?.profile?.age || null,
        userPhone: user?.profile?.phoneNumber || null,
        trackName: track?.name?.en || test.trackName || 'Unknown',
        attemptNumber: test.attemptNumber,
        status: test.status,
        testType: test.testType || 'technical',
        scorePercent: test.scorePercent,
        resultBeltName: belt?.name?.en || test.resultBeltName || null,
        resultBeltCode: belt?.code || null,
        questions: test.questions || [],
        detailedEvaluation: enrichedEvaluation || null,
        startedAt: test.startedAt,
        completedAt: test.completedAt,
        createdAt: test.createdAt,
    };
}
