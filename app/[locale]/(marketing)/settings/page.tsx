import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth/authOptions'
import SettingsPage from '@/components/pages/Settings/SettingsPage'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect(`/${locale}/auth/login`)
    }

    return <SettingsPage locale={locale} />
}
