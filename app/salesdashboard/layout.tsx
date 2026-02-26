import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

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
            <body className={`${inter.className} bg-[#050505] text-white antialiased`}>
                {children}
            </body>
        </html>
    );
}
