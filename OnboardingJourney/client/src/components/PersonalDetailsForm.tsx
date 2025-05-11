import React, { useState } from 'react';
import { FormData } from '../types';
import { validateEmail, validatePhone } from '../utils/validators';

interface PersonalDetailsFormProps {
  formData: FormData;
  errors: any;
  updateFormData: (newData: Partial<FormData>) => void;
  updateErrors: (newErrors: any) => void;
  nextStep: () => void;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  formData,
  errors,
  updateFormData,
  updateErrors,
  nextStep
}) => {
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string>('');

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    
    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setUploadErrorMessage('Please upload a JPG or PNG file');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadErrorMessage('File size exceeds 2MB limit');
      return;
    }
    
    setUploadErrorMessage('');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      updateFormData({
        personalDetails: {
          ...formData.personalDetails,
          profileImage: file,
          profileImagePreview: e.target?.result as string
        }
      });
    };
    reader.readAsDataURL(file);
  };
  
  const validateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    const newErrors = { ...errors, personalDetails: {} };
    
    // Validate form data
    let isValid = true;
    
    if (!formData.personalDetails.name) {
      newErrors.personalDetails.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.personalDetails.email) {
      newErrors.personalDetails.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.personalDetails.email)) {
      newErrors.personalDetails.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    if (!formData.personalDetails.phone) {
      newErrors.personalDetails.phone = 'Phone number is required';
      isValid = false;
    } else if (!validatePhone(formData.personalDetails.phone)) {
      newErrors.personalDetails.phone = 'Please enter a valid phone number';
      isValid = false;
    }
    
    if (!formData.personalDetails.profileImage) {
      newErrors.personalDetails.profileImage = 'Profile image is required';
      isValid = false;
    }
    
    updateErrors(newErrors);
    
    if (isValid) {
      nextStep();
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    updateFormData({
      personalDetails: {
        ...formData.personalDetails,
        [id]: value
      }
    });
  };
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Details</h2>
      <p className="text-gray-600 mb-6">Tell us a bit about yourself to personalize your experience.</p>
      
      <form onSubmit={validateAndProceed}>
        <div className="space-y-6">
          {/* Personal details grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Name */}
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                value={formData.personalDetails.name}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.personalDetails?.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                placeholder="John Doe"
              />
              {errors.personalDetails?.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.personalDetails.name}
                </p>
              )}
            </div>
            
            {/* Email */}
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={formData.personalDetails.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.personalDetails?.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                placeholder="john@example.com"
              />
              {errors.personalDetails?.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.personalDetails.email}
                </p>
              )}
            </div>
            
            {/* Phone */}
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={formData.personalDetails.phone}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.personalDetails?.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.personalDetails?.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.personalDetails.phone}
                </p>
              )}
            </div>
            
            {/* Profile Image */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="flex-shrink-0 h-20 w-20 rounded-full overflow-hidden bg-gray-100 border border-gray-300">
                  {!formData.personalDetails.profileImagePreview ? (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  ) : (
                    <img 
                      src={formData.personalDetails.profileImagePreview} 
                      alt="Profile preview" 
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Upload Image
                    <input 
                      type="file"
                      onChange={handleProfileImageUpload} 
                      accept="image/jpeg,image/png"
                      className="sr-only"
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">JPG or PNG, max 2MB</p>
                  {errors.personalDetails?.profileImage && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.personalDetails.profileImage}
                    </p>
                  )}
                  {uploadErrorMessage && (
                    <p className="mt-1 text-sm text-red-600">
                      {uploadErrorMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetailsForm;