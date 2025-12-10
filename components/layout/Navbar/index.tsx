'use client';
import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import Logo from '../../general/Logo';
import Button from '@/components/general/Button';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import {
  getHomeRoute,
  getHomeWithHashRoute,
  getAboutRoute,
  getContactRoute,
  getTracksRoute,
  getBlogRoute,
  getNgenForParentsRoute,
  getNgenForSchoolsRoute,
  getNgenForCorporatesRoute,
  getLoginRoute,
  type HomeSectionHash,
} from '@/util/routes';
import { usePathname, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n';

function Navbar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const t = useTranslations('nav');
  
  // Check if we're on the home page
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  // Handle navigation to home sections
  const handleSectionClick = (e: React.MouseEvent, sectionId: HomeSectionHash) => {
    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    // If not on home page, let the link navigate naturally with hash
  };

  // Define navigation items in order
  const navItems = [
    {
      type: 'section',
      key: 'projects',
      label: t('projects'),
      href: getHomeWithHashRoute(locale, 'projects'),
      sectionId: 'projects' as HomeSectionHash,
    },
    {
      type: 'section',
      key: 'students',
      label: t('students'),
      href: getHomeWithHashRoute(locale, 'students'),
      sectionId: 'students' as HomeSectionHash,
    },
    {
      type: 'dropdown',
      key: 'ngenFor',
      label: t('ngenFor'),
    },
    {
      type: 'route',
      key: 'aboutUs',
      label: t('aboutUs'),
      href: getAboutRoute(locale),
    },
    {
      type: 'section',
      key: 'whyNgen',
      label: t('whyNgen'),
      href: getHomeWithHashRoute(locale, 'why-ngen'),
      sectionId: 'why-ngen' as HomeSectionHash,
    },
    {
      type: 'route',
      key: 'tracks',
      label: t('tracks'),
      href: getTracksRoute(locale),
    },
    {
      type: 'section',
      key: 'pricing',
      label: t('pricing'),
      href: getHomeWithHashRoute(locale, 'pricing'),
      sectionId: 'pricing' as HomeSectionHash,
    },
    {
      type: 'route',
      key: 'blog',
      label: t('blog'),
      href: getBlogRoute(locale),
    },
  ];

  // Reverse items for RTL
  const displayItems = locale === 'ar' ? [...navItems].reverse() : navItems;

  return (
    <nav
      className={`top-0 z-50 w-full text-white bg-background/95 absolute ${
        !isHomePage ? "bg-[url('/assets/images/hero-bg.png')]" : ''
      }`}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-5 flex h-20 items-center justify-between gap-2">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link href={getHomeRoute(locale)}>
            <Logo width={140} height={32} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden xl:flex">
          <NavigationMenuList>
            {displayItems.map((item) => {
              // Handle dropdown (NGen For)
              if (item.type === 'dropdown') {
                return (
                  <NavigationMenuItem key={item.key}>
                    <NavigationMenuTrigger
                      onPointerMove={(e) => e.preventDefault()}
                      onPointerLeave={(e) => e.preventDefault()}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[200px]">
                        <ListItem href={getNgenForParentsRoute(locale)} title="For Parents" />
                        <ListItem href={getNgenForSchoolsRoute(locale)} title="For Schools" />
                        <ListItem href={getNgenForCorporatesRoute(locale)} title="For Corporates" />
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              }

              // Handle section scrolls
              if (item.type === 'section' && item.sectionId) {
                return (
                  <NavigationMenuItem key={item.key}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                        onClick={(e) => handleSectionClick(e, item.sectionId!)}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              }

              // Handle regular routes
              return (
                <NavigationMenuItem key={item.key}>
                  <Link href={item.href!} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Language Switcher, Login & Contact (Desktop) */}
        <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
          <LanguageSwitcher />
          <Button
            href={getLoginRoute(locale)}
            variant="primary"
          >
            {t('login')}
          </Button>
          <Button
            href={getContactRoute(locale)}
            variant="primary"
          >
            {t('contact')}
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="xl:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side={locale === 'ar' ? 'left' : 'right'}>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-col space-y-4">
              {displayItems.map((item) => {
                // Handle dropdown (NGen For)
                if (item.type === 'dropdown') {
                  return (
                    <div key={item.key} className="flex flex-col space-y-2 ltr:pl-4 rtl:pr-4">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        {item.label}
                      </span>
                      <Link
                        href={getNgenForParentsRoute(locale)}
                        className="text-sm font-medium"
                      >
                        For Parents
                      </Link>
                      <Link
                        href={getNgenForSchoolsRoute(locale)}
                        className="text-sm font-medium"
                      >
                        For Schools
                      </Link>
                      <Link
                        href={getNgenForCorporatesRoute(locale)}
                        className="text-sm font-medium"
                      >
                        For Corporates
                      </Link>
                    </div>
                  );
                }

                // Handle section scrolls
                if (item.type === 'section' && item.sectionId) {
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="text-sm font-medium"
                      onClick={(e) => {
                        if (isHomePage) {
                          e.preventDefault();
                          const element = document.getElementById(item.sectionId!);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                }

                // Handle regular routes
                return (
                  <Link
                    key={item.key}
                    href={item.href!}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Language Switcher (Mobile) */}
              <div className="pt-4 border-t">
                <LanguageSwitcher />
              </div>

              {/* Login Button */}
              <Button href={getLoginRoute(locale)} variant="primary" takeFullWidth>
                {t('login')}
              </Button>

              {/* Contact Button */}
              <Button href={getContactRoute(locale)} variant="primary" takeFullWidth>
                {t('contact')}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

export default Navbar;

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
