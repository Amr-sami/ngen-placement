import { H2 } from '@/components/general/Heading'
import React from 'react'


export const metadata = {
  title: "Policies | NGen School Guidelines & Commitments",
  description: "Review NGen’s policies on privacy, safety, and educational quality. We’re committed to a safe, inclusive, and impactful learning environment.",
  keywords: ["NGen school policies", "online school safety", "kids online privacy", "education policies", "NGen guidelines"],
};

const Policies = () => {
  return (
    <main className='container mx-2 lg:mx-auto mb-4 mt-9 lg:my-16'>
      <H2 classNames='mb-4 lg:mb-10'>Policies</H2>

      <div className='mb-4 lg:mb-10'>
        <h3 className="font-bold text-xl text-pumpkin md:text-2xl xl:text-3xl mb-4 lg:mb-6">Privacy Policy</h3>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>1. Introduction</h5>
        <p className='text-gray-tertiary leading-6'>Welcome to NGen! These Terms and Conditions govern your use of our website, accessible at www.ngenschools.com. By using this Website, you agree to comply with these Terms. If you do not agree with any part of these Terms, please refrain from using our services.</p>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>2. Intellectual Property Rights</h5>
        <p className='text-gray-tertiary leading-6'>Unless otherwise stated, NGen and/or its licensors own all intellectual property rights to the content and materials on this Website. Users are granted a limited license to view the materials but are not permitted to: Republish, sell, or sub-license Website content. Modify, distribute, or commercially exploit any Website material. Use this Website in a way that may harm its functionality or restrict access for others.</p>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>3. User Restrictions</h5>
        <p className='text-gray-tertiary leading-6'>When using our Website, you must not: Publish or distribute Website content in any media. Engage in illegal or harmful activities that may damage the Website or its users. Perform data mining, scraping, or any automated data collection processes. Use the Website for unauthorized advertising or marketing. NGen reserves the right to restrict access to certain areas of the Website at any time. Any user credentials (such as login details) must remain confidential.</p>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>4. User Content</h5>
        <p className='text-gray-tertiary leading-6'>By submitting or displaying any content on NGen, you grant us a non-exclusive, worldwide, and sublicensable license to use, modify, and distribute your content across our platform. You must ensure that: You own the rights to your content. Your content does not violate any third-party rights. NGen reserves the right to remove any content that does not comply with these Terms.</p>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>5. No Warranties</h5>
        <p className='text-gray-tertiary leading-6'>This Website is provided &quot;as is&quot;, and NGen makes no guarantees regarding its accuracy, reliability, or availability. Users access and use the Website at their own risk.</p>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>6. Limitation of Liability</h5>
        <p className='text-gray-tertiary leading-6'>NGen, its directors, employees, and affiliates shall not be held liable for: Any indirect, incidental, or consequential damages resulting from Website use. Loss of data, business, or profits due to service interruptions or technical failures.</p>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>7. Severability</h5>
        <p className='text-gray-tertiary leading-6'>If any part of these Terms is found to be invalid or unenforceable under applicable law, the rest of the Terms will remain unaffected.</p>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>8. Modifications to Terms</h5>
        <p className='text-gray-tertiary leading-6'>NGen reserves the right to update or modify these Terms at any time. Continued use of the Website after updates signifies acceptance of the new Terms.</p>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>9. Assignment</h5>
        <p className='text-gray-tertiary leading-6'>NGen may assign or transfer its rights and obligations under these Terms without notice. However, users may not transfer their rights or obligations.</p>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mt-3 lg:mt-4'>10. Entire Agreement</h5>
        <p className='text-gray-tertiary leading-6'>These Terms constitute the entire agreement between NGen and users regarding the Website and supersede any prior agreements.</p>
      </div>

      <div className='mb-4 lg:mb-10'>
        <h3 className="font-bold text-xl text-pumpkin md:text-2xl xl:text-3xl mb-4 lg:mb-6">Terms & Conditions</h3>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4'>Introduction</h5>
        <p className='text-gray-tertiary leading-6'>At NGen, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.</p>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>1. Information We Collect</h5>
        <ul>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>When you use NGen, we may collect the following types of information:</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>✅ Personal Information – Name, email address, phone number, age, and other details you provide during registration.</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>✅ Usage Data – Information about how you interact with our website, including pages visited, time spent, and activities performed.</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>✅ Device & Technical Data – IP address, browser type, operating system, and cookies to improve your experience.</li>
        </ul>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>2. How We Use Your Information</h5>
        <ul>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>We use the collected data to:</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Provide and improve our educational services.</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Personalize your learning experience.</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Communicate updates, offers, and important announcements.</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Ensure the security and functionality of our platform.</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Comply with legal requirements.</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>We do not sell or share your personal data with third parties for marketing purposes.</li>
        </ul>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>3. Cookies & Tracking Technologies</h5>
        <p className='text-gray-tertiary leading-6'>We use the collected data to:</p>
        <p className='text-gray-tertiary leading-6'>We use cookies and similar technologies to enhance user experience and analyze site performance. You can manage cookie preferences through your browser settings.</p>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>4. Data Protection & Security</h5>
        <p className='text-gray-tertiary leading-6'>We implement strict security measures to protect your personal information from unauthorized access, misuse, or loss. However, no online platform can be 100% secure, so we encourage users to take precautions when sharing personal data online.</p>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>5. Third-Party Links & Services</h5>
        <p className='text-gray-tertiary leading-6'>Our website may contain links to external sites. NGen is not responsible for the privacy practices of third-party websites. We recommend reviewing their policies before providing any information.</p>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>6. Your Rights & Choices</h5>
        <ul>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Depending on your location, you may have rights regarding your personal data, including:</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>✅ Accessing, updating, or deleting your personal information.</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>✅ Opting out of marketing emails.</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>✅ Requesting a copy of the data we hold about you.</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>To exercise these rights, contact us at Info@ngenschools.com.</li>
        </ul>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>7. Changes to This Privacy Policy</h5>
        <p className='text-gray-tertiary leading-6'>We may update this Privacy Policy from time to time. Any significant changes will be communicated via email or a notice on our website. Continued use of our services after updates means acceptance of the revised policy.</p>
      </div>
      {/* <div className='mb-4 lg:mb-10'>
        <h3 className="font-bold text-xl text-pumpkin md:text-2xl xl:text-3xl mb-4 lg:mb-6">Cookie Policy</h3>
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4'>Course Fees</h5>
        <p className='text-gray-tertiary leading-6'>Course NameCourse Fees iOS for Object Oriented Programmers 3000LE Web Development using PHP 3000LE Mobile Startups 3000LE An Introduction to Data Science 3000LE</p>
        
        <h5 className='font-bold text-sm lg:text-xl text-purple-dark mb-3 lg:mb-4 mt-4 lg:mt-6'>Refund Policy</h5>
        <ul>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>Cancellation after receiving the final acceptance and paying the course fees are not allowed and full course fees are not refundable.</li>
          <li className='list-disc list-inside ms-1 text-gray-tertiary leading-6'>In case the course is cancelled by GUC, participants are entitled to full refund of the course fees.</li>
        </ul>
      </div> */}
    </main>
  )
}

export default Policies