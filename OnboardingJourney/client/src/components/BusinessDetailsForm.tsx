import React, { useState } from 'react';
import { FormData, Industry } from '../types';

interface BusinessDetailsFormProps {
  formData: FormData;
  errors: any;
  industryOptions: Industry[];
  updateFormData: (newData: Partial<FormData>) => void;
  updateErrors: (newErrors: any) => void;
  nextStep: () => void;
  previousStep: () => void;
}

const BusinessDetailsForm: React.FC<BusinessDetailsFormProps> = ({
  formData,
  errors,
  industryOptions,
  updateFormData,
  updateErrors,
  nextStep,
  previousStep
}) => {
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string>('');

  const handleBusinessLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    
    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setUploadErrorMessage('Please upload a JPG or PNG file');
      return;
    }
    
    setUploadErrorMessage('');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      updateFormData({
        businessDetails: {
          ...formData.businessDetails,
          businessLogo: file,
          businessLogoPreview: e.target?.result as string
        }
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleBusinessDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadErrorMessage('Please upload a PDF file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadErrorMessage('File size exceeds 5MB limit');
      return;
    }
    
    setUploadErrorMessage('');
    updateFormData({
      businessDetails: {
        ...formData.businessDetails,
        businessDocument: file
      }
    });
  };
  
  const removeBusinessDocument = () => {
    updateFormData({
      businessDetails: {
        ...formData.businessDetails,
        businessDocument: null
      }
    });
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    updateFormData({
      businessDetails: {
        ...formData.businessDetails,
        [id]: value
      }
    });
  };
  
  const validateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    const newErrors = { ...errors, businessDetails: {} };
    
    // Validate form data
    let isValid = true;
    
    if (!formData.businessDetails.businessName) {
      newErrors.businessDetails.businessName = 'Business name is required';
      isValid = false;
    }
    
    if (!formData.businessDetails.businessLogo) {
      newErrors.businessDetails.businessLogo = 'Business logo is required';
      isValid = false;
    }
    
    if (!formData.businessDetails.industry) {
      newErrors.businessDetails.industry = 'Please select an industry';
      isValid = false;
    }
    
    if (!formData.businessDetails.companySize) {
      newErrors.businessDetails.companySize = 'Please select company size';
      isValid = false;
    }
    
    if (!formData.businessDetails.businessDocument) {
      newErrors.businessDetails.businessDocument = 'Business document is required';
      isValid = false;
    }
    
    updateErrors(newErrors);
    
    if (isValid) {
      nextStep();
    }
  };
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Details</h2>
      <p className="text-gray-600 mb-6">Tell us about your business to help us customize your dashboard.</p>
      
      <form onSubmit={validateAndProceed}>
        <div className="space-y-6">
          {/* Business details grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Business Name */}
            <div className="col-span-2">
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</label>
              <input
                type="text"
                id="businessName"
                value={formData.businessDetails.businessName}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.businessDetails?.businessName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                placeholder="Acme Inc."
              />
              {errors.businessDetails?.businessName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.businessDetails.businessName}
                </p>
              )}
            </div>
            
            {/* Business Logo */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Logo</label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-16 w-16 rounded overflow-hidden bg-gray-100 border border-gray-300">
                  {!formData.businessDetails.businessLogoPreview ? (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  ) : (
                    <img 
                      src={formData.businessDetails.businessLogoPreview} 
                      alt="Business logo preview" 
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Upload Logo
                    <input 
                      type="file"
                      onChange={handleBusinessLogoUpload} 
                      accept="image/jpeg,image/png"
                      className="sr-only"
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">JPG or PNG recommended</p>
                  {errors.businessDetails?.businessLogo && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.businessDetails.businessLogo}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Industry Selection */}
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
              <div className="relative">
                <select
                  id="industry"
                  value={formData.businessDetails.industry}
                  onChange={handleChange}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.businessDetails?.industry ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md`}
                >
                  <option value="" disabled>Select an industry</option>
                  {industryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {errors.businessDetails?.industry && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.businessDetails.industry}
                </p>
              )}
            </div>
            
            {/* Company Size */}
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">Company Size</label>
              <div className="relative">
                <select
                  id="companySize"
                  value={formData.businessDetails.companySize}
                  onChange={handleChange}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.businessDetails?.companySize ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md`}
                >
                  <option value="" disabled>Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {errors.businessDetails?.companySize && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.businessDetails.companySize}
                </p>
              )}
            </div>
            
            {/* Business Document */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Document</label>
              <div className="mt-1 flex items-start space-x-4">
                <div className="flex-1">
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="document-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                          <span>Upload a document</span>
                          <input 
                            id="document-upload" 
                            type="file" 
                            onChange={handleBusinessDocumentUpload}
                            accept="application/pdf"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF only, max 5MB
                      </p>
                      {errors.businessDetails?.businessDocument && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.businessDetails.businessDocument}
                        </p>
                      )}
                      {uploadErrorMessage && (
                        <p className="mt-1 text-sm text-red-600">
                          {uploadErrorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Document preview */}
                  {formData.businessDetails.businessDocument && (
                    <div className="mt-3 flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">{formData.businessDetails.businessDocument.name || 'business-document.pdf'}</span>
                      <button 
                        type="button" 
                        onClick={removeBusinessDocument}
                        className="ml-2 text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
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

export default BusinessDetailsForm;