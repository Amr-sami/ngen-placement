/**
 * Marketing Layout (Placement Test Only)
 * Minimal layout - no Navbar/Footer for a clean placement experience.
 * Language toggle is embedded within the PlacementLanding component.
 */
export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
