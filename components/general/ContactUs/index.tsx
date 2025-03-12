'use client';
import React, { useState } from 'react';
import Logo from '../Logo';
import Image from 'next/image';
import { sendEmail } from '@/lib/resend';

const ContactUs = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyMail: '',
    companyName: '',
    numberOfStudents: '',
    message: '',
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    sendEmail(formData);

    setFormData({
      firstName: '',
      lastName: '',
      companyMail: '',
      companyName: '',
      numberOfStudents: '',
      message: '',
    });

    // Add form submission logic (e.g., API call)
    alert('Form submitted successfully!');
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
                First name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Name"
                className="w-full text-sm py-3 px-4 border border-gray-300 rounded-md outline-none"
              />
            </div>
            {/* Last Name */}
            <div>
              <label className="block text-purple-dark mb-1" htmlFor="lastName">
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Name"
                className="w-full text-sm py-3 px-4 border border-gray-300 rounded-md outline-none"
              />
            </div>
            {/* Company Mail */}
            <div>
              <label
                className="block text-purple-dark mb-1"
                htmlFor="companyMail"
              >
                Company mail
              </label>
              <input
                type="email"
                id="companyMail"
                name="companyMail"
                value={formData.companyMail}
                onChange={handleChange}
                placeholder="Company mail"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            {/* Company Name */}
            <div>
              <label
                className="block text-purple-dark mb-1"
                htmlFor="companyName"
              >
                Company name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Name"
                className="w-full text-sm py-3 px-4 border border-gray-300 rounded-md outline-none"
              />
            </div>
            {/* Number of Students / Employees */}
            <div className="lg:col-span-2">
              <label
                className="block text-purple-dark mb-1"
                htmlFor="numberOfStudents"
              >
                Number of students / Employees
              </label>
              <input
                type="text"
                id="numberOfStudents"
                name="numberOfStudents"
                value={formData.numberOfStudents}
                onChange={handleChange}
                placeholder="Number of students / Employees"
                className="w-full text-sm py-3 px-4 border border-gray-300 rounded-md outline-none"
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
                placeholder="Message"
                className="w-full p-3 px-6 border text-sm border-gray-300 rounded-md outline-none"
                rows={3}
              ></textarea>
            </div>
            {/* Submit Button */}
            <div className="lg:ml-auto lg:col-span-2">
              <button
                type="submit"
                className="w-full lg:w-[155px] bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-bold"
              >
                Send
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

            <div className="text-white text-xl space-y-4 mb-5 lg:mb-12 ">
              <p className="flex items-start gap-2">
                <Image
                  src="/Location.svg"
                  width={24}
                  height={24}
                  alt="location"
                />
                Egypt — Maadi, Dar El Hussain St., building 5156, ﬂoor 1
              </p>
              <p className="flex items-start gap-2">
                <Image
                  src="/Location.svg"
                  width={24}
                  height={24}
                  alt="location"
                />
                KSA — Riyad, Al-Alia 12211
              </p>
              <p className="flex items-center gap-2">
                <Image src="/envlope.svg" width={24} height={24} alt="mail" />{' '}
                Info@ngenschools.com
              </p>
              <p className="flex items-start gap-2">
                <Image
                  src="/telephone.svg"
                  width={24}
                  height={24}
                  alt="phone"
                />
                +201032422466
              </p>
            </div>

            <div className="flex justify-center items-center mt-4 space-x-6">
              <a href="https://www.facebook.com/ngenschools">
                <Image
                  src="/facebook.svg"
                  width={40}
                  height={40}
                  alt="facebook"
                />
              </a>
              <a href="https://www.linkedin.com/company/ngenschools/">
                <Image
                  src="/linkedin.svg"
                  width={40}
                  height={40}
                  alt="linkedin"
                />
              </a>
              <a href="https://www.instagram.com/ngenschools/">
                <Image
                  src="/instagram.svg"
                  width={40}
                  height={40}
                  alt="instagram"
                />
              </a>
              <a href="#">
                <Image
                  src="/twitter-x.svg"
                  width={40}
                  height={40}
                  alt="twitter-x"
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
