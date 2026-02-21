
import { loadQuestionBank } from './question-bank';

// ============================================================
// 1. CONSTANTS & CONFIGURATION
// ============================================================

export type Trait =
    | "social"
    | "communication"
    | "problem_solving"
    | "time_management"
    | "teamwork"
    | "leadership"
    | "creativity"
    | "critical_thinking"
    | "emotional_intelligence"
    | "adaptability";

export const TRAITS: Trait[] = [
    "social",
    "communication",
    "problem_solving",
    "time_management",
    "teamwork",
    "leadership",
    "creativity",
    "critical_thinking",
    "emotional_intelligence",
    "adaptability"
];

export const TRAIT_LABELS = {
    social: { en: "Social Skills", ar: "المهارات الاجتماعية" },
    communication: { en: "Communication Skills", ar: "مهارات التواصل" },
    problem_solving: { en: "Problem-Solving Skills", ar: "مهارات حل المشكلات" },
    time_management: { en: "Time Management Skills", ar: "مهارات إدارة الوقت" },
    teamwork: { en: "Teamwork Skills", ar: "مهارات العمل الجماعي" },
    leadership: { en: "Leadership Skills", ar: "مهارات القيادة" },
    creativity: { en: "Creativity Skills", ar: "مهارات الإبداع" },
    critical_thinking: { en: "Critical Thinking Skills", ar: "مهارات التفكير النقدي" },
    emotional_intelligence: { en: "Emotional Intelligence", ar: "الذكاء العاطفي" },
    adaptability: { en: "Adaptability Skills", ar: "مهارات القدرة على التكيف" },
};

const WORK_STYLE_LABELS: any = {
    individual: { en: "Independent Worker", ar: "عامل مستقل" },
    collaborative: { en: "Team Collaborator", ar: "متعاون جماعي" },
    leader: { en: "Natural Leader", ar: "قائد طبيعي" },
    supporter: { en: "Supportive Team Member", ar: "عضو فريق داعم" }
};

const LEARNING_APPROACH_LABELS: any = {
    hands_on: { en: "Hands-On Learner", ar: "متعلم عملي" },
    analytical: { en: "Analytical Learner", ar: "متعلم تحليلي" },
    social_learner: { en: "Social Learner", ar: "متعلم اجتماعي" },
    structured: { en: "Structured Learner", ar: "متعلم منظم" }
};

const CHALLENGE_RESPONSE_LABELS: any = {
    persistent: { en: "Persistent & Determined", ar: "مثابر وعازم" },
    adaptive: { en: "Flexible & Adaptive", ar: "مرن ومتكيف" },
    help_seeking: { en: "Collaborative Problem-Solver", ar: "حلّال مشكلات تعاوني" },
    creative_solver: { en: "Creative Problem-Solver", ar: "حلّال مشكلات إبداعي" }
};

const DECISION_STYLE_LABELS: any = {
    decisive: { en: "Quick & Decisive", ar: "سريع وحاسم" },
    deliberate: { en: "Thoughtful & Deliberate", ar: "متأنٍ ومتعمّد" },
    consultative: { en: "Consultative & Inclusive", ar: "استشاري وشامل" },
    spontaneous: { en: "Spontaneous & Intuitive", ar: "عفوي وحدسي" }
};

const LEARNING_PACE_LABELS: any = {
    fast: {
        en: "Fast Learner — Picks up new concepts quickly and may need advanced challenges",
        ar: "متعلم سريع — يستوعب المفاهيم الجديدة بسرعة وقد يحتاج تحديات متقدمة"
    },
    steady: {
        en: "Steady Learner — Progresses consistently with regular practice and structure",
        ar: "متعلم ثابت — يتقدم بثبات مع الممارسة المنتظمة والهيكلة"
    },
    reflective: {
        en: "Reflective Learner — Takes time to process deeply; benefits from patient guidance",
        ar: "متعلم تأملي — يأخذ وقتاً للمعالجة العميقة؛ يستفيد من التوجيه الصبور"
    },
    exploratory: {
        en: "Exploratory Learner — Learns best through experimentation and creative exploration",
        ar: "متعلم استكشافي — يتعلم بشكل أفضل من خلال التجربة والاستكشاف الإبداعي"
    }
};

const GROUP_TYPE_LABELS: any = {
    competitive: {
        en: "Competitive/Challenge-Driven Group",
        ar: "مجموعة تنافسية/مدفوعة بالتحديات"
    },
    collaborative: {
        en: "Collaborative/Supportive Group",
        ar: "مجموعة تعاونية/داعمة"
    },
    creative: {
        en: "Creative/Exploratory Group",
        ar: "مجموعة إبداعية/استكشافية"
    },
    structured: {
        en: "Structured/Goal-Oriented Group",
        ar: "مجموعة منظمة/موجهة بالأهداف"
    },
    mixed: {
        en: "Mixed/Balanced Group",
        ar: "مجموعة مختلطة/متوازنة"
    }
};

