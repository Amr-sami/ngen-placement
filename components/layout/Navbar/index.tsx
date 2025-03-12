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
import { ROUTES } from '@/util/routes';
import { usePathname } from 'next/navigation';

function Navbar() {
  const pathname = usePathname();
  return (
    <nav
      className={`top-0 z-50 w-full text-white bg-background/95 absolute ${
        pathname !== '/' ? "bg-[url('/assets/images/hero-bg.png')]" : ''
      }`}
    >
      <div className="container mx-auto px-5 flex h-20 items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Logo width={160} height={35} />
          </Link>
        </div>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {/* About */}
            <NavigationMenuItem>
              <Link href={ROUTES.ABOUT} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About us
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                onPointerMove={(e) => e.preventDefault()}
                onPointerLeave={(e) => e.preventDefault()}
              >
                NGen For
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[200px]">
                  {/* <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          NGen Schools
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Empower Your Creativity and Curiosity
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li> */}
                  <ListItem
                    href={ROUTES.NGEN_FOR.FOR_PARENTS}
                    title="For Parents"
                  />
                  {/* Tailored learning for personal growth */}
                  {/* </ListItem> */}
                  <ListItem
                    href={ROUTES.NGEN_FOR.FOR_SCHOOL}
                    title="For Schools"
                  />
                  {/* Enhance your curriculum with cutting-edge tech education */}
                  {/* </ListItem> */}
                  <ListItem
                    href={ROUTES.NGEN_FOR.FOR_CORPORATES}
                    title="For Corporates"
                  />
                  {/* Upskill your workforce for the digital age */}
                  {/* </ListItem> */}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href={ROUTES.TRACKS} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Tracks
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href={ROUTES.INSTRUCTORS} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Instructors
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {/* <NavigationMenuItem>
              <Link href="#" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Blogs
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="hidden md:block">
          <Button
            href="/contact-us"
            variant="primary"
            classNames="bg-[#627CEE] hover:text-[#627CEE]"
          >
            Contact Us
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-col space-y-4">
              <Link href={ROUTES.ABOUT} className="text-sm font-medium">
                About us
              </Link>
              <Link
                href={ROUTES.NGEN_FOR.FOR_PARENTS}
                className="text-sm font-medium"
              >
                For parents
              </Link>
              <Link
                href={ROUTES.NGEN_FOR.FOR_SCHOOL}
                className="text-sm font-medium"
              >
                For schools
              </Link>
              <Link
                href={ROUTES.NGEN_FOR.FOR_CORPORATES}
                className="text-sm font-medium"
              >
                For corporates
              </Link>
              {/* <Link href={ROUTES.TRACKS} className="text-sm font-medium">
                Tracks
              </Link>
              <Link href={ROUTES.INSTRUCTORS} className="text-sm font-medium">
                Instructors
              </Link> */}
              {/* <Link href="#" className="text-sm font-medium">
                Blogs
              </Link> */}
              <Button href="#" variant="primary" takeFullWidth>
                Start your journey
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
