import Logo from '@/components/general/Logo';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

function Footer() {
  return (
    <footer className="relative mt-6 py-6 md:py-10 lg:py-20 after:bg-[url('/assets/images/footer-bg-mob.svg')] lg:after:bg-[url('/assets/images/footer-bg.svg')] after:absolute after:content-[''] after:w-full after:h-full after:bottom-0 after:z-0 after:bg-no-repeat after:bg-cover">
      <div className="container mx-auto px-5 flex flex-col gap-6 lg:flex-row relative z-10 mt-20 lg:mt-0">
        <div className="self-center lg:basis-2/6 lg:flex lg:flex-col lg:items-center lg:gap-10">
          <Link href={'/'} className="md:scale-125">
            <Logo width={200} height={100} />
          </Link>
          <div className="hidden lg:block">
            <ul className="flex gap-5 justify-center">
              <li>
                <Link href={'https://www.facebook.com/ngenschools'} target="_blank">
                  <Image
                    src="/assets/images/icons/fb-icon-light.svg"
                    alt="location icon"
                    width={40}
                    height={40}
                  />
                </Link>
              </li>
              <li>
                <Link href={'https://www.linkedin.com/company/ngenschools/'} target="_blank">
                  <Image
                    src="/assets/images/icons/linkedin-icon-light.svg"
                    alt="location icon"
                    width={40}
                    height={40}
                  />
                </Link>
              </li>
              <li>
                <Link href={'https://www.instagram.com/ngenschools/'} target="_blank">
                  <Image
                    src="/assets/images/icons/insta-icon-light.svg"
                    alt="location icon"
                    width={40}
                    height={40}
                  />
                </Link>
              </li>
              <li>
                <Link href={'#'}>
                  <Image
                    src="/assets/images/icons/x-icon-light.svg"
                    alt="location icon"
                    width={40}
                    height={40}
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-5 text-white lg:basis-4/6">
          <div>
            <ul className="flex flex-col gap-2 md:gap-4">
              {/* <li>
                <Link href="/">Home</Link>
              </li> */}
              {/* <li>
                <Link href="/">NGen for</Link>
              </li> */}
              <li>
                <Link href="/about">About us</Link>
              </li>
              <li>
                <Link href="/tracks">Tracks</Link>
              </li>
              {/* <li>
                <Link href="/instructors">Instructors</Link>
              </li> */}

              {/* TODO: To be deleted when we put the other list down below */}
              <li>
                <Link href="/policies">Policies</Link>
              </li>
            </ul>
          </div>
          {/* <div>
            <ul className="flex flex-col gap-2 md:gap-4">
              <li>
                <Link href="/">Blogs</Link>
              </li>
              <li>
                <Link href="/">FAQs</Link>
              </li>
              <li>
                <Link href="/policies">Policies</Link>
              </li>
            </ul>
          </div> */}
          <div className="col-span-2 lg:col-span-1">
            <ul className="flex flex-col gap-2 md:gap-4 ">
              <li>
                <Link href="/ngen-for/schools">For schools</Link>
              </li>
              <li>
                <Link href="/ngen-for/corporates">For corporates</Link>
              </li>
              <li>
                <Link href="/ngen-for/parents">For parents</Link>
              </li>
              {/* <li>
                <Link href="/">For individual</Link>
              </li> */}
            </ul>
          </div>
          <div className="flex flex-col gap-4 col-span-2">
            <h6 className="font-bold text-center md:text-left">Get in touch</h6>
            <ul className="flex flex-col gap-2 md:gap-4 ">
              <li className="flex items-start gap-1">
                <Image
                  src="/assets/images/icons/location-icon.svg"
                  alt="location icon"
                  width={24}
                  height={24}
                />
                <Link href="/">
                  Egypt — Maadi, Dar El Hussain St., building 5156, ﬂoor 1
                </Link>
              </li>
              <li className="flex items-start gap-1">
                <Image
                  src="/assets/images/icons/location-icon.svg"
                  alt="location icon"
                  width={24}
                  height={24}
                />
                <Link href="/">KSA — Riyad, Al-Alia 12211</Link>
              </li>
              <li className="flex items-start gap-1">
                <Image
                  src="/assets/images/icons/mail-icon.svg"
                  alt="location icon"
                  width={24}
                  height={24}
                />
                <Link href="/">Info@ngenschools.com</Link>
              </li>
              <li className="flex items-start gap-1">
                <Image
                  src="/assets/images/icons/phone-icon.svg"
                  alt="location icon"
                  width={24}
                  height={24}
                />
                <p>+201032422466</p>
              </li>
              <li className="flex items-start gap-1">
                <Image
                  src="/assets/images/icons/phone-icon.svg"
                  alt="location icon"
                  width={24}
                  height={24}
                />
                <p>+971526542044</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="md:hidden">
          <ul className="flex gap-5 justify-center">
            <li>
              <Link href="https://www.facebook.com/ngenschools">
                <Image
                  src="/assets/images/icons/fb-icon-light.svg"
                  alt="location icon"
                  width={40}
                  height={40}
                />
              </Link>
            </li>
            <li>
              <Link href="https://www.linkedin.com/company/ngenschools/">
                <Image
                  src="/assets/images/icons/linkedin-icon-light.svg"
                  alt="location icon"
                  width={40}
                  height={40}
                />
              </Link>
            </li>
            <li>
              <Link href="https://www.instagram.com/ngenschools/">
                <Image
                  src="/assets/images/icons/insta-icon-light.svg"
                  alt="location icon"
                  width={40}
                  height={40}
                />
              </Link>
            </li>
            <li>
              <Link href={'#'}>
                <Image
                  src="/assets/images/icons/x-icon-light.svg"
                  alt="location icon"
                  width={40}
                  height={40}
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
