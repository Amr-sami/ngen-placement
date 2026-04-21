import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
    title: 'NGen Sales Surveillance Dashboard',
    description: 'Internal operational dashboard for test results assessment.',
};

export default function SalesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="font-sans bg-[#050505] text-white antialiased">
                {children}
            </body>
        </html>
    );
}
