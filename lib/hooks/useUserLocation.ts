'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface UserLocation {
    country: string;
    countryCode: string;
    currency: 'EGP' | 'USD';
    isLoading: boolean;
    error: string | null;
}

/**
 * Hook to get user's location for currency selection
 * Priority: 1. User profile country, 2. IP geolocation
 */
export function useUserLocation(): UserLocation {
    const { data: session } = useSession();
    const [location, setLocation] = useState<UserLocation>({
        country: 'Unknown',
        countryCode: 'XX',
        currency: 'USD',
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        const detectLocation = async () => {
            try {
                // Check if user is logged in and has country in profile
                if (session?.user) {
                    // Fetch user profile to get country
                    const profileRes = await fetch('/api/user/profile');
                    if (profileRes.ok) {
                        const profileData = await profileRes.json();
                        const country = profileData?.profile?.address?.country;

                        if (country) {
                            const isEgypt = country.toLowerCase().includes('egypt') ||
                                country.toLowerCase() === 'eg' ||
                                country === 'مصر';

                            setLocation({
                                country,
                                countryCode: isEgypt ? 'EG' : 'XX',
                                currency: isEgypt ? 'EGP' : 'USD',
                                isLoading: false,
                                error: null,
                            });
                            return;
                        }
                    }
                }

                // Fallback: Fetch pricing API which auto-detects from IP
                const pricingRes = await fetch('/api/pricing');
                if (pricingRes.ok) {
                    const pricingData = await pricingRes.json();
                    setLocation({
                        country: pricingData.countryCode === 'EG' ? 'Egypt' : 'International',
                        countryCode: pricingData.countryCode || 'XX',
                        currency: pricingData.currency || 'USD',
                        isLoading: false,
                        error: null,
                    });
                    return;
                }

                // Default to USD if all else fails
                setLocation({
                    country: 'Unknown',
                    countryCode: 'XX',
                    currency: 'USD',
                    isLoading: false,
                    error: null,
                });
            } catch (error) {
                console.error('Location detection error:', error);
                setLocation({
                    country: 'Unknown',
                    countryCode: 'XX',
                    currency: 'USD',
                    isLoading: false,
                    error: 'Failed to detect location',
                });
            }
        };

        detectLocation();
    }, [session]);

    return location;
}

/**
 * Utility to format price based on currency
 */
export function formatPrice(amount: number, currency: 'EGP' | 'USD'): string {
    if (currency === 'EGP') {
        return `${amount.toLocaleString()} EGP`;
    }
    return `$${amount.toLocaleString()}`;
}
