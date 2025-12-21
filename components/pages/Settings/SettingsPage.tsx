'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
    User,
    Shield,
    Save,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Building,
    Calendar,
    Camera,
    LogOut,
    AlertCircle,
    CheckCircle2
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import SettingsInput from './SettingsInput'

interface SettingsPageProps {
    locale: string
}

export default function SettingsPage({ locale }: SettingsPageProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        age: '',
        country: '',
        city: '',
        organizationName: '',
        role: '',
        avatarUrl: ''
    })

    // Fetch initial data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/user/profile')
                if (!res.ok) throw new Error('Failed to load profile')
                const data = await res.json()

                setFormData({
                    firstName: data.profile.firstName || '',
                    lastName: data.profile.lastName || '',
                    email: data.email || '',
                    phone: data.profile.phoneNumber || '',
                    age: data.profile.age || '',
                    country: data.profile.address?.country || '',
                    city: data.profile.address?.city || '',
                    organizationName: data.profile.organizationName || '',
                    role: data.role || 'student',
                    avatarUrl: data.profile.avatarUrl || ''
                })
            } catch (error) {
                console.error(error)
                setMessage({ type: 'error', text: 'Failed to load profile data' })
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setMessage(null)

        try {
            const res = await fetch('/api/user/profile/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to update profile')
            }

            setMessage({ type: 'success', text: 'Profile updated successfully' })
            router.refresh()
        } catch (error) {
            if (error instanceof Error) {
                setMessage({ type: 'error', text: error.message })
            }
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            </div>
        )
    }

    const initials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase()

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col gap-8">

                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                        <p className="text-gray-600">Manage your account preferences and personal information.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Navigation */}
                        <div className="w-full lg:w-64 flex-shrink-0">
                            <nav className="flex lg:flex-col gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'profile'
                                            ? 'bg-purple-50 text-purple-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <User className="w-5 h-5" />
                                    Profile Information
                                </button>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'security'
                                            ? 'bg-purple-50 text-purple-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Shield className="w-5 h-5" />
                                    Security & Account
                                </button>
                                <button
                                    onClick={() => signOut({ callbackUrl: `/${locale}` })}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium text-sm mt-auto"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </nav>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1">
                            {message && (
                                <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    {message.text}
                                </div>
                            )}

                            {activeTab === 'profile' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6 md:p-8 border-b border-gray-100">
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">Profile Details</h2>
                                        <p className="text-sm text-gray-500">Update your photo and personal details.</p>
                                    </div>

                                    <form onSubmit={handleUpdateProfile} className="p-6 md:p-8 space-y-8">
                                        {/* Avatar Section */}
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                {formData.avatarUrl ? (
                                                    <Image
                                                        src={formData.avatarUrl}
                                                        alt="Profile"
                                                        width={100}
                                                        height={100}
                                                        className="rounded-full object-cover border-4 border-gray-100"
                                                    />
                                                ) : (
                                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold p-1 border-4 border-gray-100 shadow-inner">
                                                        {initials}
                                                    </div>
                                                )}
                                                <button type="button" className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors">
                                                    <Camera className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">Profile Photo</h3>
                                                <p className="text-sm text-gray-500 mt-1">This will be displayed on your profile.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <SettingsInput
                                                label="First Name"
                                                icon={User}
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                required
                                            />
                                            <SettingsInput
                                                label="Last Name"
                                                icon={User}
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                required
                                            />
                                            <SettingsInput
                                                label="Age"
                                                icon={Calendar}
                                                type="number"
                                                value={formData.age}
                                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                required
                                            />
                                            <SettingsInput
                                                label="Phone Number"
                                                icon={Phone}
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                            <SettingsInput
                                                label="Country"
                                                icon={MapPin}
                                                value={formData.country}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            />
                                            <SettingsInput
                                                label="City"
                                                icon={Building}
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                            <SettingsInput
                                                label="School / Organization"
                                                icon={Building}
                                                value={formData.organizationName}
                                                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                                                className="md:col-span-2"
                                            />
                                        </div>

                                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-purple-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-5 h-5" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6 md:p-8 border-b border-gray-100">
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">Security & Account</h2>
                                        <p className="text-sm text-gray-500">Manage your login credentials and security.</p>
                                    </div>
                                    <div className="p-6 md:p-8 space-y-8">
                                        <div className="space-y-4">
                                            <SettingsInput
                                                label="Email Address"
                                                icon={Mail}
                                                value={formData.email}
                                                onChange={() => { }}
                                                disabled={true}
                                            />
                                            <p className="text-sm text-gray-500">Your email address is managed by your login provider and cannot be changed here.</p>
                                        </div>

                                        <div className="pt-8 border-t border-gray-100">
                                            <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
                                            <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-start justify-between flex-col md:flex-row gap-4">
                                                <div>
                                                    <h4 className="font-semibold text-red-900">Delete Account</h4>
                                                    <p className="text-sm text-red-700 mt-1">Permanently delete your account and all of your content. This action cannot be undone.</p>
                                                </div>
                                                <button className="px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm">
                                                    Delete Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
