import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/authOptions';
import ProfilePage from '@/components/pages/Profile/ProfilePage';

interface ProfilePageProps {
    params: Promise<{ locale: string }>;
}

export default async function Profile({ params }: ProfilePageProps) {
    const { locale } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect(`/${locale}/auth/login?callbackUrl=/${locale}/profile`);
    }

    return <ProfilePage locale={locale} />;
}
