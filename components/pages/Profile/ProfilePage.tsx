'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
    User,
    Mail,
    Shield,
    CheckCircle,
    AlertCircle,
    BookOpen,
    Award,
    MapPin,
    Phone,
    School,
    Calendar,
    Clock,
    ArrowRight,
    Loader2,
    CreditCard,
    Check
} from 'lucide-react'

interface ProfileData {
    id: string
    email: string
    emailVerified: boolean
    authProvider: string
    role: string
    status: string
    profile: {
        firstName: string
        lastName: string
        fullName: string
        phoneNumber?: string
        parentPhoneNumber?: string
        age: number
        address?: {
            country?: string
            city?: string
        }
        joinType: string
        organizationName?: string
        howDidYouKnowNgen?: string
        avatarUrl?: string
    }
    placementTest: {
        hasTakenTest: boolean
        attemptsUsed: number
        allowedAttempts: number
        extraAttempts: number
        remainingAttempts: number
        resultBeltName?: string
        resultScorePercent?: number
        resultScore?: number
        resultTotalQuestions?: number
        takenAt?: string
    } | null
    progress: {
        currentTrackName?: string
        currentBeltName?: string
        beltLevel?: number
        trackStartedAt?: string
        completedBeltsCount: number
    } | null
    memberSince: string
    lastLoginAt?: string
}

interface ProfilePageProps {
    locale: string
}

// Status Badge Component
function StatusBadge({ type, label }: { type: 'success' | 'warning' | 'error' | 'info'; label: string }) {
    const styles = {
        success: 'bg-green-100 text-green-700 border-green-200',
        warning: 'bg-orange-100 text-orange-700 border-orange-200',
        error: 'bg-red-100 text-red-700 border-red-200',
        info: 'bg-purple-100 text-purple-700 border-purple-200',
    }
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${styles[type]}`}>
            {label}
        </span>
    )
}

// Profile Card Component
function ProfileCard({ icon: Icon, title, iconColor, children }: {
    icon: React.ElementType;
    title: string;
    iconColor?: string;
    children: React.ReactNode
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full">
            <div className="flex items-center gap-3 mb-5">
                <div className={`p-2 rounded-xl bg-gray-100 ${iconColor || 'text-gray-600'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
            {children}
        </div>
    )
}

