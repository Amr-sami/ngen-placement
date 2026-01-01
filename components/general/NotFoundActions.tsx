'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFoundActions() {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
                href="/"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
                Go to Homepage
            </Link>
            <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl border border-gray-700 transition-all duration-300"
            >
                Go Back
            </button>
        </div>
    );
}
