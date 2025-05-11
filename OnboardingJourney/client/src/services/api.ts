import { Industry } from '../types';
import { FormData } from '../types';

/**
 * Simulates API delay with optional failure rate
 */
function mockDelay(ms: number = 1000, failureRate: number = 0.1): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failureRate) {
        reject(new Error('API request failed'));
      } else {
        resolve();
      }
    }, ms);
  });
}

/**
 * Mock API to fetch industry options
 */
export async function fetchIndustryOptions(): Promise<Industry[]> {
  await mockDelay(1500, 0.1);
  
  return [
    { value: 'tech', label: 'Software & Technology' },
    { value: 'finance', label: 'Finance & Banking' },
    { value: 'healthcare', label: 'Healthcare & Medical' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'hospitality', label: 'Hospitality & Tourism' },
    { value: 'entertainment', label: 'Entertainment & Media' },
    { value: 'nonprofit', label: 'Nonprofit & NGO' },
    { value: 'other', label: 'Other' }
  ];
}

/**
 * Mock API to send verification email with code
 */
export async function sendVerificationEmail(email: string): Promise<void> {
  await mockDelay(2000, 0.1);
  console.log(`Verification code sent to ${email}`);
  
  // Store verification code in session storage for demo purposes
  // In a real app, this would be handled on the server
  sessionStorage.setItem('verificationCode', '123456');
}

/**
 * Mock API to verify the code
 */
export async function verifyCode(email: string, code: string): Promise<boolean> {
  await mockDelay(1500, 0.1);
  
  // In a real app, this verification would happen on the server
  const storedCode = sessionStorage.getItem('verificationCode') || '123456';
  return code === storedCode;
}

/**
 * Mock API to submit all onboarding data
 */
export async function submitOnboardingData(formData: FormData): Promise<void> {
  await mockDelay(2500, 0.1);
  
  console.log('Form data submitted successfully:', formData);
}
