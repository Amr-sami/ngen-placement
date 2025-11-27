import { TracksSection } from '@/components/general'
import { H2 } from '@/components/general/Heading'
import Image from 'next/image'
import React from 'react'

const SingleInstructor = () => {
  return (
    <main className='container mx-2 lg:mx-auto mb-4 mt-9 lg:my-16'>
      <H2 classNames='mb-4 lg:mb-10'>Instructor details</H2>
      <h3 className="font-bold text-xl text-pumpkin md:text-2xl xl:text-4xl mb-4 lg:mb-6">Personal Details</h3>

      <div className='bg-[#F6F6F6] rounded-3xl border border-solid border-slate-200 p-4 lg:p-6'>
        <div className='flex flex-col lg:flex-row'>
        {/* PROFILE */}
          <div className='flex items-center gap-6 basis-1/3'>
            <Image src="/instructor.png" width={149} height={149} alt="instructor's name" className='rounded-full' />
            <div>
              <p className='font-medium text-3xl'><b className='block'>Mohamed</b> Abd El Rahman</p>
              <p className='text-xl text-[#007DC5] mt-3'>Graphics Instructor</p>
              <div className="flex items-center gap-1 mt-2">
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
          </div>

          {/* STATS */}
          <div className='flex items-center gap-6 mt-5 justify-evenly basis-2/3'>
            <div className='p-4 lg:p-6 rounded-[14px] bg-[#E4E9FD]'>
              <div className='flex gap-3 lg:gap-8'>
                <p className='text-xl lg:text-5xl text-purple-dark'>08</p>
                <Image src="/courses-icon.png" width={50} height={50} alt='courses-icon'/>
              </div>
              <p className='font-bold lg:text-xl mt-4 text-purple-dark'>Course</p>
            </div>

            <div className='p-4 lg:p-6 rounded-[14px] bg-[#F2DBFE]'>
              <div className='flex gap-3 lg:gap-8'>
                <p className='text-xl lg:text-5xl text-[#880AC5]'>500</p>
                <Image src="/account-group.png" width={50} height={50} alt='account-group'/>
              </div>
              <p className='font-bold lg:text-xl mt-4 text-[#880AC5]'>Students</p>
            </div>

            <div className='p-4 lg:p-6 rounded-[14px] bg-[#FFEDE2]'>
              <div className='flex gap-3 lg:gap-8'>
                <p className='text-xl lg:text-5xl text-pumpkin'>20k</p>
                <Image src="/eye.png" width={50} height={50} alt='eye'/>
              </div>
              <p className='font-bold lg:text-xl mt-4 text-pumpkin'>Views</p>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className='text-xl text-gray-dark mt-6 lg:mt-10'>Our mission is simple: to make modern, industry-relevant skills accessible and enjoyable for teenagers. We combine live, expert-led courses with interactive tools to help students discover new interests, connect with mentors, and develop practical skills they can apply both in school and in the real world.</div>
      </div>

      <TracksSection title='Courses' />
    </main>
)
}

export default SingleInstructor