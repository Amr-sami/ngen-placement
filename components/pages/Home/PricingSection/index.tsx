'use client';

import React, { useState, useEffect } from 'react';
import { H2 } from '@/components/general/Heading';
import Button from '@/components/general/Button';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getContactRoute, getPlacementTestRoute } from '@/lib/routes';
import type { Locale } from '@/i18n';
import { Tag, Package, Check, Zap, Users, Trophy, Shield } from 'lucide-react';
import type { PricingResponse, PackagePricing, BeltPricing } from '@/app/api/pricing/route';
import { formatPrice } from '@/lib/hooks/useUserLocation';
import { motion, AnimatePresence } from 'framer-motion';
import HomePurchaseModal, { type PurchaseItem } from './HomePurchaseModal';
import { beltLevels } from '@/components/pages/PlacementTest/Results/types';

// ✅ Messages (adjust paths if yours differ)
import enMessages from '@/messages/en.json';
import arMessages from '@/messages/ar.json';

const MESSAGES = { en: enMessages, ar: arMessages } as const;

// Color Mapping for the Belts
const BELT_THEMES: Record<string, string> = {
  Yellow: '#EAB308',
  Orange: '#F97316',
  Green: '#22C55E',
  Blue: '#3B82F6',
  Purple: '#A855F7',
  Red: '#EF4444',
  Brown: '#B45309',
  Black: '#1E293B',
  White: '#94A3B8',
  Ninja: '#7C3AED',
  Master: '#E11D48',
};

type Particle = {
  id: number;
  width: number;
  height: number;
  left: string;
  top: string;
  duration: number;
};

