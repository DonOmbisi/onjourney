import { defineStore } from 'pinia';
import { z } from 'zod';
import { validateEmail, validatePhone } from '../utils/validators';
import { fetchIndustryOptions, sendVerificationEmail, verifyCode, submitOnboardingData } from '../services/api';
import { Industry } from '../types';

// Define validation schemas using zod
const personalDetailsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required').refine(validatePhone, 'Please enter a valid phone number'),
  profileImage: z.instanceof(File, { message: 'Profile image is required' })
});

const businessDetailsSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessLogo: z.instanceof(File, { message: 'Business logo is required' }),
  industry: z.string().min(1, 'Please select an industry'),
  companySize: z.string().min(1, 'Please select company size'),
  businessDocument: z.instanceof(File, { message: 'Business document is required' })
});

interface PersonalDetails {
  name: string;
  email: string;
  phone: string;
  profileImage: File | null;
  profileImagePreview: string | null;
}

interface BusinessDetails {
  businessName: string;
  businessLogo: File | null;
  businessLogoPreview: string | null;
  industry: string;
  companySize: string;
  businessDocument: File | null;
}

interface FormData {
  personalDetails: PersonalDetails;
  businessDetails: BusinessDetails;
}

interface Errors {
  personalDetails: Record<string, string>;
  businessDetails: Record<string, string>;
}

