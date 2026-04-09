import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

export const authOptions: NextAuthOptions = {
    providers: [
        // Credentials Provider (Email/Password)
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter email and password');
                }

                // Hardcoded bypass for the Sales Team
                if (
                    credentials.email.toLowerCase() === 'sales@ngen.com' &&
                    credentials.password === 'salesngen206$$'
                ) {
                    return {
                        id: 'sales-hardcoded-id',
                        email: 'sales@ngen.com',
                        name: 'Sales Team',
                        firstName: 'Sales',
                        lastName: 'Team',
                        role: 'sales',
                    };
                }

                await connectToDatabase();

                // Find user and include passwordHash field
                const user = await User.findOne({ email: credentials.email }).select(
                    '+passwordHash'
                );

                if (!user) {
                    throw new Error('No user found with this email');
                }

                if (!user.passwordHash) {
                    throw new Error('Please use your social login method');
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                );

                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                // TODO: Re-enable email verification check after testing
                // if (user.status === 'pending') {
                //     throw new Error('Please verify your email before logging in');
                // }

                if (user.status === 'suspended' || user.status === 'deleted') {
                    throw new Error('Your account has been suspended');
                }

                // Update last login
                user.lastLoginAt = new Date();
                await user.save();

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.profile.fullName || `${user.profile.firstName} ${user.profile.lastName}`,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName,
                    role: user.role,
                    image: user.profile.avatarUrl,
                };
            },
        }),

        // Google Provider (conditional - only if env vars are set)
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
            ? [
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                }),
            ]
            : []),
    ],

    callbacks: {
        async signIn({ user, account }) {
            // Handle Google OAuth sign in
            if (account?.provider === 'google') {
                await connectToDatabase();

                // Check if user exists
                const existingUser = await User.findOne({ email: user.email });

                if (existingUser) {
                    // Update provider info if user exists
                    if (existingUser.authProvider !== 'google') {
                        existingUser.authProvider = 'google';
                        existingUser.emailVerified = true;
                        existingUser.status = 'active';
                        if (user.image) existingUser.profile.avatarUrl = user.image;
                        existingUser.lastLoginAt = new Date();
                        await existingUser.save();
                    } else {
                        existingUser.lastLoginAt = new Date();
                        await existingUser.save();
                    }
                } else {
                    // For Google OAuth, we need to redirect to complete profile
                    // For now, create a basic user - you can enhance this later
                    const nameParts = user.name?.split(' ') || ['User'];
                    const newUser = new User({
                        email: user.email,
                        authProvider: 'google',
                        emailVerified: true,
                        status: 'active',
                        profile: {
                            firstName: nameParts[0],
                            lastName: nameParts.slice(1).join(' ') || '',
                            age: 0, // Will need to be updated
                            joinType: 'individual',
                            howDidYouKnowNgen: 'google',
                            avatarUrl: user.image,
                        },
                    });
                    await newUser.save();
                }
            }
            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as 'student' | 'parent' | 'superadmin' | 'sales' | 'support';
                session.user.firstName = token.firstName as string;
                session.user.lastName = token.lastName as string;
            }
            return session;
        },

        async redirect({ url, baseUrl }) {
            // Handle callbackUrl for super admin
            // If the callback contains /admin, allow it for super admins
            if (url.includes('/admin')) {
                return url;
            }

            // Default redirect behavior
            if (url.startsWith('/')) {
                return `${baseUrl}${url}`;
            }
            if (url.startsWith(baseUrl)) {
                return url;
            }
            return baseUrl;
        },
    },

    pages: {
        signIn: '/en/auth/login',
        error: '/en/auth/login',
    },

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
