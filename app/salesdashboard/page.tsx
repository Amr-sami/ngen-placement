'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    ClipboardCheck,
    BrainCircuit,
    TrendingUp,
    Search,
    Filter,
    LogOut,
    ExternalLink,
    ChevronRight,
    Loader2,
    Calendar,
    Target,
    BarChart3,
    Shield,
    CheckCircle2,
    XCircle,
    Award,
    FileText,
    Mail,
    Phone,
    Info,
    CheckCircle
} from 'lucide-react';
import { getPlacementResultsFromFirebase, PlacementResult } from '@/lib/firebase-service';

const EvaluationBadge = ({ value, label }: { value: number; label: string }) => (
    <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
        <div className="text-2xl font-bold text-cyan-400 mb-1">{value}%</div>
        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{label}</div>
    </div>
);

const CandidateReviewModal = ({ result, onClose }: { result: PlacementResult; onClose: () => void }) => {
    if (!result) return null;

    const isSoftSkills = result.type === 'soft_skills';
    const evaluation = result.evaluation || result.detailedEvaluation;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#0f0f0f] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[32px] shadow-2xl flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-start bg-gradient-to-br from-white/[0.02] to-transparent">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-cyan-500/20">
                            {result.name?.[0]?.toUpperCase() || 'G'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">{result.name || 'Anonymous Guest'}</h2>
                            <div className="flex flex-wrap items-center gap-4 mt-1">
                                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                                    {result.email || 'N/A'}
                                </span>
                                {result.phone && (
                                    <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                        {result.phone}
                                    </span>
                                )}
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isSoftSkills ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                    }`}>
                                    {result.type?.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Survey Data Section */}
                    <section>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <ClipboardCheck className="w-4 h-4 text-cyan-500" />
                            Candidate Profile
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Age', value: result.guestDetails?.age || 'N/A' },
                                { label: 'Country', value: result.guestDetails?.country || 'N/A' },
                                { label: 'City', value: result.guestDetails?.city || 'N/A' },
                                { label: 'School', value: result.guestDetails?.schoolName || 'N/A' },
                                { label: 'Experience', value: result.guestDetails?.techExperience || 'N/A' },
                                { label: 'Preferred House', value: result.guestDetails?.preferredHouse || 'N/A' },
                                { label: 'Heard From', value: result.guestDetails?.heardAboutUs || 'N/A' },
                                { label: 'Assigned Belt', value: result.belt || 'N/A' },
                            ].map(item => (
                                <div key={item.label} className="bg-white/5 border border-white/5 p-3 rounded-xl">
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{item.label}</div>
                                    <div className="text-sm font-medium text-gray-200">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Evaluation Content */}
                    <section className="space-y-6">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4 text-purple-500" />
                            {isSoftSkills ? 'Behavioral Analysis' : 'Technical Proficiency'}
                        </h3>

                        {!evaluation ? (
                            <div className="p-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10 text-gray-500">
                                <Info className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                <p>Detailed evaluation data not available for this record.</p>
                            </div>
                        ) : isSoftSkills ? (
                            <div className="space-y-6">
                                {/* Trait Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {Object.entries(evaluation.trait_scores || {}).map(([key, data]: [string, any]) => (
                                        <EvaluationBadge key={key} value={data.score} label={data.label_en} />
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 p-6 rounded-3xl">
                                    <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Personality Summary
                                    </h4>
                                    <p className="text-sm text-gray-300 leading-relaxed italic">
                                        "{evaluation.personality_summary?.en}"
                                    </p>
                                </div>

                                {/* Dimensions */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Work Style</h4>
                                        <div className="text-lg font-bold text-cyan-400">{evaluation.behavioral_dimensions?.work_style?.primary_label_en}</div>
                                    </div>
                                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Learning Approach</h4>
                                        <div className="text-lg font-bold text-emerald-400">{evaluation.behavioral_dimensions?.learning_approach?.primary_label_en}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Score & Readiness */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-6 rounded-3xl text-center">
                                        <div className="text-4xl font-bold text-emerald-400 mb-1">{evaluation.overall_readiness}%</div>
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Readiness Score</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 p-6 rounded-3xl text-center">
                                        <div className="text-4xl font-bold text-cyan-400 mb-1">{evaluation.assigned_belt || result.belt}</div>
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recommended Belt</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl flex items-center justify-center gap-6">
                                        <div>
                                            <div className="text-2xl font-bold text-white">{evaluation.total_correct} / {evaluation.total_questions}</div>
                                            <div className="text-[10px] font-bold text-gray-500 uppercase">Correct Answers</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Study Plan */}
                                <div className="bg-[#1a1a1a] border border-white/5 p-6 rounded-3xl">
                                    <h4 className="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2">
                                        <Target className="w-4 h-4" />
                                        Recommended Study Plan
                                    </h4>
                                    <ul className="space-y-3">
                                        {(evaluation.study_plan || []).map((step: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                                                <div className="w-5 h-5 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{idx + 1}</div>
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Strengths / Weaknesses */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-2xl">
                                        <h4 className="text-xs font-bold text-emerald-400 uppercase mb-3 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Key Strengths
                                        </h4>
                                        <ul className="space-y-2">
                                            {(evaluation.strengths || []).slice(0, 3).map((s: string, i: number) => (
                                                <li key={i} className="text-xs text-gray-400 flex items-center gap-2 pb-2 border-b border-white/5 last:border-0">• {s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl">
                                        <h4 className="text-xs font-bold text-red-400 uppercase mb-3 flex items-center gap-2">
                                            <XCircle className="w-4 h-4" />
                                            Growth Areas
                                        </h4>
                                        <ul className="space-y-2">
                                            {(evaluation.weaknesses || evaluation.belts_to_study || []).slice(0, 3).map((w: string, i: number) => (
                                                <li key={i} className="text-xs text-gray-400 flex items-center gap-2 pb-2 border-b border-white/5 last:border-0">• {w}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-black/40 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all"
                    >
                        Close Review
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function SalesDashboardPage() {
    const [results, setResults] = useState<PlacementResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'technical' | 'soft_skills'>('all');
    const [selectedResult, setSelectedResult] = useState<PlacementResult | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Source of truth is the API: a non-admin gets 401/403 and we bounce
        // to login. The old `sales_session=true` cookie check was fake — it
        // could be set in DevTools and any unauthenticated visitor who did so
        // would still see the dashboard shell until the API call failed.
        const fetchData = async () => {
            try {
                const res = await fetch('/api/sales/results');
                if (res.status === 401 || res.status === 403) {
                    router.push('/salesdashboard/login');
                    return;
                }
                if (!res.ok) throw new Error('API fetch failed');
                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = async () => {
        // Ends the NextAuth session — the old cookie clear was a no-op once
        // the client-side gate went away.
        try {
            await fetch('/api/auth/signout', { method: 'POST' });
        } catch (err) {
            console.error('Signout failed:', err);
        }
        router.push('/salesdashboard/login');
    };

    const filteredResults = results.filter(res => {
        const searchStr = searchTerm.toLowerCase();
        const matchesSearch =
            (res.name?.toLowerCase() || '').includes(searchStr) ||
            (res.email?.toLowerCase() || '').includes(searchStr) ||
            (res.phone?.toLowerCase() || '').includes(searchStr);
        const matchesType = filterType === 'all' || res.type === filterType;
        return matchesSearch && matchesType;
    });

    const stats = {
        total: results.length,
        technical: results.filter(r => r.type === 'technical').length,
        softSkills: results.filter(r => r.type === 'soft_skills').length,
        avgScore: results.length > 0
            ? Math.round(results.reduce((acc, curr) => acc + (curr.score || 0), 0) / results.length)
            : 0
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                <p className="text-gray-400 font-medium tracking-widest text-xs uppercase animate-pulse">Syncing Surveillance Data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
            {/* Sidebar / Top Nav */}
            <nav className="border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">NGen Sales Surveillance</h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Operational Dashboard v1.0</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-semibold text-white">Sales Agent</span>
                            <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                                Live Session
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto p-6 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Assessments', value: stats.total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                        { label: 'Technical Tests', value: stats.technical, icon: BrainCircuit, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
                        { label: 'Soft Skills', value: stats.softSkills, icon: Target, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                        { label: 'Average Readiness', value: `${stats.avgScore}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl group hover:border-white/10 transition-all relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 p-8 ${stat.bg} rounded-bl-[100px] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                            <div className="relative flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                                    <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Toolbar */}
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 p-1.5 bg-black/40 border border-white/5 rounded-2xl overflow-hidden">
                            {[
                                { id: 'all', label: 'All' },
                                { id: 'technical', label: 'Technical' },
                                { id: 'soft_skills', label: 'Soft Skills' }
                            ].map((btn) => (
                                <button
                                    key={btn.id}
                                    onClick={() => setFilterType(btn.id as any)}
                                    className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${filterType === btn.id
                                        ? 'bg-white/10 text-white shadow-lg'
                                        : 'text-gray-500 hover:text-white'
                                        }`}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left border-b border-white/5">
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Candidate</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contact</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Focus / Track</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Score</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence mode="popLayout">
                                    {filteredResults.length > 0 ? (
                                        filteredResults.map((res) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key={res.id}
                                                className="group hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center font-bold text-gray-400">
                                                            {res.name?.[0]?.toUpperCase() || 'G'}
                                                        </div>
                                                        <div className="font-bold text-sm text-gray-200">{res.name || 'Anonymous Guest'}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-cyan-400 transition-colors">
                                                            <Mail className="w-3 h-3" />
                                                            {res.email || 'N/A'}
                                                        </div>
                                                        {res.phone && (
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 group-hover:text-emerald-400 transition-colors">
                                                                <Phone className="w-3 h-3" />
                                                                {res.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${res.type === 'technical'
                                                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                        }`}>
                                                        {res.type === 'technical' ? 'Technical' : 'Soft Skills'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-xs font-medium text-gray-400">
                                                        {res.track || (res.belt && `Belt: ${res.belt}`) || 'General Assessment'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${res.score}%` }}
                                                                className={`h-full ${res.score >= 80 ? 'bg-emerald-500' :
                                                                    res.score >= 50 ? 'bg-cyan-500' : 'bg-red-500'
                                                                    }`}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-bold">{res.score}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {res.timestamp
                                                            ? new Date(res.timestamp.toString()).toLocaleDateString()
                                                            : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button
                                                        onClick={() => setSelectedResult(res)}
                                                        className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white font-bold text-xs transition-all border border-cyan-500/20 shadow-lg shadow-cyan-500/0 hover:shadow-cyan-500/20 flex items-center gap-2 ml-auto"
                                                    >
                                                        Review
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3 text-gray-600">
                                                    <BarChart3 className="w-10 h-10 opacity-20" />
                                                    <p className="text-sm font-medium tracking-wide">No surveillance records found matching your criteria</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {selectedResult && (
                    <CandidateReviewModal
                        result={selectedResult}
                        onClose={() => setSelectedResult(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