export default function ProfilePage({ locale }: ProfilePageProps) {
    const router = useRouter()
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/user/profile')
                if (!response.ok) {
                    throw new Error('Failed to fetch profile')
                }
                const data = await response.json()
                setProfile(data)
            } catch (err) {
                setError('Failed to load profile')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading your profile...</p>
                </div>
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">{error || 'Something went wrong'}</p>
                </div>
            </div>
        )
    }

    const initials = `${profile.profile.firstName.charAt(0)}${profile.profile.lastName.charAt(0)}`.toUpperCase()
    const memberSinceDate = new Date(profile.memberSince).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-5 py-8 md:py-12">
                {/* Header Section */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            {profile.profile.avatarUrl ? (
                                <Image
                                    src={profile.profile.avatarUrl}
                                    alt={profile.profile.fullName}
                                    width={96}
                                    height={96}
                                    className="rounded-full border-4 border-purple-100"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-purple-100">
                                    {initials}
                                </div>
                            )}
                            {/* Verification Badge */}
                            <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white ${profile.emailVerified ? 'bg-green-500' : 'bg-orange-500'}`}>
                                {profile.emailVerified ? (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 text-white" />
                                )}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                {profile.profile.fullName}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-gray-600 mb-3">
                                <span className="flex items-center gap-1.5 text-sm">
                                    <Mail className="w-4 h-4" />
                                    {profile.email}
                                </span>
                                <StatusBadge
                                    type={profile.emailVerified ? 'success' : 'warning'}
                                    label={profile.emailVerified ? 'Verified' : 'Not Verified'}
                                />
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    Member since {memberSinceDate}
                                </span>
                                <StatusBadge type="info" label={profile.role} />
                                <StatusBadge
                                    type={profile.status === 'active' ? 'success' : 'warning'}
                                    label={profile.status}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Current Plan Card */}
                    <ProfileCard icon={CreditCard} title="Current Plan" iconColor="text-indigo-600">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Plan Type</span>
                                <span className="text-gray-900 font-bold capitalize bg-gray-100 px-3 py-1 rounded-lg">
                                    {profile.profile.joinType}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Current Level</span>
                                <span className="text-gray-900 font-semibold">
                                    {profile.progress?.currentBeltName || profile.placementTest?.resultBeltName || "Starter"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Status</span>
                                <span className="text-green-600 font-medium flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Active
                                </span>
                            </div>

                            <div className="pt-3 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Included Features</p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-green-500" />
                                        Access to all {profile.progress?.currentBeltName || "Starter"} resources
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-green-500" />
                                        Progress tracking
                                    </li>
                                    {profile.profile.joinType === 'organization' && (
                                        <li className="flex items-center gap-2 text-sm text-gray-600">
                                            <Check className="w-4 h-4 text-green-500" />
                                            Organization Dashboard
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </ProfileCard>
                    {/* Placement Test Card */}
                    <ProfileCard icon={Award} title="Placement Test" iconColor="text-yellow-600">
                        {(profile.placementTest?.hasTakenTest || profile.placementTest?.resultBeltName) ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Result</span>
                                    <span className="text-gray-900 font-bold text-lg">
                                        {profile.placementTest.resultBeltName} Belt
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Score</span>
                                    <span className="text-gray-900 font-semibold">
                                        {profile.placementTest.resultScore !== undefined && profile.placementTest.resultTotalQuestions
                                            ? `${profile.placementTest.resultScore}/${profile.placementTest.resultTotalQuestions} (${profile.placementTest.resultScorePercent}%)`
                                            : `${profile.placementTest.resultScorePercent}%`
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Attempts</span>
                                    <span className="text-gray-500">
                                        {profile.placementTest.attemptsUsed} / {profile.placementTest.allowedAttempts + profile.placementTest.extraAttempts}
                                    </span>
                                </div>
                                <button
                                    onClick={() => router.push(`/${locale}/placement-test/results`)}
                                    className="w-full mt-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    View Results <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-600 mb-4">
                                    You haven&apos;t taken the placement test yet.
                                </p>
                                <button
                                    onClick={() => router.push(`/${locale}/placement-test/survey`)}
                                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                >
                                    Take Placement Test <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </ProfileCard>

                    {/* Learning Progress Card */}
                    <ProfileCard icon={BookOpen} title="Learning Progress" iconColor="text-green-600">
                        {profile.progress?.currentTrackName ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Current Track</span>
                                    <span className="text-gray-900 font-semibold">
                                        {profile.progress.currentTrackName}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Current Belt</span>
                                    <span className="text-gray-900 font-semibold">
                                        {profile.progress.currentBeltName || 'Not Started'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Belts Completed</span>
                                    <span className="text-gray-500">
                                        {profile.progress.completedBeltsCount}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-600 mb-1">No learning progress yet.</p>
                                <p className="text-gray-400 text-sm">
                                    Complete the placement test to begin your journey!
                                </p>
                            </div>
                        )}
                    </ProfileCard>

                    {/* Personal Info Card */}
                    <ProfileCard icon={User} title="Personal Info" iconColor="text-blue-600">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Age:</span>
                                <span className="text-gray-900">{profile.profile.age} years</span>
                            </div>
                            {profile.profile.phoneNumber && (
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">Phone:</span>
                                    <span className="text-gray-900">{profile.profile.phoneNumber}</span>
                                </div>
                            )}
                            {(profile.profile.address?.city || profile.profile.address?.country) && (
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">Location:</span>
                                    <span className="text-gray-900">
                                        {[profile.profile.address?.city, profile.profile.address?.country]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </ProfileCard>

                    {/* Account & Security Card */}
                    <ProfileCard icon={Shield} title="Account & Security" iconColor="text-purple-600">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Auth Provider</span>
                                <span className="text-gray-900 capitalize">{profile.authProvider}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Account Type</span>
                                <span className="text-gray-900 capitalize">{profile.profile.joinType}</span>
                            </div>
                            {profile.profile.organizationName && (
                                <div className="flex items-center gap-3">
                                    <School className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">Organization:</span>
                                    <span className="text-gray-900">{profile.profile.organizationName}</span>
                                </div>
                            )}
                            {profile.lastLoginAt && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Last Login</span>
                                    <span className="text-gray-400">
                                        {new Date(profile.lastLoginAt).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </ProfileCard>
                </div>
            </div>
        </div>
    )
}
