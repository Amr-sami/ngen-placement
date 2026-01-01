import NotFoundActions from '@/components/general/NotFoundActions';

export const metadata = {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="text-center">
                {/* 404 Number */}
                <div className="relative">
                    <h1 className="text-[150px] md:text-[200px] font-bold text-gray-800 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            404
                        </span>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-2xl md:text-3xl font-semibold text-white mt-4 mb-2">
                    Page Not Found
                </h2>
                <p className="text-gray-400 max-w-md mx-auto mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>

                {/* Action Buttons */}
                <NotFoundActions />
            </div>
        </div>
    );
}
