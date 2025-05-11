import React, { useState, useEffect } from 'react';
import StepIndicator from './StepIndicator';
import PersonalDetailsForm from './PersonalDetailsForm';
import BusinessDetailsForm from './BusinessDetailsForm';
import VerificationForm from './VerificationForm';
import CompletionScreen from './CompletionScreen';
import { Industry, FormData } from '../types';
import { fetchIndustryOptions } from '../services/api';

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [industryOptions, setIndustryOptions] = useState<Industry[]>([]);
  const [hasStoredData, setHasStoredData] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<FormData>({
    personalDetails: {
      name: '',
      email: '',
      phone: '',
      profileImage: null,
      profileImagePreview: null
    },
    businessDetails: {
      businessName: '',
      businessLogo: null,
      businessLogoPreview: null,
      industry: '',
      companySize: '',
      businessDocument: null
    }
  });
  
  const [errors, setErrors] = useState({
    personalDetails: {},
    businessDetails: {}
  });
  
  // Check for stored data in localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('onboardingFormData');
    if (storedData) {
      setHasStoredData(true);
      
      // Restore the data if it exists
      const parsedData = JSON.parse(storedData);
      
      // Restore text-based data
      if (parsedData.personalDetails) {
        setFormData(prevFormData => ({
          ...prevFormData,
          personalDetails: {
            ...prevFormData.personalDetails,
            name: parsedData.personalDetails.name || '',
            email: parsedData.personalDetails.email || '',
            phone: parsedData.personalDetails.phone || '',
          }
        }));
      }
      
      if (parsedData.businessDetails) {
        setFormData(prevFormData => ({
          ...prevFormData,
          businessDetails: {
            ...prevFormData.businessDetails,
            businessName: parsedData.businessDetails.businessName || '',
            industry: parsedData.businessDetails.industry || '',
            companySize: parsedData.businessDetails.companySize || '',
          }
        }));
      }
    }
  }, []);
  
  // Fetch industry options when component mounts
  useEffect(() => {
    let attemptCount = 0;
    const maxAttempts = 3;
    
    const getIndustryOptions = async () => {
      try {
        attemptCount++;
        setIsLoading(true);
        setLoadingMessage('Loading industries...');
        
        const industries = await fetchIndustryOptions();
        setIndustryOptions(industries);
      } catch (error) {
        console.error('Failed to fetch industry options:', error);
        // Retry fetching with limit
        if (attemptCount < maxAttempts) {
          setTimeout(() => getIndustryOptions(), 1500);
        } else {
          // After max attempts, set basic industry options
          setIndustryOptions([
            { value: 'tech', label: 'Software & Technology' },
            { value: 'finance', label: 'Finance & Banking' },
            { value: 'other', label: 'Other' }
          ]);
        }
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    };
    
    getIndustryOptions();
  }, []);
  
  // Save to localStorage
  const saveToLocalStorage = () => {
    const dataToStore = {
      personalDetails: {
        name: formData.personalDetails.name,
        email: formData.personalDetails.email,
        phone: formData.personalDetails.phone,
        // Store file references but not the actual files
        profileImageName: formData.personalDetails.profileImage?.name
      },
      businessDetails: {
        businessName: formData.businessDetails.businessName,
        businessLogoName: formData.businessDetails.businessLogo?.name,
        industry: formData.businessDetails.industry,
        companySize: formData.businessDetails.companySize,
        businessDocumentName: formData.businessDetails.businessDocument?.name
      }
    };
    
    localStorage.setItem('onboardingFormData', JSON.stringify(dataToStore));
    setHasStoredData(true);
  };
  
  // Reset onboarding data
  const resetOnboarding = () => {
    localStorage.removeItem('onboardingFormData');
    setHasStoredData(false);
    setFormData({
      personalDetails: {
        name: '',
        email: '',
        phone: '',
        profileImage: null,
        profileImagePreview: null
      },
      businessDetails: {
        businessName: '',
        businessLogo: null,
        businessLogoPreview: null,
        industry: '',
        companySize: '',
        businessDocument: null
      }
    });
    setCurrentStep(1);
    setErrors({
      personalDetails: {},
      businessDetails: {}
    });
  };
  
  // Update form data from child components
  const updateFormData = (newData: Partial<FormData>) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      ...newData
    }));
    saveToLocalStorage();
  };
  
  // Move to next step
  const nextStep = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };
  
  // Move to previous step
  const previousStep = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };
  
  // Update errors
  const updateErrors = (newErrors: any) => {
    setErrors(newErrors);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-primary font-semibold text-xl">SaaSPlatform</div>
          </div>
          <div>
            {hasStoredData && (
              <button 
                onClick={resetOnboarding}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset progress
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <StepIndicator currentStep={currentStep} />

          {/* Form steps container */}
          <div className="bg-white shadow rounded-lg overflow-hidden mt-8 relative">
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

            {/* Step components */}
            {currentStep === 1 && (
              <PersonalDetailsForm 
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                updateErrors={updateErrors}
                nextStep={nextStep}
              />
            )}
            {currentStep === 2 && (
              <BusinessDetailsForm 
                formData={formData}
                errors={errors}
                industryOptions={industryOptions}
                updateFormData={updateFormData}
                updateErrors={updateErrors}
                nextStep={nextStep}
                previousStep={previousStep}
              />
            )}
            {currentStep === 3 && (
              <VerificationForm 
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                nextStep={nextStep}
                previousStep={previousStep}
                industryOptions={industryOptions}
              />
            )}
            {currentStep === 4 && (
              <CompletionScreen />
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">© {new Date().getFullYear()} SaaSPlatform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingFlow;