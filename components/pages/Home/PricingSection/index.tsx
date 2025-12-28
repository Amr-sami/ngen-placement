'use client';

import React, { useState, useEffect } from 'react';
import { H2 } from '@/components/general/Heading';
import Button from '@/components/general/Button';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { getContactRoute, getPlacementTestRoute } from '@/util/routes';
import type { Locale } from '@/i18n';
import { Tag, Package, Check, Sparkles, Zap, Star, Users } from 'lucide-react';
import type { PricingResponse } from '@/app/api/pricing/route';
import { formatPrice } from '@/lib/hooks/useUserLocation';

function HomepagePricingSection() {
  const t = useTranslations('home.sections');
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

  // Package styles using the website's color palette
  const packageStyles = [
    { gradient: 'from-pumpkin via-yellow to-rose', icon: Zap, iconBg: 'bg-pumpkin' },
    { gradient: 'from-purple-dark via-purple-default to-rose', icon: Star, iconBg: 'bg-purple-dark' },
    { gradient: 'from-blueberry via-purple-default to-purple-dark', icon: Sparkles, iconBg: 'bg-blueberry' },
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 bg-gradient-to-b from-purple-darker via-purple-dark to-purple-darker relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-default/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose/15 rounded-full blur-[150px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pumpkin/10 rounded-full blur-[200px]"></div>
      </div>

      <div className="container mx-auto px-5 flex flex-col gap-10 relative z-10">
        {/* Header */}
        <div className="text-center">
          <H2 classNames="text-white">{t('pricing')}</H2>
          <p className="text-purple-light/80 mt-4 max-w-2xl mx-auto text-lg">
            Choose the learning path that works best for you. All options include live sessions,
            projects, and progress tracking.
          </p>

          {/* Currency Badge */}
          {pricing && (
            <div className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/10">
              <Sparkles className="w-4 h-4 text-pumpkin" />
              Prices shown in {currency}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => setActiveTab('perBelt')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === 'perBelt'
                ? 'bg-gradient-to-r from-pumpkin to-rose text-white shadow-lg shadow-pumpkin/30'
                : 'bg-white/5 text-purple-light border border-purple-light/20 hover:bg-white/10 hover:text-white'
              }`}
          >
            <Tag className="w-4 h-4" />
            Per Belt
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === 'packages'
                ? 'bg-gradient-to-r from-purple-default to-rose text-white shadow-lg shadow-purple-default/30'
                : 'bg-white/5 text-purple-light border border-purple-light/20 hover:bg-white/10 hover:text-white'
              }`}
          >
            <Package className="w-4 h-4" />
            Packages
          </button>
          <button
            onClick={() => setActiveTab('organization')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === 'organization'
                ? 'bg-gradient-to-r from-blueberry to-purple-default text-white shadow-lg shadow-blueberry/30'
                : 'bg-white/5 text-purple-light border border-purple-light/20 hover:bg-white/10 hover:text-white'
              }`}
          >
            <Users className="w-4 h-4" />
            Organizations
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-purple-light/30 border-t-pumpkin rounded-full animate-spin"></div>
          </div>
        )}

        {/* Per Belt Tab */}
        {!isLoading && activeTab === 'perBelt' && pricing && (
          <div className="relative bg-purple-darker/50 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-purple-light/10">
            {/* Sale Badge */}
            <div className="absolute -top-4 left-8 bg-gradient-to-r from-pumpkin to-rose text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-pumpkin/30 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {pricing.option1_perBelt.discountPercent}% OFF ALL BELTS
            </div>

            <div className="text-center mb-8 mt-4">
              <h3 className="text-2xl font-bold text-white">Buy Individual Belts</h3>
              <p className="text-purple-light/70 mt-2">Start with any belt and progress at your own pace</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {pricing.option1_perBelt.belts.map((belt) => (
                <div
                  key={belt.code}
                  className="group bg-purple-dark/50 hover:bg-purple-dark rounded-2xl p-5 text-center border border-purple-light/10 hover:border-purple-light/30 transition-all duration-300"
                >
                  <p className="font-semibold text-white text-sm mb-2">{belt.belt}</p>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pumpkin to-yellow">
                    {formatPrice(belt.finalPrice, currency)}
                  </p>
                  <p className="text-xs text-purple-light/50 line-through mt-1">{formatPrice(belt.basePrice, currency)}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button
                href={getPlacementTestRoute(locale)}
                variant="primary"
                classNames="bg-gradient-to-r from-pumpkin to-rose hover:from-pumpkin hover:to-rose/80 shadow-lg shadow-pumpkin/30"
              >
                Take Placement Test
              </Button>
            </div>
          </div>
        )}

        {/* Packages Tab */}
        {!isLoading && activeTab === 'packages' && pricing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {pricing.option2_packages.map((pkg, index) => {
              const style = packageStyles[index];
              const IconComponent = style.icon;

              return (
                <div
                  key={pkg.packageLevel}
                  className="relative group"
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${style.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>

                  <div className="relative bg-purple-darker/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-purple-light/10 hover:border-purple-light/20 transition-all duration-300 h-full flex flex-col">
                    {/* Sale Badge */}
                    <div className={`absolute -top-3 right-6 bg-gradient-to-r ${style.gradient} text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                      <Zap className="w-3 h-3" />
                      SALE
                    </div>

                    {/* Icon & Header */}
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 mx-auto ${style.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                      <p className={`text-sm font-semibold bg-gradient-to-r ${style.gradient} bg-clip-text text-transparent mt-1`}>
                        {pkg.discountPercent}% OFF
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="text-4xl font-black text-white">
                        {formatPrice(pkg.finalPrice, currency)}
                      </div>
                      <p className="text-purple-light/50 text-sm line-through mt-1">
                        {formatPrice(pkg.baseTotal, currency)}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="flex flex-col gap-3 flex-grow mb-6">
                      {pkg.belts.map((belt) => (
                        <li key={belt} className="flex items-center gap-3 text-purple-light/80">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${style.gradient} flex items-center justify-center flex-shrink-0`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm">{belt}</span>
                        </li>
                      ))}
                      <li className="flex items-center gap-3 text-purple-light/80">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${style.gradient} flex items-center justify-center flex-shrink-0`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm">Live interactive sessions</span>
                      </li>
                      <li className="flex items-center gap-3 text-purple-light/80">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${style.gradient} flex items-center justify-center flex-shrink-0`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm">Project-based learning</span>
                      </li>
                    </ul>

                    <Button
                      href={getPlacementTestRoute(locale)}
                      variant="primary"
                      takeFullWidth
                      classNames={`bg-gradient-to-r ${style.gradient} hover:opacity-90 shadow-lg`}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Organizations Tab */}
        {!isLoading && activeTab === 'organization' && (
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blueberry to-purple-default rounded-3xl blur-xl opacity-15"></div>

            <div className="relative bg-purple-darker/60 backdrop-blur-sm rounded-3xl p-10 md:p-16 border border-purple-light/10">
              <div className="max-w-2xl mx-auto text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blueberry to-purple-default rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blueberry/30">
                  <Users className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">
                  Organizations & Schools
                </h3>
                <p className="text-purple-light/70 mb-10 text-lg">
                  Partner with NGEN for customized learning programs. Get volume discounts,
                  dedicated support, and tailored curriculum for your organization.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {[
                    { icon: '🎯', text: 'Custom Curriculum' },
                    { icon: '👥', text: 'Bulk Enrollment' },
                    { icon: '💬', text: 'Dedicated Support' },
                    { icon: '🎓', text: 'Teacher Training' },
                  ].map((item, i) => (
                    <div key={i} className="bg-purple-dark/50 rounded-xl p-4 border border-purple-light/10">
                      <span className="text-2xl mb-2 block">{item.icon}</span>
                      <p className="font-semibold text-white text-sm">{item.text}</p>
                    </div>
                  ))}
                </div>

                <Button
                  href={getContactRoute(locale)}
                  variant="primary"
                  classNames="bg-gradient-to-r from-blueberry to-purple-default hover:from-blueberry hover:to-purple-default/80 shadow-lg shadow-blueberry/30"
                >
                  Contact Us for Custom Quote
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default HomepagePricingSection;
