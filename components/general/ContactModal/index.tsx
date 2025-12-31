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
import { useRTL } from '@/hooks/useRTL';
import { useTranslations } from 'next-intl';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactModal = ({ open, onOpenChange }: ContactModalProps) => {
  const isRTL = useRTL();
  const t = useTranslations('contactModal');
  
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
      <SheetContent side={isRTL ? 'left' : 'right'} className="sm:max-w-md md:max-w-lg overflow-y-auto [&>button:last-of-type]:hidden">
        <SheetHeader className={isRTL ? 'text-right' : 'text-left'}>
          <SheetTitle className={`text-2xl font-bold text-purple-dark ${isRTL ? 'text-right' : 'text-left'}`}>{t('title')}</SheetTitle>
          <SheetDescription className={`text-gray-dark ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('description')}
          </SheetDescription>
        </SheetHeader>
        
        {isSubmitted ? (
          <div className="mt-6 flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-green-600 mb-2">{t('success.title')}</h3>
            <p className="text-center text-gray-600">{t('success.message')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className={`block text-purple-dark mb-1 ${isRTL ? 'text-right' : 'text-left'}`} htmlFor="firstName">
                  {t('fields.firstName.label')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={t('fields.firstName.placeholder')}
                  className={`w-full text-sm py-3 px-4 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                {errors.firstName && (
                  <p className={`text-red-500 text-xs mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{t('fields.firstName.error')}</p>
                )}
              </div>
              
              {/* Last Name */}
              <div>
                <label className={`block text-purple-dark mb-1 ${isRTL ? 'text-right' : 'text-left'}`} htmlFor="lastName">
                  {t('fields.lastName.label')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder={t('fields.lastName.placeholder')}
                  className={`w-full text-sm py-3 px-4 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                {errors.lastName && (
                  <p className={`text-red-500 text-xs mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{t('fields.lastName.error')}</p>
                )}
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label className={`block text-purple-dark mb-1 ${isRTL ? 'text-right' : 'text-left'}`} htmlFor="companyMail">
                {t('fields.email.label')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="companyMail"
                name="companyMail"
                value={formData.companyMail}
                onChange={handleChange}
                placeholder={t('fields.email.placeholder')}
                className={`w-full text-sm py-3 px-4 border ${errors.companyMail ? 'border-red-500' : 'border-gray-300'} rounded-md outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              {errors.companyMail && (
                <p className={`text-red-500 text-xs mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{t('fields.email.error')}</p>
              )}
            </div>
            
            {/* Phone Number */}
            <div>
              <label className={`block text-purple-dark mb-1 ${isRTL ? 'text-right' : 'text-left'}`} htmlFor="phoneNumber">
                {t('fields.phone.label')}
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder={t('fields.phone.placeholder')}
                className={`w-full text-sm py-3 px-4 border border-gray-300 rounded-md outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            
            {/* School/Organization */}
            <div>
              <label className={`block text-purple-dark mb-1 ${isRTL ? 'text-right' : 'text-left'}`} htmlFor="companyName">
                {t('fields.organization.label')}
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder={t('fields.organization.placeholder')}
                className={`w-full text-sm py-3 px-4 border border-gray-300 rounded-md outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            
            {/* Message */}
            <div>
              <label className={`block text-purple-dark mb-1 ${isRTL ? 'text-right' : 'text-left'}`} htmlFor="message">
                {t('fields.message.label')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('fields.message.placeholder')}
                className={`w-full text-sm py-3 px-4 border border-gray-300 rounded-md outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                rows={3}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            
            {/* Submit Button */}
            <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} mt-6`}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-auto px-6 py-3 bg-pumpkin text-white font-bold rounded-lg hover:bg-orange-600 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? t('submit.sending') : t('submit.button')}
              </button>
            </div>
          </form>
        )}
        
        <SheetClose className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none`}>
          <X className="h-5 w-5" />
          <span className="sr-only">{t('close')}</span>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default ContactModal;
