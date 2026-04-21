/* eslint-disable */
// @ts-nocheck
/**
 * k6 load-test for the guest placement-test flow. Run against the target
 * subdomain BEFORE cutover to production traffic.
 *
 * What it exercises:
 *   1. POST /api/generate-questions  — creates a guest PlacementTest row,
 *                                      receives HttpOnly lead-token cookie.
 *   2. POST /api/placement-test/submit — submits scored answers; server
 *                                        re-scores using stored generatedQuestions.
 *   3. GET /api/placement-test/results/{testId} — ownership-gated read of
 *                                                 the completed row.
 *
 * Ramp profile: 0 → 50 → 100 → 50 → 0 VUs over 10 minutes. Tune via env:
 *   - BASE_URL=https://placement.ngen.school
 *   - STAGE_DURATION=1m
 *   - PEAK_VUS=100
 *
 * Thresholds fail the run if the p95 exceeds 2s or error rate > 1%.
 *
 * Install k6: brew install k6
 * Run:        k6 run scripts/load-test.js
 * Run w/ env: BASE_URL=https://placement.ngen.school k6 run scripts/load-test.js
 *
 * IMPORTANT: guest rows land in the shared Mongo. Running this against prod
 * will create real placementtests documents. Clean up with:
 *   db.placementtests.deleteMany({ 'guestDetails.email': /k6load\.test$/ })
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const STAGE_DURATION = __ENV.STAGE_DURATION || '1m';
const PEAK_VUS = Number(__ENV.PEAK_VUS || 100);

const generateLatency = new Trend('stage_generate_latency');
const submitLatency = new Trend('stage_submit_latency');
const resultsLatency = new Trend('stage_results_latency');
const flowSuccess = new Rate('flow_success');

export const options = {
    stages: [
        { duration: STAGE_DURATION, target: Math.round(PEAK_VUS / 2) },
        { duration: STAGE_DURATION, target: PEAK_VUS },
        { duration: STAGE_DURATION, target: PEAK_VUS },
        { duration: STAGE_DURATION, target: Math.round(PEAK_VUS / 2) },
        { duration: STAGE_DURATION, target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'],
        http_req_failed: ['rate<0.01'],
        flow_success: ['rate>0.99'],
    },
};

function buildGuestDetails(vu, iter) {
    return {
        name: `k6user_${vu}_${iter}`,
        email: `k6user_${vu}_${iter}@k6load.test`,
        phone: '0000000000',
        age: '14',
        country: 'Egypt',
        city: 'Cairo',
        schoolName: 'k6 synthetic school',
        preferredHouse: 'individual',
        techExperience: 'some',
        heardAboutUs: 'load-test',
    };
}

export default function () {
    const guestDetails = buildGuestDetails(__VU, __ITER);

    // 1. generate-questions
    const genRes = http.post(
        `${BASE_URL}/api/generate-questions`,
        JSON.stringify({
            guestDetails,
            trackName: 'general',
        }),
        { headers: { 'Content-Type': 'application/json' } }
    );
    generateLatency.add(genRes.timings.duration);

    const genOk = check(genRes, {
        'generate 200': (r) => r.status === 200,
        'generate has testId': (r) => {
            try { return !!r.json('testId'); } catch { return false; }
        },
    });
    if (!genOk) {
        flowSuccess.add(false);
        sleep(1);
        return;
    }

    const testId = genRes.json('testId');
    const questions = genRes.json('questions') || [];
    const cookieHeader = genRes.headers['Set-Cookie'] || '';

    // Simulate think time — a real guest reads the questions.
    sleep(Math.random() * 2 + 1);

    // 2. submit — answer every question with choice 0 (score doesn't need
    // to be realistic, we're stressing the write path).
    const answers = questions.map((_, i) => ({
        questionIndex: i,
        selectedOptionId: 'A',
    }));

    const submitRes = http.post(
        `${BASE_URL}/api/placement-test/submit`,
        JSON.stringify({ testId, answers, guestDetails }),
        {
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieHeader,
            },
        }
    );
    submitLatency.add(submitRes.timings.duration);

    const submitOk = check(submitRes, {
        'submit 200': (r) => r.status === 200,
    });
    if (!submitOk) {
        flowSuccess.add(false);
        sleep(1);
        return;
    }

    // 3. results
    const resultsRes = http.get(
        `${BASE_URL}/api/placement-test/results/${testId}`,
        { headers: { Cookie: cookieHeader } }
    );
    resultsLatency.add(resultsRes.timings.duration);

    const resultsOk = check(resultsRes, {
        'results 200': (r) => r.status === 200,
    });

    flowSuccess.add(genOk && submitOk && resultsOk);
    sleep(Math.random() * 2);
}
