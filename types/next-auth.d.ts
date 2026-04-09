import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

type UserRole = 'student' | 'parent' | 'superadmin' | 'sales' | 'support';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: UserRole;
            firstName: string;
            lastName: string;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        role?: UserRole;
        firstName?: string;
        lastName?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id?: string;
        role?: UserRole;
        firstName?: string;
        lastName?: string;
    }
}
