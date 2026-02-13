'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
    const pathname = usePathname();

    // Hide footer on placement-test routes
    // Checks if path contains 'placement-test'
    const shouldHideFooter = pathname?.includes('/placement-test');

    if (shouldHideFooter) {
        return null;
    }

    return <Footer />;
}
