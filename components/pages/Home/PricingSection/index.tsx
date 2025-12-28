'use client';

import React, { useState, useEffect } from 'react';
import { H2 } from '@/components/general/Heading';
import Button from '@/components/general/Button';
import { useParams } from 'next/navigation';
import { getContactRoute, getPlacementTestRoute } from '@/util/routes';
import type { Locale } from '@/i18n';
import { Tag, Package, Check, Sparkles, Zap, Users, Trophy, Star } from 'lucide-react';
import type { PricingResponse } from '@/app/api/pricing/route';
import { formatPrice } from '@/lib/hooks/useUserLocation';
import { motion, AnimatePresence } from 'framer-motion';

// Color Mapping for the Belts
const BELT_THEMES: Record<string, string> = {
  'Yellow': '#EAB308',
  'Orange': '#F97316',
  'Green': '#22C55E',
  'Blue': '#3B82F6',
  'Purple': '#A855F7',
  'Red': '#EF4444',
  'Black': '#1E293B',
  'White': '#94A3B8',
};

function HomepagePricingSection() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [pricing, setPricing] = useState<PricingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'perBelt' | 'packages' | 'organization'>('packages');

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch('/api/pricing');
        if (response.ok) {
          const data = await response.json();
          setPricing(data);
        }
      } catch (error) {
        console.error('Error fetching pricing:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const currency = pricing?.currency || 'USD';

  return (
    <section id="pricing" className="py-16 md:py-20 bg-[#FDFDFF] relative overflow-hidden">
      {/* Animated Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full bg-[#2e165f]/5"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-5 max-w-6xl relative z-10">
        {/* Header with Floating Icon */}
        <div className="text-center mb-12">
          {/* <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-4"
          >
             <div className="bg-yellow-400 p-3 rounded-2xl shadow-lg shadow-yellow-200">
                <Star className="w-6 h-6 text-white fill-white" />
             </div>
          </motion.div> */}
          <H2 classNames="text-[#2e165f] text-4xl md:text-5xl font-black italic">CHOOSE YOUR MISSION</H2>
          <p className="text-slate-400 font-bold mt-2">Level up your skills with NGen Pro</p>
        </div>

        {/* Dynamic Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-2 rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex gap-2 border border-slate-50">
            {[
              { id: 'packages', label: 'Bundles', icon: Package },
              { id: 'perBelt', label: 'Single Belt', icon: Tag },
              { id: 'organization', label: 'Schools', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-[2rem] text-sm font-black transition-all duration-500 ${
                  activeTab === tab.id
                    ? 'bg-[#2e165f] text-white shadow-lg'
                    : 'text-slate-400 hover:bg-slate-50'
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  {pricing.option2_packages.map((pkg, index) => {
                    const isFeatured = index === 1;
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
                          {pkg.discountPercent}% OFF 🔥
                        </motion.div>

                        <div className="mb-6">
                           <h3 className={`text-2xl font-black mb-1 ${isFeatured ? 'text-[#2e165f]' : 'text-slate-600'}`}>{pkg.name}</h3>
                           <div className="w-12 h-1.5 bg-slate-100 rounded-full" />
                        </div>

                        <div className="mb-8">
                          <div className="flex items-baseline gap-2">
                             <span className="text-4xl font-black text-[#2e165f]">{formatPrice(pkg.finalPrice, currency)}</span>
                             <span className="text-slate-300 text-sm line-through decoration-red-400">{formatPrice(pkg.baseTotal, currency)}</span>
                          </div>
                          <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">Full Access Bundle</p>
                        </div>

                        <div className="space-y-4 mb-10 flex-grow">
                          {pkg.belts.map((belt) => (
                            <div key={belt} className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="w-3 h-3 text-green-600 stroke-[4px]" />
                              </div>
                              <span className="text-sm font-bold text-slate-500">{belt}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          href={getPlacementTestRoute(locale)}
                          variant="primary"
                          takeFullWidth
                          classNames={`rounded-[1.5rem] py-5 font-black text-sm tracking-wide ${
                            isFeatured ? 'bg-[#2e165f] shadow-blue-900/20' : 'bg-slate-800'
                          }`}
                        >
                          UNLOCK MISSION
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* --- Per Belt Tab (COLORIZED) --- */}
              {activeTab === 'perBelt' && pricing && (
                <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-slate-200/40 border border-slate-50">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black text-[#2e165f]">Choose Your Level</h3>
                    <motion.div 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex items-center gap-2 text-orange-500 font-black text-sm"
                    >
                      <Zap className="w-4 h-4 fill-orange-500" />
                      LIMITED TIME DEALS
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {pricing.option1_perBelt.belts.map((belt) => {
                      // Extract the color name from the belt string (e.g. "Yellow Belt" -> "Yellow")
                      const beltColor = Object.keys(BELT_THEMES).find(color => belt.belt.includes(color)) || 'White';
                      const themeColor = BELT_THEMES[beltColor];

                      return (
                        <motion.div 
                          key={belt.code} 
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="relative bg-white border-2 border-slate-50 rounded-[2.5rem] p-6 text-center transition-all group overflow-hidden"
                          style={{ boxShadow: `0 15px 30px -10px ${themeColor}20` }}
                        >
                          {/* Colored Accent Bar */}
                          <div 
                            className="absolute top-0 left-0 w-full h-1.5" 
                            style={{ backgroundColor: themeColor }}
                          />

                          {/* Icon Container with dynamic color */}
                          <div 
                            className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-black text-lg shadow-lg"
                            style={{ 
                              backgroundColor: themeColor,
                              boxShadow: `0 8px 16px ${themeColor}40`
                            }}
                          >
                            <Trophy className="w-6 h-6" />
                          </div>

                          <p className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-1">
                            {belt.belt}
                          </p>
                          
                          <p className="text-2xl font-black text-[#2e165f]">
                            {formatPrice(belt.finalPrice, currency)}
                          </p>

                          <p className="text-[10px] font-bold text-slate-300 line-through mt-0.5">
                            {formatPrice(belt.basePrice, currency)}
                          </p>

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
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -right-20 opacity-5"
                  >
                    <Trophy className="w-80 h-80" />
                  </motion.div>
                  
                  <div className="relative z-10 max-w-xl mx-auto">
                    <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
                    <h3 className="text-3xl font-black mb-4 uppercase italic">Squad Missions</h3>
                    <p className="text-blue-200 font-medium mb-8">Special training programs for schools, clubs, and groups of 5+ ninjas.</p>
                    <Button
                      href={getContactRoute(locale)}
                      variant="secondary"
                      classNames="bg-white text-[#2e165f] border-none rounded-2xl px-12 font-black shadow-xl"
                    >
                      CONTACT COMMAND CENTER
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default HomepagePricingSection;