const EFFORT_LEVEL_LABELS: any = {
    low: {
        en: "Low — Student is self-driven and needs minimal push",
        ar: "منخفض — الطالب ذاتي الدافع ويحتاج دفعاً بسيطاً"
    },
    moderate: {
        en: "Moderate — Student benefits from regular check-ins and encouragement",
        ar: "متوسط — الطالب يستفيد من المتابعة المنتظمة والتشجيع"
    },
    high: {
        en: "High — Student needs structured support, frequent guidance, and patience",
        ar: "عالي — الطالب يحتاج دعماً منظماً وتوجيهاً متكرراً وصبراً"
    }
};

// ============================================================
// 3. CORE EVALUATION ENGINE
// ============================================================

export class SoftSkillsEvaluator {
    ageGroup: string;
    questions: any[];

    constructor(ageGroup: string) {
        this.ageGroup = ageGroup;
        const bank = loadQuestionBank();
        this.questions = bank[ageGroup] || [];
        if (!this.questions.length && ageGroup !== 'test') {
            console.warn(`No questions found for age group ${ageGroup}, loading default or empty`);
        }
    }

    public evaluate(studentInfo: any, answers: { [key: number]: number }): any {
        // Step 1: Validate answers
        const validatedAnswers = this._validateAnswers(answers);

        // Step 2: Calculate raw trait scores
        const { rawScores, maxScores } = this._calculateRawTraitScores(validatedAnswers);

        // Step 3: Normalize trait scores
        const normalizedScores = this._normalizeScores(rawScores, maxScores);

        // Step 4: Collect behavioral indicators
        const indicatorCounts = this._collectIndicators(validatedAnswers);

        // Step 5: Derive behavioral dimensions
        const workStyle = this._deriveDimension(indicatorCounts, "work_style", WORK_STYLE_LABELS);
        const learningApproach = this._deriveDimension(indicatorCounts, "learning_approach", LEARNING_APPROACH_LABELS);
        const challengeResponse = this._deriveDimension(indicatorCounts, "challenge_response", CHALLENGE_RESPONSE_LABELS);
        const decisionStyle = this._deriveDimension(indicatorCounts, "decision_style", DECISION_STYLE_LABELS);

        // Step 6: Determine learning pace
        const learningPace = this._determineLearningPace(normalizedScores, indicatorCounts);

        // Step 7: Determine group placement
        const groupPlacement = this._determineGroupPlacement(normalizedScores, workStyle, learningApproach);

        // Step 8: Determine effort level
        const effortLevel = this._determineEffortLevel(normalizedScores, indicatorCounts);

        // Step 9: Strengths & Growth
        const strengths = this._identifyStrengths(normalizedScores);
        const growthAreas = this._identifyGrowthAreas(normalizedScores);

        // Step 10: Trait categories
        const traitCategories: any = {};
        for (const t of TRAITS) {
            const val = normalizedScores[t] || 0;
            if (val >= 75) traitCategories[t] = 'strong';
            else if (val >= 50) traitCategories[t] = 'moderate';
            else traitCategories[t] = 'developing';
        }

        // Step 11, 12, 13: Summaries
        const personalitySummary = this._generatePersonalitySummary(normalizedScores, workStyle, learningApproach, challengeResponse, decisionStyle, learningPace);
        const instructorRecommendations = this._generateInstructorRecommendations(normalizedScores, workStyle, learningApproach, challengeResponse, learningPace, effortLevel, groupPlacement);
        const motivationStrategies = this._generateMotivationStrategies(normalizedScores, workStyle, learningApproach, challengeResponse);

        return {
            meta: {
                student_name: studentInfo.name || "Unknown",
                age: studentInfo.age || 0,
                age_group: this.ageGroup,
                total_questions_answered: Object.keys(validatedAnswers).length,
                evaluation_date: new Date().toISOString(),
                report_version: "2.0-ts"
            },
            trait_scores: TRAITS.reduce((acc: any, trait) => {
                acc[trait] = {
                    score: Number((normalizedScores[trait] || 0).toFixed(1)),
                    category: traitCategories[trait],
                    label_en: TRAIT_LABELS[trait].en,
                    label_ar: TRAIT_LABELS[trait].ar
                };
                return acc;
            }, {}),
            behavioral_dimensions: {
                work_style: workStyle,
                learning_approach: learningApproach,
                challenge_response: challengeResponse,
                decision_style: decisionStyle
            },
            learning_profile: {
                learning_pace: learningPace,
                group_placement: groupPlacement,
                effort_level: effortLevel
            },
            strengths,
            growth_areas: growthAreas,
            personality_summary: personalitySummary,
            instructor_recommendations: instructorRecommendations,
            motivation_strategies: motivationStrategies,
            raw_data: {
                raw_trait_scores: rawScores,
                max_possible_scores: maxScores,
                indicator_counts: indicatorCounts,
                answers: validatedAnswers
            }
        };
    }

