import React, { useState, useRef } from 'react';
import { FormData, Industry } from '../types';
import { sendVerificationEmail, verifyCode, submitOnboardingData } from '../services/api';

interface VerificationFormProps {
  formData: FormData;
  errors: any;
  industryOptions: Industry[];
  updateFormData: (newData: Partial<FormData>) => void;
  nextStep: () => void;
  previousStep: () => void;
}

type VerificationState = 'initial' | 'codeSent' | 'verified';

const VerificationForm: React.FC<VerificationFormProps> = ({
  formData,
  errors,
  industryOptions,
  updateFormData,
  nextStep,
  previousStep
}) => {
  const [verificationState, setVerificationState] = useState<VerificationState>('initial');
  const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', '']);
  const [verificationError, setVerificationError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const handleSendVerificationCode = async () => {
    setIsLoading(true);
    setLoadingMessage('Sending verification code...');
    
    try {
      await sendVerificationEmail(formData.personalDetails.email);
      setVerificationState('codeSent');
      setVerificationCode(['', '', '', '', '', '']);
      setVerificationError('');
    } catch (error) {
      console.error('Failed to send verification code:', error);
      setVerificationError('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  const handleVerifyCode = async () => {
    // Validate that all code inputs are filled
    if (verificationCode.some(digit => !digit)) {
      setVerificationError('Please enter the complete verification code');
      return;
    }
    
    const code = verificationCode.join('');
    setIsLoading(true);
    setLoadingMessage('Verifying code...');
    
    try {
      const isValid = await verifyCode(formData.personalDetails.email, code);
      
      if (isValid) {
        setVerificationState('verified');
        setVerificationError('');
      } else {
        setVerificationError('Invalid verification code');
      }
    } catch (error) {
      console.error('Failed to verify code:', error);
      setVerificationError('Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  const handleSubmitForm = async () => {
    setIsLoading(true);
    setLoadingMessage('Submitting your information...');
    
    try {
      await submitOnboardingData(formData);
      nextStep(); // Move to completion screen
    } catch (error) {
      console.error('Failed to submit form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  const handleVerificationInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Allow only digits
    if (!/^\d*$/.test(value)) {
      return;
    }
    
    // Update the code array
    const newCode = [...verificationCode];
    newCode[index] = value.slice(0, 1); // Only take one character
    setVerificationCode(newCode);
    
    // Move to next input if this one is filled
    if (value && index < 5 && codeInputRefs.current[index + 1]) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleVerificationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // If backspace is pressed on an empty input, focus the previous input
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };
  
  const getIndustryLabel = (value: string): string => {
    const industry = industryOptions.find(option => option.value === value);
    return industry ? industry.label : value;
  };
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification & Summary</h2>
      <p className="text-gray-600 mb-6">Verify your email and review your information before submission.</p>
      
      {/* Initial verification state */}
      {verificationState === 'initial' && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  We need to verify your email before proceeding. Click the button below to send a verification code.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSendVerificationCode}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Send Verification Code
            </button>
          </div>
        </div>
      )}
      
      {/* Code sent state */}
      {verificationState === 'codeSent' && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-blue-700">
                  We've sent a verification code to <span className="font-medium">{formData.personalDetails.email}</span>. Please check your inbox and enter the code below.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
            <div className="flex space-x-2 justify-center max-w-sm mx-auto">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={verificationCode[i]}
                  onChange={(e) => handleVerificationInput(e, i)}
                  onKeyDown={(e) => handleVerificationKeyDown(e, i)}
                  ref={(el) => codeInputRefs.current[i] = el}
                  className={`verification-input w-12 h-12 text-center border ${verificationError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none text-lg`}
                />
              ))}
            </div>
            <p className="text-center mt-2 text-sm text-gray-500">
              Didn't receive a code? 
              <button 
                type="button" 
                onClick={handleSendVerificationCode}
                className="text-primary hover:text-primary/80 font-medium ml-1"
              >
                Resend
              </button>
            </p>
            {verificationError && (
              <p className="mt-2 text-sm text-red-600 text-center">
                {verificationError}
              </p>
            )}
          </div>
          
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Verify Code
            </button>
          </div>
        </div>
      )}
      
      {/* Verified state with summary */}
      {verificationState === 'verified' && (
        <div className="space-y-6">
          {/* Success message */}
          <div className="bg-green-50 p-4 rounded-md mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Email verification successful! Please review your information below.
                </p>
              </div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-gray-50 rounded-lg overflow-hidden shadow divide-y divide-gray-200">
            {/* Personal details section */}
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.personalDetails.name}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.personalDetails.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.personalDetails.phone}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Profile Image</dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    {formData.personalDetails.profileImagePreview && (
                      <img 
                        src={formData.personalDetails.profileImagePreview} 
                        alt="Profile" 
                        className="h-10 w-10 rounded-full object-cover mr-2"
                      />
                    )}
                    {formData.personalDetails.profileImage && (
                      <span>{formData.personalDetails.profileImage.name}</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
            
            {/* Business details section */}
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.businessDetails.businessName}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Business Logo</dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    {formData.businessDetails.businessLogoPreview && (
                      <img 
                        src={formData.businessDetails.businessLogoPreview} 
                        alt="Business logo" 
                        className="h-10 w-10 object-cover mr-2"
                      />
                    )}
                    {formData.businessDetails.businessLogo && (
                      <span>{formData.businessDetails.businessLogo.name}</span>
                    )}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Industry</dt>
                  <dd className="mt-1 text-sm text-gray-900">{getIndustryLabel(formData.businessDetails.industry)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Company Size</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.businessDetails.companySize}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Business Document</dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    {formData.businessDetails.businessDocument && (
                      <span>{formData.businessDetails.businessDocument.name}</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={previousStep}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmitForm}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Complete Setup
            </button>
          </div>
        </div>
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-10">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-sm text-gray-700">{loadingMessage || 'Loading...'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationForm;