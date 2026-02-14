export interface UserPlacementTest {
    hasTakenAnyPlacementTest?: boolean;
    allowedAttempts: number;
    attemptsUsed: number;
    extraAttemptsGrantedBySupport?: number;
    resultBeltName?: string;
    resultScorePercent?: number;
    takenAt?: Date | string | null;
    lastPlacementTestId?: string | null;
    hasTaken?: boolean;
    totalAttempts?: number;
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    fullName?: string;
    phoneNumber?: string;
    parentPhoneNumber?: string;
    age: number;
    dateOfBirth?: Date;
    address?: {
        country?: string;
        city?: string;
    };
    joinType: string;
    organizationName?: string;
    howDidYouKnowNgen: string;
}

export interface UserProgress {
    currentTrackName?: string;
    currentBeltName?: string;
    beltLevel?: number;
}

export interface UserDetail {
    id: string;
    email: string;
    authProvider: string;
    emailVerified: boolean;
    role: string;
    status: string;
    profile: UserProfile;
    progress?: UserProgress;
    placementTest?: UserPlacementTest | null;
    detectedCountry?: string;
    detectedCountryCode?: string;
    createdAt: Date;
    lastLoginAt?: Date;
}

export interface UserActionsPanelUser {
    id: string;
    email: string;
    status: string;
    emailVerified?: boolean;
    placementTest?: {
        allowedAttempts: number;
        attemptsUsed: number;
        extraAttemptsGrantedBySupport?: number;
    } | null;
}
