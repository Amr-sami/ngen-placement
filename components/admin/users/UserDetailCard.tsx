import { User, Mail, Phone, Calendar, Globe, Briefcase, Award, Clock } from 'lucide-react';
import UserStatusBadge from './UserStatusBadge';
import type { UserDetail } from './types';

interface UserDetailCardProps {
    user: UserDetail;
}

export default function UserDetailCard({ user }: UserDetailCardProps) {
    const totalAttempts = (user.placementTest?.allowedAttempts || 1) + (user.placementTest?.extraAttemptsGrantedBySupport || 0);
    const remainingAttempts = totalAttempts - (user.placementTest?.attemptsUsed || 0);

    return (
        <div className="space-y-6">
            {/* Profile Info */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User size={20} className="text-purple-400" />
                    Profile Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem
                        label="Full Name"
                        value={user.profile?.fullName || `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`}
                    />
                    <InfoItem label="Email" value={user.email} icon={<Mail size={14} />} />
                    <InfoItem
                        label="Phone"
                        value={user.profile?.phoneNumber || 'Not provided'}
                        icon={<Phone size={14} />}
                    />
                    <InfoItem label="Age" value={`${user.profile?.age || 'N/A'} years`} />
                    <InfoItem
                        label="Country"
                        value={user.detectedCountry || user.profile?.address?.country || 'Unknown'}
                        icon={<Globe size={14} />}
                    />
                    <InfoItem
                        label="Join Type"
                        value={user.profile?.joinType || 'Individual'}
                        icon={<Briefcase size={14} />}
                    />
                    {user.profile?.organizationName && (
                        <InfoItem label="Organization" value={user.profile.organizationName} />
                    )}
                    <InfoItem label="How Found Us" value={user.profile?.howDidYouKnowNgen || 'N/A'} />
                </div>
            </div>

            {/* Account Info */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Award size={20} className="text-purple-400" />
                    Account Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Status</p>
                        <UserStatusBadge status={user.status} />
                    </div>
                    <InfoItem label="Role" value={user.role} />
                    <InfoItem label="Auth Provider" value={user.authProvider} />
                    <InfoItem
                        label="Email Verified"
                        value={user.emailVerified ? 'Yes' : 'No'}
                    />
                    <InfoItem
                        label="Joined"
                        value={new Date(user.createdAt).toLocaleDateString()}
                        icon={<Calendar size={14} />}
                    />
                    <InfoItem
                        label="Last Login"
                        value={user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                        icon={<Clock size={14} />}
                    />
                </div>
            </div>

            {/* Placement Test Info */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Award size={20} className="text-purple-400" />
                    Placement Test
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem
                        label="Has Taken Test"
                        value={user.placementTest?.hasTakenAnyPlacementTest ? 'Yes' : 'No'}
                    />
                    <InfoItem
                        label="Attempts Used"
                        value={`${user.placementTest?.attemptsUsed || 0} / ${totalAttempts}`}
                    />
                    <InfoItem
                        label="Remaining Attempts"
                        value={String(remainingAttempts)}
                    />
                    <InfoItem
                        label="Extra Attempts Granted"
                        value={String(user.placementTest?.extraAttemptsGrantedBySupport || 0)}
                    />
                    {user.placementTest?.resultBeltName && (
                        <>
                            <InfoItem
                                label="Result Belt"
                                value={user.placementTest.resultBeltName}
                            />
                            <InfoItem
                                label="Score"
                                value={`${user.placementTest.resultScorePercent || 0}%`}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Progress Info */}
            {user.progress && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Award size={20} className="text-purple-400" />
                        Learning Progress
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem
                            label="Current Track"
                            value={user.progress.currentTrackName || 'Not started'}
                        />
                        <InfoItem
                            label="Current Belt"
                            value={user.progress.currentBeltName || 'Not started'}
                        />
                        <InfoItem
                            label="Belt Level"
                            value={user.progress.beltLevel ? `Level ${user.progress.beltLevel}` : 'N/A'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoItem({
    label,
    value,
    icon
}: {
    label: string;
    value: string;
    icon?: React.ReactNode
}) {
    return (
        <div>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-white flex items-center gap-1.5">
                {icon && <span className="text-gray-400">{icon}</span>}
                {value}
            </p>
        </div>
    );
}
