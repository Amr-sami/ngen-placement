import Image from 'next/image';
import React from 'react';

const InstructorCard = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="/user-avatar.svg" alt="instructor" width={209} height={209} />
      <p className="font-medium lg:text-xl mt-4 mb-1 lg:mb-2">
        Mohamed Abd El Rahman
      </p>
      <p className="font-bold text-[#007DC5] mb-1 lg:mb-2">Consultant</p>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <svg
            key={index}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={'#FFD700'}
            stroke="#FFD700"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
          </svg>
        ))}
      </div>
    </div>
  );
};

export default InstructorCard;
