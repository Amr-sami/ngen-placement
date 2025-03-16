import { CallToAction, PageWrapper, TracksSection } from '@/components/general';
import React from 'react';

const TracksPage = () => {
  return (
    <>
      <PageWrapper classNames="container mx-auto">
        <TracksSection title="Available Tracks" />
        {/* <TracksSection title="Upcoming Tracks" /> */}
      </PageWrapper>
      <CallToAction cta="Get Started" />
    </>
  );
};

export default TracksPage;