type VerificationState = 'initial' | 'codeSent' | 'verified';

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    currentStep: 1,
    isLoading: false,
    loadingMessage: '',
    uploadErrorMessage: '',
    hasStoredData: false,
    verificationState: 'initial' as VerificationState,
    verificationCode: ['', '', '', '', '', ''],
    verificationError: '',
    industryOptions: [] as Industry[],
    formData: {
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
    } as FormData,
    errors: {
      personalDetails: {},
      businessDetails: {}
    } as Errors
  }),

  actions: {
    async fetchIndustryOptions() {
      try {
        this.isLoading = true;
        this.loadingMessage = 'Loading industries...';
        
        const industries = await fetchIndustryOptions();
        this.industryOptions = industries;
      } catch (error) {
        console.error('Failed to fetch industry options:', error);
        // Add fallback options in case the API fails
        this.industryOptions = [
          { value: 'tech', label: 'Software & Technology' },
          { value: 'finance', label: 'Finance & Banking' },
          { value: 'healthcare', label: 'Healthcare & Medical' },
          { value: 'education', label: 'Education' },
          { value: 'retail', label: 'Retail & E-commerce' },
          { value: 'other', label: 'Other' }
        ];
      } finally {
        this.isLoading = false;
        this.loadingMessage = '';
      }
    },

    checkForStoredData() {
      // Check for stored form data in localStorage
      const storedData = localStorage.getItem('onboardingFormData');
      if (storedData) {
        this.hasStoredData = true;
        
        // Restore the data if it exists
        const parsedData = JSON.parse(storedData);
        
        // Restore text-based data
        if (parsedData.personalDetails) {
          this.formData.personalDetails.name = parsedData.personalDetails.name || '';
          this.formData.personalDetails.email = parsedData.personalDetails.email || '';
          this.formData.personalDetails.phone = parsedData.personalDetails.phone || '';
        }
        
        if (parsedData.businessDetails) {
          this.formData.businessDetails.businessName = parsedData.businessDetails.businessName || '';
          this.formData.businessDetails.industry = parsedData.businessDetails.industry || '';
          this.formData.businessDetails.companySize = parsedData.businessDetails.companySize || '';
        }
      }
    },

    saveToLocalStorage() {
      // Save current form data to localStorage
      const dataToStore = {
        personalDetails: {
          name: this.formData.personalDetails.name,
          email: this.formData.personalDetails.email,
          phone: this.formData.personalDetails.phone,
          // Store file references but not the actual files
          profileImageName: this.formData.personalDetails.profileImage?.name
        },
        businessDetails: {
          businessName: this.formData.businessDetails.businessName,
          businessLogoName: this.formData.businessDetails.businessLogo?.name,
          industry: this.formData.businessDetails.industry,
          companySize: this.formData.businessDetails.companySize,
          businessDocumentName: this.formData.businessDetails.businessDocument?.name
        }
      };
      
      localStorage.setItem('onboardingFormData', JSON.stringify(dataToStore));
      this.hasStoredData = true;
    },

    resetOnboarding() {
      // Clear local storage and reset form
      localStorage.removeItem('onboardingFormData');
      this.hasStoredData = false;
      
      // Reset form data
      this.formData = {
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
      };
      
      // Reset to first step
      this.currentStep = 1;
      this.verificationState = 'initial';
      this.verificationCode = ['', '', '', '', '', ''];
      this.errors = {
        personalDetails: {},
        businessDetails: {}
      };
    },

    validateStep1() {
      // Reset errors
      this.errors.personalDetails = {};
      
      try {
        // Validate using zod
        personalDetailsSchema.parse(this.formData.personalDetails);
        
        // If validation passes, proceed to next step
        this.saveToLocalStorage();
        this.nextStep();
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Map zod errors to our errors object
          error.errors.forEach((err) => {
            const path = err.path[0] as string;
            this.errors.personalDetails[path] = err.message;
          });
        }
      }
    },

    validateStep2() {
      // Reset errors
      this.errors.businessDetails = {};
      
      try {
        // Validate using zod
        businessDetailsSchema.parse(this.formData.businessDetails);
        
        // If validation passes, proceed to next step
        this.saveToLocalStorage();
        this.nextStep();
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Map zod errors to our errors object
          error.errors.forEach((err) => {
            const path = err.path[0] as string;
            this.errors.businessDetails[path] = err.message;
          });
        }
      }
    },

    removeBusinessDocument() {
      this.formData.businessDetails.businessDocument = null;
    },

    nextStep() {
      this.currentStep++;
    },

    previousStep() {
      this.currentStep--;
    },

    async sendVerificationCode() {
      this.isLoading = true;
      this.loadingMessage = 'Sending verification code...';
      
      try {
        // Call mock API to send verification code
        await sendVerificationEmail(this.formData.personalDetails.email);
        
        this.verificationState = 'codeSent';
        this.verificationCode = ['', '', '', '', '', ''];
        this.verificationError = '';
      } catch (error) {
        console.error('Failed to send verification code:', error);
        this.verificationError = 'Failed to send verification code. Please try again.';
      } finally {
        this.isLoading = false;
        this.loadingMessage = '';
      }
    },

    async verifyCode() {
      // Validate that all code inputs are filled
      if (this.verificationCode.some(digit => !digit)) {
        this.verificationError = 'Please enter the complete verification code';
        return;
      }
      
      const code = this.verificationCode.join('');
      this.isLoading = true;
      this.loadingMessage = 'Verifying code...';
      
      try {
        // Call mock API to verify the code
        const isValid = await verifyCode(this.formData.personalDetails.email, code);
        
        if (isValid) {
          this.verificationState = 'verified';
          this.verificationError = '';
        } else {
          this.verificationError = 'Invalid verification code';
        }
      } catch (error) {
        console.error('Failed to verify code:', error);
        this.verificationError = 'Failed to verify code. Please try again.';
      } finally {
        this.isLoading = false;
        this.loadingMessage = '';
      }
    },

    async submitForm() {
      this.isLoading = true;
      this.loadingMessage = 'Submitting your information...';
      
      try {
        // Call mock API to submit all onboarding data
        await submitOnboardingData(this.formData);
        
        // Go to success screen
        this.nextStep();
      } catch (error) {
        console.error('Failed to submit form:', error);
        alert('Failed to submit form. Please try again.');
      } finally {
        this.isLoading = false;
        this.loadingMessage = '';
      }
    },

    getIndustryLabel(value: string): string {
      const industry = this.industryOptions.find(option => option.value === value);
      return industry ? industry.label : value;
    }
  }
});
