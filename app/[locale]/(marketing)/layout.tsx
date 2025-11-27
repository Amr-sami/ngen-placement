import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/**
 * Marketing Layout
 * Wraps all marketing pages with Navbar and Footer
 * Note: html, body, fonts, and analytics are handled in parent [locale]/layout.tsx
 */
export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="pt-20">{children}</div>
      <Footer />
    </>
  );
}
