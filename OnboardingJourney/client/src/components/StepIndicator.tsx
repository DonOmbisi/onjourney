import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Complete Your Account Setup</h1>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center w-full">
          {/* Step 1 */}
          <div className="relative flex items-center justify-center">
            <div 
              className={`h-10 w-10 rounded-full border-2 flex items-center justify-center ${
                currentStep === 1 
                  ? 'step-active'
                  : currentStep > 1 
                    ? 'step-completed' 
                    : 'step-inactive'
              }`}
            >
              {currentStep > 1 ? (
                <span className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              ) : <span>1</span>}
            </div>
            <div className={`absolute -bottom-6 w-max text-center text-xs font-medium ${currentStep >= 1 ? 'text-primary' : 'text-gray-500'}`}>
              Personal Details
            </div>
          </div>
          
          {/* Connector Line 1-2 */}
          <div className={`flex-1 h-0.5 mx-2 ${currentStep > 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>
          
          {/* Step 2 */}
          <div className="relative flex items-center justify-center">
            <div 
              className={`h-10 w-10 rounded-full border-2 flex items-center justify-center ${
                currentStep === 2 
                  ? 'step-active'
                  : currentStep > 2 
                    ? 'step-completed' 
                    : 'step-inactive'
              }`}
            >
              {currentStep > 2 ? (
                <span className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              ) : <span>2</span>}
            </div>
            <div className={`absolute -bottom-6 w-max text-center text-xs font-medium ${currentStep >= 2 ? 'text-primary' : 'text-gray-500'}`}>
              Business Details
            </div>
          </div>
          
          {/* Connector Line 2-3 */}
          <div className={`flex-1 h-0.5 mx-2 ${currentStep > 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
          
          {/* Step 3 */}
          <div className="relative flex items-center justify-center">
            <div 
              className={`h-10 w-10 rounded-full border-2 flex items-center justify-center ${
                currentStep === 3 
                  ? 'step-active'
                  : currentStep > 3 
                    ? 'step-completed' 
                    : 'step-inactive'
              }`}
            >
              {currentStep > 3 ? (
                <span className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              ) : <span>3</span>}
            </div>
            <div className={`absolute -bottom-6 w-max text-center text-xs font-medium ${currentStep >= 3 ? 'text-primary' : 'text-gray-500'}`}>
              Verification
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;