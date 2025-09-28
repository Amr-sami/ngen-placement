
'use client';
import React, { useState } from 'react';
import Logo from '../Logo';
import Image from 'next/image';
import { sendEmail } from '@/lib/resend';
import { IoLogoWhatsapp } from 'react-icons/io';
import { usePathname } from 'next/navigation';

const ContactUs = () => {
  // Get current pathname to determine which page we're on
  const pathname = usePathname();
  
  // Determine labels based on pathname
  const isParentsPage = pathname?.includes('/ngen-for/parents');
  const isSchoolsPage = pathname?.includes('/ngen-for/schools');
  const isCorporatesPage = pathname?.includes('/ngen-for/corporates');
  
  // State for form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyMail: '',
    companyName: '',
    numberOfStudents: '',
    message: '',
  });
  
  // Add state for form validation
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    companyMail: '',
  });
  
  // Add state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
    
    // Clear submission status when user makes changes
    if (submitStatus.success !== undefined) {
      setSubmitStatus({});
    }
  };
  
  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form inputs
    const newErrors = {
      firstName: formData.firstName.trim() === '' ? 'First name is required' : '',
      lastName: formData.lastName.trim() === '' ? 'Last name is required' : '',
      companyMail: formData.companyMail.trim() === '' 
        ? 'Email is required' 
        : !isValidEmail(formData.companyMail) 
          ? 'Please enter a valid email' 
          : '',
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call sendEmail without expecting a return value
      sendEmail(formData);
      
      // Show success message
      setSubmitStatus({
        success: true,
        message: 'Thank you! Your message has been sent successfully.',
      });
      
      // Reset form data
      setFormData({
        firstName: '',
        lastName: '',
        companyMail: '',
        companyName: '',
        numberOfStudents: '',
        message: '',
      });
    } catch (error) {
      // Show error message
      setSubmitStatus({
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="font-bold text-xl text-purple-dark font-protestRiot mb-8 xl:mb-10 md:text-2xl xl:text-3xl">
        Contact Us
      </h3>

      {/* WHOLE CONTAINER */}
      <div className="flex flex-col lg:flex-row p-6 rounded-3xl border border-solid border-gray-200 gap-6">
        {/* FORM CONTAINER */}
        <div className="bg-[#EDECECB5] basis-4/6 p-6 rounded-[14px]">
          <h5 className="font-bold text-pumpkin xl:text-2xl mb-4">
            Get in Touch
          </h5>
          <p className="text-gray-dark lg:text-blueberry text-sm mb-4">
            Feel free to drop your message below
          </p>

          {/* Form Status Message */}
          {submitStatus.message && (
            <div 
              className={`mb-4 p-3 rounded-md ${
                submitStatus.success 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {submitStatus.message}
            </div>
          )}
          
          {/* FORM FIELDS */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            {/* First Name */}
            <div>
              <label
                className="block text-purple-dark mb-1"
                htmlFor="firstName"
              >
                {isParentsPage ? 'Parent First name' : 
                 isSchoolsPage || isCorporatesPage ? 'Focal point First name' : 
                 'First name'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className={`w-full text-sm py-3 px-4 border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                } rounded-md outline-none`}
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            
            {/* Last Name */}
            <div>
              <label className="block text-purple-dark mb-1" htmlFor="lastName">
                {isParentsPage ? 'Parent Last name' : 
                 isSchoolsPage || isCorporatesPage ? 'Focal point Last name' : 
                 'Last name'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className={`w-full text-sm py-3 px-4 border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                } rounded-md outline-none`}
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
            
            {/* Company Mail */}
            <div>
              <label
                className="block text-purple-dark mb-1"
                htmlFor="companyMail"
              >
                {isParentsPage ? 'Parent Email' : 
                 isSchoolsPage ? 'School website' : 
                 isCorporatesPage ? 'Company Focal point Email' : 
                 'Email'} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="companyMail"
                name="companyMail"
                value={formData.companyMail}
                onChange={handleChange}
                placeholder={isSchoolsPage ? "school.edu" : "Your email address"}
                className={`w-full text-sm py-3 px-4 border ${
                  errors.companyMail ? 'border-red-500' : 'border-gray-300'
                } rounded-md outline-none`}
                disabled={isSubmitting}
              />
              {errors.companyMail && (
                <p className="text-red-500 text-xs mt-1">{errors.companyMail}</p>
              )}
            </div>
            
            {/* Company Name */}
            <div>
              <label
                className="block text-purple-dark mb-1"
                htmlFor="companyName"
              >
                {isParentsPage ? 'Parent Mobile Number' :
                 isSchoolsPage ? 'School name' :
                 'Company name'}
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Company name"
                className="w-full text-sm py-3 px-4 border border-gray-300 rounded-md outline-none"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Number of Students / Employees */}
            <div className="lg:col-span-2">
              <label
                className="block text-purple-dark mb-1"
                htmlFor="numberOfStudents"
              >
                {isParentsPage ? "Number of children" :
                 isSchoolsPage ? "Number of students" :
                 isCorporatesPage ? "Number of targeted employee children" :
                 "Number of students / Employees"}
              </label>
              <input
                type="text"
                id="numberOfStudents"
                name="numberOfStudents"
                value={formData.numberOfStudents}
                onChange={handleChange}
                placeholder="Number of students / Employees"
                className="w-full text-sm py-3 px-4 border border-gray-300 rounded-md outline-none"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Message */}
            <div className="lg:col-span-2">
              <label className="block text-purple-dark mb-1" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                className="w-full p-3 px-6 border text-sm border-gray-300 rounded-md outline-none"
                rows={3}
                disabled={isSubmitting}
              ></textarea>
            </div>
            
            {/* Submit Button */}
            <div className="lg:ml-auto lg:col-span-2">
              <button
                type="submit"
                className={`w-full lg:w-[155px] bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-bold ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>

        {/* LOGO + CONTACT DETAILS */}
        <div className="flex-1 flex flex-col items-center gap-6">
          <div className="bg-gray-default px-6 py-[18px] w-full flex items-center justify-center rounded-[14px]">
            <Logo width={343} height={92} />
          </div>

          <div className="w-full h-full rounded-[14px] bg-blueberry p-6 font-mono">
            <h5 className="mb-5 lg:mb-12 text-white font-bold text-3xl">
              Contact us
            </h5>

            <div className="text-white text-xl space-y-5 mb-6 lg:mb-8">
              {/* Cairo Location */}
              <p className="flex items-start gap-3">
                <Image
                  src="/Location.svg"
                  width={24}
                  height={24}
                  alt="location"
                  className="flex-shrink-0 mt-1"
                />
                <span>15 Al Lasilki, Infront of Maadi Technology Park Ezbet Fahmy, Maadi, Cairo Egypt</span>
              </p>
              
              {/* Dubai Location */}
              <p className="flex items-start gap-3">
                <Image
                  src="/Location.svg"
                  width={24}
                  height={24}
                  alt="location"
                  className="flex-shrink-0 mt-1"
                />
                <span>Business Center 1, M Floor, The Meydan Hotel, Nad Al Sheba, Dubai, U.A.ERiyad, Al-Alia 12211</span>
              </p>
              
              {/* Email */}
              <p className="flex items-start gap-3">
                <Image 
                  src="/envlope.svg" 
                  width={24} 
                  height={24} 
                  alt="mail" 
                  className="flex-shrink-0 mt-1"
                />
                <span>Info@ngenschools.com</span>
              </p>
              
              {/* First Phone Number */}
              <p className="flex items-start gap-3">
                <Image
                  src="/telephone.svg"
                  width={24}
                  height={24}
                  alt="phone"
                  className="flex-shrink-0 mt-1"
                />
                <span>+201055023774</span>
              </p>
              
              {/* Second Phone Number */}
              <p className="flex items-start gap-3">
                <Image
                  src="/telephone.svg"
                  width={24}
                  height={24}
                  alt="phone"
                  className="flex-shrink-0 mt-1"
                />
                <span>+971526542044</span>
              </p>
            </div>
            
            {/* WhatsApp Button */}
            <div className="mb-6">
              <a 
                href="https://wa.me/+201055023774"
                target="_blank"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd59] text-white py-3 px-5 rounded-lg transition-all duration-300 w-full md:w-auto"
              >
                <IoLogoWhatsapp size={22}/>
                <span className="font-semibold">Contact via WhatsApp</span>
              </a>
            </div>

            <div className="flex justify-center items-center mt-4 space-x-6">
              <a href="https://www.facebook.com/ngenschools" target="_blank">
                <Image
                  src="/fb.png"
                  width={40}
                  height={40}
                  alt="facebook"
                />
              </a>
              <a href="https://www.linkedin.com/company/ngenschools/" target="_blank">
                <Image
                  src="/linkedin.svg"
                  width={40}
                  height={40}
                  alt="linkedin"
                />
              </a>
              <a href="https://www.instagram.com/ngenschools/" target="_blank">
                <Image
                  src="/instagram.svg"
                  width={40}
                  height={40}
                  alt="instagram"
                />
              </a>
              <a href="https://www.tiktok.com/@ngenschools" target="_blank">
                <Image
                  src="/tiktok-round-white-icon.webp"
                  width={40}
                  height={40}
                  alt="tiktok"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
