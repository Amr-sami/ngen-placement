import { H2 } from '@/components/general/Heading'
import React from 'react'

const Policies = () => {
  return (
    <main className='container mx-2 lg:mx-auto mb-4 mt-9 lg:my-16'>
      <H2 classNames='mb-4 lg:mb-10'>Policies</H2>

      <div className='mb-4 lg:mb-10'>
        <h3 className="font-bold text-xl text-pumpkin md:text-2xl xl:text-3xl mb-4 lg:mb-6">Privacy Policy</h3>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4'>Course Structure and Dates </h5>
        <p className='text-gray-tertiary leading-6'>The courses will be delivered in a duration of 10 weeks - 2 sessions per week – 3 hours per session.</p>
        <p className='text-gray-tertiary leading-6'>Limited places are offered in each course/round, so please make sure to meet the announced deadlines to be included in our ranking.</p>
        <p className='text-gray-tertiary leading-6'>First round of courses is planned to start in November 2017. Exact dates will be confirmed upon completion of registration and availability.</p>
        <p className='text-gray-tertiary leading-6'>Classes that will not meet the minimum number of registered and paid students will be cancelled.</p>
        <p className='text-gray-tertiary leading-6'>All courses will be taught in English.</p>
        <p className='text-gray-tertiary leading-6'>Applicants can take only one course at the same round.</p>
      </div>

      <div className='mb-4 lg:mb-10'>
        <h3 className="font-bold text-xl text-pumpkin md:text-2xl xl:text-3xl mb-4 lg:mb-6">Terms & Conditions</h3>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4'>Registration Steps</h5>
        <ul>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Interested applicants are requested to follow the below registration steps and deadlines:</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Fill in the &quot;Online Application&quot; by clicking here and upload a single PDF file containing all the required documents (please see point 4) by latest: September 19th, 2017. Please remember your application number as it will be needed in all further steps</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>You will receive an email with your registration info once you submit your application. Kindly check your spam folder in case the email was not delivered directly to your inbox.</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Applicants may be asked to sit for a personal Interview by the Selection Committee.</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Accepted candidates will receive a &quot;Final Acceptance Offer&quot; to proceed with payment starting 13th of September. Payment deadline will be announced in the offer.</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Final selected and paid candidates will receive their ID card + Course Schedule.</li>
        </ul>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>Required Documents</h5>
        <ul>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Birth Certificate/ National ID or Passport</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Bachelor Certificate (for graduates)</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Bachelor Transcript (for graduates) or Transcript of achieved courses (for undergraduate students)</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Any other achieved Degrees (M.Sc, PhD, Diploma, MBA, etc..)</li>
        </ul>
      </div>

      <div className='mb-4 lg:mb-10'>
        <h3 className="font-bold text-xl text-pumpkin md:text-2xl xl:text-3xl mb-4 lg:mb-6">Cookie Policy</h3>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4'>Course Fees</h5>
        <p className='text-gray-tertiary leading-6'>Course NameCourse Fees iOS for Object Oriented Programmers 3000LE Web Development using PHP 3000LE Mobile Startups 3000LE An Introduction to Data Science 3000LE</p>
        
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>Refund Policy</h5>
        <ul>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Cancellation after receiving the final acceptance and paying the course fees are not allowed and full course fees are not refundable.</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>In case the course is cancelled by GUC, participants are entitled to full refund of the course fees.</li>
        </ul>
      </div>

    </main>
  )
}

export default Policies