    private _validateAnswers(answers: { [key: number]: number }): { [key: number]: number } {
        const validIds = new Set(this.questions.map(q => q.id));
        const valid: any = {};
        for (const [qid, opts] of Object.entries(answers)) {
            const numQid = Number(qid);
            if (validIds.has(numQid) && typeof opts === 'number' && opts >= 0 && opts <= 3) {
                valid[numQid] = opts;
            }
        }
        return valid;
    }

    private _calculateRawTraitScores(answers: any) {
        const rawScores: any = {};
        const maxScores: any = {};
        TRAITS.forEach(t => { rawScores[t] = 0; maxScores[t] = 0; });

        for (const q of this.questions) {
            const qid = q.id;
            // Max score calculation for normalization
            for (const t of TRAITS) {
                let maxTrait = 0;
                for (const opt of q.options_scoring) {
                    const val = opt.traits?.[t] || 0;
                    if (val > maxTrait) maxTrait = val;
                }
                maxScores[t] += maxTrait;
            }

            if (answers[qid] !== undefined) {
                const optIdx = answers[qid];
                const selectedScoring = q.options_scoring[optIdx];
                for (const t of TRAITS) {
                    rawScores[t] += (selectedScoring.traits?.[t] || 0);
                }
            }
        }
        return { rawScores, maxScores };
    }

    private _normalizeScores(raw: any, maxS: any) {
        const normalized: any = {};
        for (const t of TRAITS) {
            const m = maxS[t] || 1;
            normalized[t] = m > 0 ? (raw[t] / m) * 100 : 0;
        }
        return normalized;
    }

    private _collectIndicators(answers: any) {
        const counts: any = {
            work_style: {},
            learning_approach: {},
            challenge_response: {},
            decision_style: {}
        };

        for (const q of this.questions) {
            if (answers[q.id] !== undefined) {
                const optIdx = answers[q.id];
                const indicators = q.options_scoring[optIdx].indicators;
                for (const [dim, val] of Object.entries(indicators)) {
                    if (counts[dim]) {
                        counts[dim][val as any] = (counts[dim][val as any] || 0) + 1;
                    }
                }
            }
        }
        return counts;
    }

