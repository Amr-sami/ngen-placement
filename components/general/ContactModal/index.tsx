'use client';

import { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetClose 
} from '@/components/ui/sheet';
import { X } from 'lucide-react';
import { sendEmail } from '@/lib/resend';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactModal = ({ open, onOpenChange }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyMail: '',
    companyName: '',
    phoneNumber: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    companyMail: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {
      firstName: formData.firstName.trim() === '',
      lastName: formData.lastName.trim() === '',
      companyMail: formData.companyMail.trim() === '' || !isValidEmail(formData.companyMail),
    };
    
    setErrors(newErrors);
    
    // If there are errors, stop submission
    if (Object.values(newErrors).some(error => error)) {
      return;
    }
    
    // Submit the form
    setIsSubmitting(true);
    
    // Prepare data for email - similar structure to ContactUs component
    const emailData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      companyMail: formData.companyMail,
      companyName: formData.companyName,
      numberOfStudents: formData.phoneNumber, // Using this field for phone number
      message: formData.message,
    };
    
    try {
      // Call sendEmail without awaiting or expecting a return value
      sendEmail(emailData);
      
      // Show success state immediately
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          companyMail: '',
          companyName: '',
          phoneNumber: '',
          message: '',
        });
        setIsSubmitted(false);
        onOpenChange(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      setIsSubmitting(false);
      alert('There was an error sending your message. Please try again later.');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-purple-dark">Start Your Journey</SheetTitle>
          <SheetDescription className="text-gray-dark">
            Fill out this form and we&apos;ll get back to you soon!
          </SheetDescription>
        </SheetHeader>
        
        {isSubmitted ? (
          <div className="mt-6 flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-green-600 mb-2">Thank you!</h3>
            <p className="text-center text-gray-600">Your message has been sent successfully. We&apos;ll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-purple-dark mb-1" htmlFor="firstName">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className={`w-full text-sm py-3 px-4 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md outline-none`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">First name is required</p>
                )}
              </div>
              
              {/* Last Name */}
              <div>
                <label className="block text-purple-dark mb-1" htmlFor="lastName">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className={`w-full text-sm py-3 px-4 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md outline-none`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">Last name is required</p>
                )}
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-purple-dark mb-1" htmlFor="companyMail">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="companyMail"
                name="companyMail"
                value={formData.companyMail}
                onChange={handleChange}
                placeholder="Your email address"
                className={`w-full text-sm py-3 px-4 border ${errors.companyMail ? 'border-red-500' : 'border-gray-300'} rounded-md outline-none`}
              />
              {errors.companyMail && (
                <p className="text-red-500 text-xs mt-1">Please enter a valid email</p>
              )}
            </div>
            
            {/* Phone Number */}
            <div>
              <label className="block text-purple-dark mb-1" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Your phone number (optional)"
                className="w-full text-sm py-3 px-4 border border-gray-300 rounded-md outline-none"
              />
            </div>
            
            {/* School/Organization */}
            <div>
              <label className="block text-purple-dark mb-1" htmlFor="companyName">
                School/Organization
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Your school or organization (optional)"
                className="w-full text-sm py-3 px-4 border border-gray-300 rounded-md outline-none"
              />
            </div>
            
            {/* Message */}
            <div>
              <label className="block text-purple-dark mb-1" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message (optional)"
                className="w-full text-sm py-3 px-4 border border-gray-300 rounded-md outline-none"
                rows={3}
              />
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-auto px-6 py-3 bg-pumpkin text-white font-bold rounded-lg hover:bg-orange-600 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
        
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default ContactModal;