function HomepagePricingSection() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status: sessionStatus } = useSession();

  const locale = (params?.locale as Locale) || 'en';
  const dict = (MESSAGES[locale as 'en' | 'ar'] ?? MESSAGES.en) as any;
  const t = dict?.pricing ?? MESSAGES.en?.pricing;

  const [pricing, setPricing] = useState<PricingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'perBelt' | 'packages' | 'organization'>('packages');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseItem, setPurchaseItem] = useState<PurchaseItem | null>(null);

  useEffect(() => {
    setParticles(
      [...Array(6)].map((_, i) => ({
        id: i,
        width: Math.random() * 100 + 50,
        height: Math.random() * 100 + 50,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 3 + i,
      })),
    );
  }, []);

  // Get country override from URL for testing (ensure consistent value for useEffect deps)
  const countryOverride = searchParams.get('country') || '';

  // Derived user context
  const isAuthenticated = pricing?.userContext?.isAuthenticated ?? false;
  const hasTakenTest = pricing?.userContext?.hasTakenTest ?? false;
  const isOrganizationHidden = pricing?.option3_organization?.hidden ?? false;

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        // Pass country override if present in URL
        const apiUrl = countryOverride ? `/api/pricing?country=${countryOverride}` : '/api/pricing';
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setPricing(data);

          // If organization tab is hidden and currently selected, switch to packages
          if (data.option3_organization?.hidden && activeTab === 'organization') {
            setActiveTab('packages');
          }

          // If packages should be hidden (single belt remaining), switch to perBelt
          const hasSingleBeltPackage = data.option2_packages?.some((p: { showAsSingleBelt: boolean }) => p.showAsSingleBelt);
          if (hasSingleBeltPackage && activeTab === 'packages') {
            setActiveTab('perBelt');
          }
        }
      } catch (error) {
        console.error('Error fetching pricing:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPricing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStatus, countryOverride]); // Refetch when session or country changes

  const currency = pricing?.currency || 'USD';

  // Handle buy button click
  const handleBuyClick = (type: 'package' | 'belt', data: PackagePricing | BeltPricing) => {
    if (!isAuthenticated) {
      router.push(getPlacementTestRoute(locale));
      return;
    }

    if (!hasTakenTest) {
      router.push(getPlacementTestRoute(locale));
      return;
    }

    if (type === 'package') {
      setPurchaseItem({ type: 'package', data: data as PackagePricing });
      setShowPurchaseModal(true);
    } else {
      // Find belt level info for styling
      const beltData = data as BeltPricing;
      const beltLevel = beltLevels.find(b => beltData.belt.includes(b.belt)) || null;
      setPurchaseItem({ type: 'belt', data: beltData, beltLevel });
      setShowPurchaseModal(true);
    }
  };

  // Determine button text based on state
  const getButtonText = () => {
    if (!isAuthenticated) return t.button.takeYourPlacementTest;
    if (!hasTakenTest) return t.button.takePlacementTest;
    return t.button.enrollNow;
  };

  // Check if packages should be hidden (when only single belt remains in user's package)
  const shouldHidePackages =
    isAuthenticated && hasTakenTest && pricing?.option2_packages?.some(p => p.showAsSingleBelt);

  // Build available tabs based on auth state
  const availableTabs = [
    { id: 'packages', label: t.tabs.bundles, icon: Package, show: !shouldHidePackages },
    { id: 'perBelt', label: t.tabs.singleBelt, icon: Tag, show: true },
    { id: 'organization', label: t.tabs.schools, icon: Users, show: !isOrganizationHidden },
  ].filter(tab => tab.show);

  return (
    <section id="pricing" className="py-16 md:py-20 bg-[#FDFDFF] relative overflow-hidden">
      {/* Animated Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(p => (
          <motion.div
            key={p.id}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute rounded-full bg-[#2e165f]/5"
            style={{ width: p.width, height: p.height, left: p.left, top: p.top }}
          />
        ))}
      </div>

      <div className="container mx-auto px-5 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <H2 classNames="text-[#2e165f] text-4xl md:text-5xl font-black italic">
            {t.sectionTitle}
          </H2>
          <p className="text-slate-400 font-bold mt-2">{t.sectionSubtitle}</p>
        </div>

        {/* Dynamic Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-2 rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex gap-2 border border-slate-50">
            {availableTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'perBelt' | 'packages' | 'organization')}
                className={`flex items-center gap-2 px-6 py-3 rounded-[2rem] text-sm font-black transition-all duration-500 ${
                  activeTab === tab.id ? 'bg-[#2e165f] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isLoading && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* --- Packages Tab --- */}
              {activeTab === 'packages' && pricing && (
                <div
                  className={`grid gap-8 items-center ${
                    pricing.option2_packages.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-3'
                  }`}
                >
                  {pricing.option2_packages.map((pkg, index) => {
                    // Single package = always featured, multiple = middle one is featured
                    const isFeatured = pricing.option2_packages.length === 1 || index === 1;

                    // Determine if there are skipped belts
                    const hasSkippedBelts = pkg.skippedBeltsValue > 0;

                    // Use adjusted pricing ONLY if there are skipped belts, otherwise use original
                    const displayBasePrice = hasSkippedBelts ? pkg.adjustedBaseTotal : pkg.baseTotal;
                    const displayFinalPrice = hasSkippedBelts ? pkg.adjustedFinalPrice : pkg.finalPrice;

                    // If only 1 belt remains, show as single belt
                    if (pkg.showAsSingleBelt && isAuthenticated && hasTakenTest) {
                      const remainingBelt = pkg.belts.find(b => b.status !== 'passed');
                      if (!remainingBelt) return null;

                      return (
                        <motion.div
                          key={pkg.packageLevel}
                          whileHover={{ scale: 1.02 }}
                          className="relative bg-white rounded-[3.5rem] p-8 transition-all flex flex-col border-4 border-[#2e165f] shadow-[0_20px_50px_rgba(46,22,95,0.15)] md:scale-110 z-20"
                        >
                          <div className="text-center mb-6">
                            <p className="text-green-500 text-xs font-black uppercase tracking-widest mb-2">
                              {t.packages.beltMode.mastered}
                            </p>
                            <h3 className="text-2xl font-black text-[#2e165f]">{remainingBelt.name}</h3>
                            <p className="text-slate-400 text-sm mt-1">{t.packages.beltMode.startingLevel}</p>
                          </div>

                          <div className="text-center mb-8">
                            <span className="text-4xl font-black text-[#2e165f]">
                              {formatPrice(Math.round(remainingBelt.price * (1 - pkg.discountPercent / 100)), currency)}
                            </span>
                            <span className="text-slate-300 text-sm line-through decoration-red-400 ml-2">
                              {formatPrice(remainingBelt.price, currency)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleBuyClick('package', pkg)}
                            className="w-full rounded-[1.5rem] py-5 font-black text-sm tracking-wide text-white transition-all hover:scale-105 active:scale-95 bg-[#2e165f] shadow-blue-900/20"
                          >
                            {getButtonText()}
                          </button>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={pkg.packageLevel}
                        whileHover={{ scale: 1.02 }}
                        className={`relative bg-white rounded-[3.5rem] p-8 transition-all flex flex-col ${
                          isFeatured
                            ? 'border-4 border-[#2e165f] shadow-[0_20px_50px_rgba(46,22,95,0.15)] md:scale-110 z-20'
                            : 'border-2 border-slate-100 shadow-xl opacity-90'
                        }`}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`absolute -top-5 -right-2 px-4 py-2 rounded-2xl text-white text-xs font-black shadow-lg ${
                            isFeatured ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-blue-500'
                          }`}
                        >
                          {t.packages.badgeOff.replace('{percent}', String(pkg.discountPercent))}
                        </motion.div>

                        <div className="mb-6">
                          <h3 className={`text-2xl font-black mb-1 ${isFeatured ? 'text-[#2e165f]' : 'text-slate-600'}`}>
                            {pkg.name}
                          </h3>
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full" />
                        </div>

                        <div className="mb-8">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-4xl font-black text-[#2e165f]">
                              {formatPrice(displayFinalPrice, currency)}
                            </span>
                            <span className="text-slate-300 text-sm line-through decoration-red-400">
                              {formatPrice(displayBasePrice, currency)}
                            </span>
                          </div>
                          <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">
                            {hasSkippedBelts
                              ? t.packages.labels.adjustedForYourLevel
                              : pricing.option2_packages.length === 1
                                ? t.packages.labels.recommendedForYou
                                : t.packages.labels.fullAccessBundle}
                          </p>
                        </div>

                        <div className="space-y-3 mb-10 flex-grow">
                          {pkg.belts.map(belt => (
                            <div
                              key={belt.code}
                              className={`flex items-center gap-3 ${belt.status === 'passed' ? 'opacity-50' : ''}`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                  belt.status === 'passed'
                                    ? 'bg-slate-200'
                                    : belt.status === 'starting'
                                      ? 'bg-green-500'
                                      : 'bg-green-100'
                                }`}
                              >
                                <Check
                                  className={`w-3 h-3 stroke-[4px] ${
                                    belt.status === 'passed'
                                      ? 'text-slate-400'
                                      : belt.status === 'starting'
                                        ? 'text-white'
                                        : 'text-green-600'
                                  }`}
                                />
                              </div>

                              <div className="flex-1">
                                <span
                                  className={`text-sm font-bold ${
                                    belt.status === 'passed'
                                      ? 'text-slate-400 line-through'
                                      : belt.status === 'starting'
                                        ? 'text-green-600'
                                        : 'text-slate-500'
                                  }`}
                                >
                                  {belt.name}
                                </span>

                                {belt.status === 'passed' && (
                                  <span className="text-xs text-slate-400 ml-2">{t.packages.beltStatus.alreadyPassed}</span>
                                )}
                                {belt.status === 'starting' && (
                                  <span className="text-xs text-green-500 ml-2">{t.packages.beltStatus.yourLevel}</span>
                                )}
                              </div>

                              {belt.status === 'passed' && (
                                <span className="text-xs text-slate-400 line-through">{formatPrice(belt.price, currency)}</span>
                              )}
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => handleBuyClick('package', pkg)}
                          className={`w-full rounded-[1.5rem] py-5 font-black text-sm tracking-wide text-white transition-all hover:scale-105 active:scale-95 ${
                            isFeatured ? 'bg-[#2e165f] shadow-blue-900/20' : 'bg-slate-800'
                          }`}
                        >
                          {getButtonText()}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* --- Per Belt Tab (COLORIZED) --- */}
              {activeTab === 'perBelt' && pricing && (
                <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-slate-200/40 border border-slate-50">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black text-[#2e165f]">
                      {isAuthenticated && hasTakenTest ? t.perBelt.titleAuthed : t.perBelt.titleGuest}
                    </h3>

                    {!isAuthenticated && (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex items-center gap-2 text-orange-500 font-black text-sm"
                      >
                        <Zap className="w-4 h-4 fill-orange-500" />
                        {t.perBelt.limitedDeals}
                      </motion.div>
                    )}

                    {isAuthenticated && hasTakenTest && (
                      <div className="flex items-center gap-2 text-green-500 font-black text-sm">
                        <Shield className="w-4 h-4" />
                        {t.perBelt.personalized}
                      </div>
                    )}
                  </div>

                  <div
                    className={`grid gap-6 ${
                      pricing.option1_perBelt.belts.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'
                    }`}
                  >
                    {pricing.option1_perBelt.belts.map(belt => {
                      // Extract the color name from the belt string (e.g. "Yellow Belt" -> "Yellow")
                      const beltColor = Object.keys(BELT_THEMES).find(color => belt.belt.includes(color)) || 'White';
                      const themeColor = BELT_THEMES[beltColor];

                      return (
                        <motion.div
                          key={belt.code}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="relative bg-white border-2 border-slate-50 rounded-[2.5rem] p-6 text-center transition-all group overflow-hidden cursor-pointer"
                          style={{ boxShadow: `0 15px 30px -10px ${themeColor}20` }}
                          onClick={() => handleBuyClick('belt', belt)}
                        >
                          {/* Colored Accent Bar */}
                          <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: themeColor }} />

                          {/* Icon Container with dynamic color */}
                          <div
                            className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-black text-lg shadow-lg"
                            style={{ backgroundColor: themeColor, boxShadow: `0 8px 16px ${themeColor}40` }}
                          >
                            <Trophy className="w-6 h-6" />
                          </div>

                          <p className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-1">{belt.belt}</p>

                          <p className="text-2xl font-black text-[#2e165f]">{formatPrice(belt.finalPrice, currency)}</p>

                          <p className="text-[10px] font-bold text-slate-300 line-through mt-0.5 mb-4">
                            {formatPrice(belt.basePrice, currency)}
                          </p>

                          {/* Buy Button */}
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleBuyClick('belt', belt);
                            }}
                            className="w-full py-2 rounded-xl text-xs font-black text-white transition-all hover:scale-105"
                            style={{ backgroundColor: themeColor }}
                          >
                            {getButtonText()}
                          </button>

                          {/* Interactive Hover Glow */}
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none"
                            style={{ backgroundColor: themeColor }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --- Organization Tab --- */}
              {activeTab === 'organization' && (
                <div className="bg-gradient-to-br from-[#2e165f] to-[#1a0c36] rounded-[3.5rem] p-12 text-center text-white relative overflow-hidden">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-20 -right-20 opacity-5"
                  >
                    <Trophy className="w-80 h-80" />
                  </motion.div>

                  <div className="relative z-10 max-w-xl mx-auto">
                    <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
                    <h3 className="text-3xl font-black mb-4 uppercase italic">{t.organization.title}</h3>
                    <p className="text-blue-200 font-medium mb-8">{t.organization.subtitle}</p>
                    <Button
                      href={getContactRoute(locale)}
                      variant="secondary"
                      classNames="bg-white text-[#2e165f] border-none rounded-2xl px-12 font-black shadow-xl"
                    >
                      {t.organization.cta}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {purchaseItem && (
        <HomePurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          item={purchaseItem}
          pricing={pricing}
          currency={currency as 'USD' | 'EGP'}
        />
      )}
    </section>
  );
}

export default HomepagePricingSection;
