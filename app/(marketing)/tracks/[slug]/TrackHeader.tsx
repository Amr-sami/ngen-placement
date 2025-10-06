'use client';

import React, { useState } from 'react';
import ContactModal from '@/components/general/ContactModal';

interface TrackHeaderProps {
  trackName: string;
}

const TrackHeader: React.FC<TrackHeaderProps> = ({ trackName }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  return (
    <div className='flex justify-between flex-row flex-wrap gap-5'>
      <div>
        <h1 className="text-2xl lg:text-5xl text-purple-dark font-protestRiot">
          Track Details
        </h1>
        <h1 className="text-2xl lg:text-4xl text-pumpkin font-bold">
          {trackName}
        </h1>
      </div>
      <div onClick={() => setIsContactModalOpen(true)} className="w-full sm:w-auto">
        <button className="w-full sm:w-auto px-4 py-2 rounded-lg transition-colors duration-300 ease-linear bg-pumpkin text-white font-bold hover:bg-white hover:text-pumpkin">
          Get Started
        </button>
      </div>
      <ContactModal open={isContactModalOpen} onOpenChange={setIsContactModalOpen} />
    </div>
  );
};

export default TrackHeader;
