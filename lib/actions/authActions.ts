'use server';

import { signIn } from 'next-auth/react';

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    parentPhoneNumber?: string;
    primaryContactType?: 'student' | 'parent';
    age: number;
    dateOfBirth?: string;
    country?: string;
    city?: string;
    joinType: 'individual' | 'organization';
    organizationName?: string;
    howDidYouKnowNgen: string;
}

interface ActionResult {
    ok: boolean;
    error?: string;
    userId?: string;
}

/**
 * Server action for user login
 */
export async function loginAction(formData: FormData): Promise<ActionResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { ok: false, error: 'Email and password are required' };
    }

    try {
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            return { ok: false, error: result.error };
        }

        return { ok: true };
    } catch (error) {
        console.error('Login error:', error);
        return { ok: false, error: 'An unexpected error occurred' };
    }
}

/**
 * Server action for user registration
 */
export async function signupAction(formData: FormData): Promise<ActionResult> {
    const data: RegisterData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        phoneNumber: formData.get('phoneNumber') as string || undefined,
        parentPhoneNumber: formData.get('parentPhoneNumber') as string || undefined,
        primaryContactType: formData.get('primaryContactType') as 'student' | 'parent' || undefined,
        age: parseInt(formData.get('age') as string) || 0,
        dateOfBirth: formData.get('dateOfBirth') as string || undefined,
        country: formData.get('country') as string || undefined,
        city: formData.get('city') as string || undefined,
        joinType: formData.get('joinType') as 'individual' | 'organization' || 'individual',
        organizationName: formData.get('organizationName') as string || undefined,
        howDidYouKnowNgen: formData.get('howDidYouKnowNgen') as string,
    };

    // Validate required fields
    if (!data.email || !data.password || !data.firstName || !data.lastName || !data.age || !data.howDidYouKnowNgen) {
        return { ok: false, error: 'Missing required fields' };
    }

    try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            return { ok: false, error: result.error || 'Registration failed' };
        }

        return { ok: true, userId: result.userId };
    } catch (error) {
        console.error('Signup error:', error);
        return { ok: false, error: 'An unexpected error occurred' };
    }
}

/**
 * Server action for Google OAuth login
 */
export async function googleLoginAction(): Promise<void> {
    await signIn('google', { callbackUrl: '/' });
}