    private _deriveDimension(indicatorCounts: any, dimension: string, labels: any) {
        const counts = indicatorCounts[dimension] || {};
        const entries = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1]);
        const total = Object.values(counts).reduce((a: any, b: any) => a + b, 0) as number;

        if (entries.length === 0) {
            const firstKey = Object.keys(labels)[0];
            return {
                primary: firstKey,
                primary_label_en: labels[firstKey].en,
                primary_label_ar: labels[firstKey].ar,
                secondary: null,
                confidence: 0,
                distribution: {}
            };
        }

        const primary = entries[0][0];
        const primaryCount = entries[0][1] as number;
        const secondary = entries.length > 1 ? entries[1][0] : null;

        const dist: any = {};
        for (const [k, v] of entries) {
            dist[k] = total ? Number(((v as number / total) * 100).toFixed(1)) : 0;
        }

        return {
            primary,
            primary_label_en: labels[primary].en,
            primary_label_ar: labels[primary].ar,
            primary_confidence: total ? Number(((primaryCount / total) * 100).toFixed(1)) : 0,
            secondary,
            secondary_label_en: secondary ? labels[secondary].en : null,
            secondary_label_ar: secondary ? labels[secondary].ar : null,
            distribution: dist
        };
    }

    private _determineLearningPace(scores: any, indicators: any) {
        const analytical = ((scores.critical_thinking || 0) + (scores.problem_solving || 0) + (scores.time_management || 0)) / 3;
        const creative = ((scores.creativity || 0) + (scores.adaptability || 0) + (scores.problem_solving || 0)) / 3;
        const structured = ((scores.time_management || 0) + (scores.critical_thinking || 0)) / 2;
        const social = ((scores.social || 0) + (scores.communication || 0)) / 2;

        let pace = 'steady';
        if (analytical > 70 && creative > 60) pace = 'fast';
        else if (creative > 70) pace = 'exploratory';
        else if (structured < 40 && social < 40) pace = 'reflective';

        return {
            primary: pace,
            primary_label_en: LEARNING_PACE_LABELS[pace].en,
            primary_label_ar: LEARNING_PACE_LABELS[pace].ar,
        };
    }

    private _determineGroupPlacement(scores: any, workStyle: any, learningApproach: any) {
        const ws = workStyle.primary;
        let group = 'mixed';
        if (ws === 'leader') group = 'competitive';
        else if (ws === 'collaborative' || ws === 'supporter') group = 'collaborative';
        else if (learningApproach.primary === 'hands_on') group = 'creative';
        else if (learningApproach.primary === 'structured') group = 'structured';

        return {
            primary: group,
            primary_label_en: GROUP_TYPE_LABELS[group].en,
            primary_label_ar: GROUP_TYPE_LABELS[group].ar,
            group_scores: {}
        };
    }

    private _determineEffortLevel(scores: any, indicators: any) {
        const drive = ((scores.problem_solving || 0) + (scores.time_management || 0) + (scores.critical_thinking || 0)) / 3;
        let level = 'moderate';
        if (drive > 70) level = 'low'; // Low effort needed from instructor
        else if (drive < 40) level = 'high';

        return {
            level,
            label_en: EFFORT_LEVEL_LABELS[level].en,
            label_ar: EFFORT_LEVEL_LABELS[level].ar
        };
    }

    private _getStrengthDescription(trait: string, lang: 'en' | 'ar') {
        const descriptions: any = {
            social: {
                en: "Excellent at building relationships and interacting with peers effectively.",
                ar: "ممتاز في بناء العلاقات والتفاعل الفعال مع الأقران."
            },
            communication: {
                en: "Can articulate ideas clearly and listen actively to others.",
                ar: "يستطيع التعبير عن الأفكار بوضوح والاستماع النشط للآخرين."
            },
            problem_solving: {
                en: "Approaches challenges logically and finds effective solutions.",
                ar: "يتعامل مع التحديات بمهارة ويجد حلولاً فعالة."
            },
            time_management: {
                en: "Uses time wisely and stays organized while completing tasks.",
                ar: "يستخدم الوقت بحكمة ويبقي منظماً أثناء إنجاز المهام."
            },
            teamwork: {
                en: "Works harmoniously within a team and supports group goals.",
                ar: "يعمل بانسجام ضمن الفريق ويدعم أهداف المجموعة."
            },
            leadership: {
                en: "Shows natural ability to guide, motivate, and organize others.",
                ar: "يظهر قدرة طبيعية على توجيه وتحفيز وتنظيم الآخرين."
            },
            creativity: {
                en: "Thinks outside the box and generates unique, imaginative ideas.",
                ar: "يفكر خارج الصندوق ويولد أفكاراً فريدة وخيالية."
            },
            critical_thinking: {
                en: "Analyzes information objectively and makes reasoned judgments.",
                ar: "يحلل المعلومات بموضوعية ويتخذ أحكاماً منطقية."
            },
            emotional_intelligence: {
                en: "Understand own feelings and empathizes well with others.",
                ar: "يفهم مشاعره ويتعاطف جيداً مع الآخرين."
            },
            adaptability: {
                en: "Adjusts quickly to new situations and flexible in changing environments.",
                ar: "يتكيف بسرعة مع المواقف الجديدة ومرن في البيئات المتغيرة."
            }
        };
        return descriptions[trait]?.[lang] || "";
    }

    private _getGrowthDescription(trait: string, lang: 'en' | 'ar') {
        const descriptions: any = {
            social: {
                en: "Could benefit from more opportunities to interact in group settings.",
                ar: "يمكن أن يستفيد من فرص أكثر للتفاعل في البيئات الجماعية."
            },
            communication: {
                en: "May need encouragement to express thoughts more clearly or speak up.",
                ar: "قد يحتاج لتشجيع للتعبير عن الأفكار بوضوح أو التحدث."
            },
            problem_solving: {
                en: "Would benefit from guided practice in breaking down complex problems.",
                ar: "سيستفيد من ممارسة موجهة في تقسيم المشكلات المعقدة."
            },
            time_management: {
                en: "Could improve by using tools like checklists and timers to stay on track.",
                ar: "يمكن أن يتحسن باستخدام أدوات مثل قوائم المراجعة والمؤقتات للبقاء على المسار."
            },
            teamwork: {
                en: "May need support in understanding how to collaborate rather than work alone.",
                ar: "قد يحتاج لدعم في فهم كيفية التعاون بدلاً من العمل منفرداً."
            },
            leadership: {
                en: "Would benefit from opportunities to take charge of small tasks to build confidence.",
                ar: "سيستفيد من فرص لتولي مسؤولية مهام صغيرة وبناء الثقة في توجيه الآخرين."
            },
            creativity: {
                en: "Could be encouraged to explore open-ended projects and express ideas in unconventional ways.",
                ar: "يمكن تشجيعه على استكشاف مشاريع مفتوحة النهاية والتعبير عن الأفكار بطرق غير تقليدية."
            },
            critical_thinking: {
                en: "Would benefit from activities that require analysis, comparison, and evaluating different options.",
                ar: "سيستفيد من أنشطة تتطلب التحليل والمقارنة وتقييم الخيارات المختلفة."
            },
            emotional_intelligence: {
                en: "Could benefit from activities that build self-awareness and understanding of others' feelings.",
                ar: "يمكن أن يستفيد من أنشطة تبني الوعي الذاتي وفهم مشاعر الآخرين."
            },
            adaptability: {
                en: "May need gentle exposure to new situations and encouragement to try different approaches.",
                ar: "قد يحتاج للتعرض اللطيف لمواقف جديدة والتشجيع على تجربة أساليب مختلفة."
            }
        };
        return descriptions[trait]?.[lang] || "";
    }

    private _identifyStrengths(scores: any) {
        return Object.entries(scores)
            .sort((a: any, b: any) => b[1] - a[1])
            .slice(0, 3)
            .map(([trait, score]) => ({
                trait,
                score: Number((score as number).toFixed(1)),
                label_en: TRAIT_LABELS[trait as Trait].en,
                label_ar: TRAIT_LABELS[trait as Trait].ar,
                description_en: this._getStrengthDescription(trait, 'en'),
                description_ar: this._getStrengthDescription(trait, 'ar')
            }));
    }

    private _identifyGrowthAreas(scores: any) {
        return Object.entries(scores)
            .sort((a: any, b: any) => a[1] - b[1])
            .slice(0, 3)
            .map(([trait, score]) => ({
                trait,
                score: Number((score as number).toFixed(1)),
                label_en: TRAIT_LABELS[trait as Trait].en,
                label_ar: TRAIT_LABELS[trait as Trait].ar,
                description_en: this._getGrowthDescription(trait, 'en'),
                description_ar: this._getGrowthDescription(trait, 'ar')
            }));
    }

    private _generatePersonalitySummary(scores: any, workStyle: any, learningApproach: any, challenge: any, decision: any, pace: any) {
        const ws = workStyle.primary;
        const la = learningApproach.primary;
        const cr = challenge.primary;
        const lp = pace.primary;

        const sortedTraits = Object.entries(scores).sort((a: any, b: any) => b[1] - a[1]);
        const top1 = sortedTraits.length > 0 ? sortedTraits[0][0] : "";
        const top2 = sortedTraits.length > 1 ? sortedTraits[1][0] : "";
        const top3 = sortedTraits.length > 2 ? sortedTraits[2][0] : "";

        // ---- English Summary ----
        const summary_en_parts: string[] = [];

        if (ws === "leader") summary_en_parts.push("This student shows strong leadership qualities and naturally takes initiative in group settings.");
        else if (ws === "collaborative") summary_en_parts.push("This student is a natural collaborator who values teamwork and group contribution.");
        else if (ws === "supporter") summary_en_parts.push("This student is a thoughtful team member who supports others and contributes reliably.");
        else summary_en_parts.push("This student works best independently and shows strong self-direction.");

        if (la === "hands_on") summary_en_parts.push("They learn best through hands-on experimentation and building things directly.");
        else if (la === "analytical") summary_en_parts.push("They have an analytical mind and prefer to understand concepts deeply before applying them.");
        else if (la === "social_learner") summary_en_parts.push("They thrive when learning alongside others and benefit from discussion and collaboration.");
        else summary_en_parts.push("They prefer structured learning environments with clear steps and expectations.");

        if (cr === "persistent") summary_en_parts.push("When facing challenges, they show persistence and determination to find a solution.");
        else if (cr === "adaptive") summary_en_parts.push("They adapt quickly to setbacks and are flexible in finding alternative approaches.");
        else if (cr === "help_seeking") summary_en_parts.push("They wisely seek help when stuck and leverage others' knowledge to overcome obstacles.");
        else summary_en_parts.push("They approach problems creatively and often find unique or unconventional solutions.");

        const top_trait_names = [top1, top2, top3].filter(t => t).map(t => TRAIT_LABELS[t as Trait].en);
        if (top_trait_names.length) {
            summary_en_parts.push(top_trait_names.length > 1
                ? `Their strongest areas are ${top_trait_names.slice(0, -1).join(', ')} and ${top_trait_names[top_trait_names.length - 1]}.`
                : `Their strongest area is ${top_trait_names[0]}.`);
        }

        if (lp === "fast") summary_en_parts.push("They tend to pick up new concepts quickly and may benefit from accelerated content.");
        else if (lp === "steady") summary_en_parts.push("They learn at a consistent pace and do well with regular practice and reinforcement.");
        else if (lp === "reflective") summary_en_parts.push("They take time to process information deeply and benefit from patient, guided instruction.");
        else summary_en_parts.push("They learn best through exploration and creative experimentation.");

        // ---- Arabic Summary ----
        const summary_ar_parts: string[] = [];

        if (ws === "leader") summary_ar_parts.push("يُظهر هذا الطالب صفات قيادية قوية ويأخذ المبادرة بشكل طبيعي في الإعدادات الجماعية.");
        else if (ws === "collaborative") summary_ar_parts.push("هذا الطالب متعاون بطبيعته ويقدر العمل الجماعي والمساهمة الجماعية.");
        else if (ws === "supporter") summary_ar_parts.push("هذا الطالب عضو فريق مدروس يدعم الآخرين ويساهم بشكل موثوق.");
        else summary_ar_parts.push("يعمل هذا الطالب بشكل أفضل بشكل مستقل ويُظهر توجيهاً ذاتياً قوياً.");

        if (la === "hands_on") summary_ar_parts.push("يتعلم بشكل أفضل من خلال التجربة العملية وبناء الأشياء مباشرة.");
        else if (la === "analytical") summary_ar_parts.push("يمتلك عقلاً تحليلياً ويفضل فهم المفاهيم بعمق قبل تطبيقها.");
        else if (la === "social_learner") summary_ar_parts.push("يزدهر عند التعلم مع الآخرين ويستفيد من النقاش والتعاون.");
        else summary_ar_parts.push("يفضل بيئات التعلم المنظمة مع خطوات وتوقعات واضحة.");

        if (cr === "persistent") summary_ar_parts.push("عند مواجهة التحديات، يُظهر المثابرة والعزيمة لإيجاد حل.");
        else if (cr === "adaptive") summary_ar_parts.push("يتكيف بسرعة مع الانتكاسات ومرن في إيجاد نهج بديلة.");
        else if (cr === "help_seeking") summary_ar_parts.push("يطلب المساعدة بحكمة عندما يعلق ويستفيد من معرفة الآخرين لتجاوز العقبات.");
        else summary_ar_parts.push("يتعامل مع المشكلات بشكل إبداعي وغالباً ما يجد حلولاً فريدة أو غير تقليدية.");

        const top_trait_names_ar = [top1, top2, top3].filter(t => t).map(t => TRAIT_LABELS[t as Trait].ar);
        if (top_trait_names_ar.length) {
            summary_ar_parts.push(`أقوى مجالاته هي ${top_trait_names_ar.join(' و')}.`);
        }

        if (lp === "fast") summary_ar_parts.push("يميل لاستيعاب المفاهيم الجديدة بسرعة وقد يستفيد من محتوى متقدم.");
        else if (lp === "steady") summary_ar_parts.push("يتعلم بوتيرة ثابتة ويؤدي بشكل جيد مع الممارسة والتعزيز المنتظم.");
        else if (lp === "reflective") summary_ar_parts.push("يأخذ وقتاً لمعالجة المعلومات بعمق ويستفيد من التعليم الصبور والموجه.");
        else summary_ar_parts.push("يتعلم بشكل أفضل من خلال الاستكشاف والتجربة الإبداعية.");

        return {
            en: summary_en_parts.join(" "),
            ar: summary_ar_parts.join(" ")
        };
    }

    private _generateInstructorRecommendations(scores: any, workStyle: any, learningApproach: any,
        challengeResponse: any, learningPace: any, effortLevel: any, groupPlacement: any) {

        const recs_en: string[] = [];
        const recs_ar: string[] = [];

        const ws = workStyle.primary;
        const la = learningApproach.primary;
        const cr = challengeResponse.primary;
        const lp = learningPace.primary;
        const el = effortLevel.level;
        const gp = groupPlacement.primary;

        // 1. Group & Seating
        if (ws === "leader") {
            recs_en.push("Assign leadership roles in group activities — this student will naturally guide others and perform best when given responsibility.");
            recs_ar.push("كلّف هذا الطالب بأدوار قيادية في الأنشطة الجماعية — سيوجه الآخرين بشكل طبيعي ويؤدي بشكل أفضل عند إعطائه المسؤولية.");
        } else if (ws === "collaborative") {
            recs_en.push("Place in groups with other collaborative students — they thrive when working together and bouncing ideas off peers.");
            recs_ar.push("ضعه في مجموعات مع طلاب تعاونيين آخرين — يزدهر عند العمل معاً وتبادل الأفكار مع الأقران.");
        } else if (ws === "supporter") {
            recs_en.push("Pair with a confident peer — this student supports others well and will contribute more when feeling secure in the team.");
            recs_ar.push("اجعله شريكاً مع زميل واثق — هذا الطالب يدعم الآخرين بشكل جيد وسيساهم أكثر عندما يشعر بالأمان في الفريق.");
        } else {
            recs_en.push("Allow individual work time before group activities — this student processes best independently first, then can share insights.");
            recs_ar.push("اسمح بوقت عمل فردي قبل الأنشطة الجماعية — هذا الطالب يعالج بشكل أفضل بشكل مستقل أولاً ثم يمكنه مشاركة الأفكار.");
        }

        // 2. Teaching approach
        if (la === "hands_on") {
            recs_en.push("Use project-based and hands-on activities. Let them build, experiment, and learn through doing rather than reading.");
            recs_ar.push("استخدم الأنشطة القائمة على المشاريع والعملية. دعه يبني ويجرب ويتعلم من خلال العمل بدلاً من القراءة.");
        } else if (la === "analytical") {
            recs_en.push("Present information logically with clear reasoning. Provide 'why' explanations and encourage them to analyze problems before solving.");
            recs_ar.push("قدم المعلومات بشكل منطقي مع تبرير واضح. قدم تفسيرات 'لماذا' وشجعه على تحليل المشاكل قبل الحل.");
        } else if (la === "social_learner") {
            recs_en.push("Facilitate peer learning and group discussions. This student absorbs best when explaining to others and hearing different perspectives.");
            recs_ar.push("سهّل التعلم من الأقران والنقاشات الجماعية. هذا الطالب يستوعب بشكل أفضل عند الشرح للآخرين وسماع وجهات نظر مختلفة.");
        } else {
            recs_en.push("Provide clear instructions, timelines, and structured materials. Break lessons into defined steps with checkpoints.");
            recs_ar.push("قدم تعليمات واضحة وجداول زمنية ومواد منظمة. قسّم الدروس إلى خطوات محددة مع نقاط تفتيش.");
        }

        // 3. Challenge handling
        if (cr === "persistent") {
            recs_en.push("Give progressively harder challenges — they are motivated by difficulty and won't easily give up.");
            recs_ar.push("قدم تحديات أصعب بشكل تدريجي — يتحفزون من الصعوبة ولن يستسلموا بسهولة.");
        } else if (cr === "adaptive") {
            recs_en.push("Expose them to varied problem types — they adapt well but benefit from stretching their comfort zone.");
            recs_ar.push("عرّضهم لأنواع مشاكل متنوعة — يتكيفون جيداً لكنهم يستفيدون من توسيع منطقة راحتهم.");
        } else if (cr === "help_seeking") {
            recs_en.push("Create a safe environment for asking questions. Pair them with patient mentors and encourage them to attempt solutions before seeking help.");
            recs_ar.push("أنشئ بيئة آمنة لطرح الأسئلة. اجعله شريكاً مع مرشدين صبورين وشجعه على محاولة الحلول قبل طلب المساعدة.");
        } else {
            recs_en.push("Encourage open-ended projects where creative problem-solving is valued. Celebrate unconventional approaches.");
            recs_ar.push("شجع المشاريع المفتوحة حيث يُقدَّر حل المشكلات الإبداعي. احتفِ بالنُهج غير التقليدية.");
        }

        // 4. Effort & Motivation
        if (el === "low") {
            recs_en.push("This student is self-motivated. Provide autonomy and advanced material. Avoid over-managing — trust their process.");
            recs_ar.push("هذا الطالب ذاتي الدافع. وفر الاستقلالية والمواد المتقدمة. تجنب الإدارة المفرطة — ثق بعمليته.");
        } else if (el === "moderate") {
            recs_en.push("Regular check-ins and positive reinforcement will keep them on track. Set clear milestones and celebrate small wins.");
            recs_ar.push("المتابعة المنتظمة والتعزيز الإيجابي سيبقيانه على المسار. حدد معالم واضحة واحتفِ بالإنجازات الصغيرة.");
        } else {
            recs_en.push("This student needs frequent encouragement, structured support, and patience. Break tasks into very small steps and offer one-on-one guidance.");
            recs_ar.push("هذا الطالب يحتاج تشجيعاً متكرراً ودعماً منظماً وصبراً. قسّم المهام إلى خطوات صغيرة جداً وقدم توجيهاً فردياً.");
        }

        // 5. Group placement
        recs_en.push(`Recommended group type: ${GROUP_TYPE_LABELS[gp]['en']}.`);
        recs_ar.push(`نوع المجموعة الموصى بها: ${GROUP_TYPE_LABELS[gp]['ar']}.`);

        // 6. Pace
        if (lp === "fast") {
            recs_en.push("Consider placing in an accelerated track or providing bonus challenges to keep engagement high.");
            recs_ar.push("فكر في وضعه في مسار متقدم أو تقديم تحديات إضافية للحفاظ على مستوى عالٍ من المشاركة.");
        } else if (lp === "reflective") {
            recs_en.push("Allow extra processing time and avoid rushing through content. Depth matters more than speed for this student.");
            recs_ar.push("اسمح بوقت معالجة إضافي وتجنب التسرع في المحتوى. العمق أهم من السرعة لهذا الطالب.");
        }

        return {
            en: recs_en,
            ar: recs_ar
        };
    }

    private _generateMotivationStrategies(scores: any, workStyle: any, learningApproach: any, challengeResponse: any) {
        const strategies_en: string[] = [];
        const strategies_ar: string[] = [];

        const ws = workStyle.primary;
        const cr = challengeResponse.primary;

        const sortedTraits = Object.entries(scores).sort((a: any, b: any) => b[1] - a[1]);
        const topTrait = sortedTraits.length > 0 ? sortedTraits[0][0] : "";

        // Based on work style
        if (["leader", "individual"].includes(ws)) {
            strategies_en.push("Give them ownership over a part of the project to fuel their sense of responsibility and pride.");
            strategies_ar.push("أعطهم ملكية جزء من المشروع لتغذية إحساسهم بالمسؤولية والفخر.");
        } else {
            strategies_en.push("Highlight how their contribution makes the team better — they're motivated by belonging and group success.");
            strategies_ar.push("أبرز كيف أن مساهمتهم تجعل الفريق أفضل — يتحفزون من الانتماء ونجاح المجموعة.");
        }

        // Based on top traits
        if (topTrait === "creativity") {
            strategies_en.push("Allow them to customize their work and express their style — creative freedom is highly motivating.");
            strategies_ar.push("اسمح لهم بتخصيص عملهم والتعبير عن أسلوبهم — الحرية الإبداعية محفزة للغاية.");
        } else if (topTrait === "social") {
            strategies_en.push("Use peer recognition and group celebrations — they're energized by positive social interactions.");
            strategies_ar.push("استخدم تقدير الأقران والاحتفالات الجماعية — يتنشطون من التفاعلات الاجتماعية الإيجابية.");
        } else if (["critical_thinking", "problem_solving"].includes(topTrait)) {
            strategies_en.push("Present problems as puzzles or mysteries to solve — intellectual challenges are intrinsically rewarding for them.");
            strategies_ar.push("قدم المشاكل كألغاز أو أسرار لحلها — التحديات الفكرية مكافئة جوهرياً بالنسبة لهم.");
        } else if (topTrait === "leadership") {
            strategies_en.push("Let them mentor or teach younger peers — leadership responsibility is a powerful motivator.");
            strategies_ar.push("دعهم يرشدون أو يعلمون أقراناً أصغر — مسؤولية القيادة محفز قوي.");
        } else if (topTrait === "emotional_intelligence") {
            strategies_en.push("Acknowledge their emotional growth and self-awareness — they appreciate recognition of personal development, not just academic results.");
            strategies_ar.push("اعترف بنموهم العاطفي ووعيهم الذاتي — يقدرون الاعتراف بالتطور الشخصي وليس فقط النتائج الأكاديمية.");
        } else {
            strategies_en.push("Set clear, achievable milestones with visible progress tracking — they're motivated by seeing their own improvement.");
            strategies_ar.push("حدد معالم واضحة وقابلة للتحقيق مع تتبع تقدم مرئي — يتحفزون من رؤية تحسنهم الخاص.");
        }

        // Based on challenge response
        if (cr === "persistent") {
            strategies_en.push("Use achievement badges or milestone rewards — they love the feeling of conquering something difficult.");
            strategies_ar.push("استخدم شارات الإنجاز أو مكافآت المعالم — يحبون الشعور بقهر شيء صعب.");
        } else if (cr === "creative_solver") {
            strategies_en.push("Showcase their unique solutions to the class — being recognized for originality fuels their drive.");
            strategies_ar.push("اعرض حلولهم الفريدة على الصف — الاعتراف بأصالتهم يغذي دافعهم.");
        } else if (cr === "help_seeking") {
            strategies_en.push("Create buddy systems where asking for help is normalized and celebrated, not seen as weakness.");
            strategies_ar.push("أنشئ نظام رفاق حيث طلب المساعدة أمر طبيعي ومحتفى به وليس نقطة ضعف.");
        } else {
            strategies_en.push("Provide multiple pathways to complete tasks — flexibility in approach keeps them engaged.");
            strategies_ar.push("وفر مسارات متعددة لإكمال المهام — المرونة في النهج تبقيهم منخرطين.");
        }

        return {
            en: strategies_en,
            ar: strategies_ar
        };
    }
}
