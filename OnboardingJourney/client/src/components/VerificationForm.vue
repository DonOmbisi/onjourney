<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Verification & Summary</h2>
    <p class="text-gray-600 mb-6">Verify your email and review your information before submission.</p>
    
    <!-- Initial verification state -->
    <div v-if="onboardingStore.verificationState === 'initial'" class="space-y-6">
      <div class="bg-blue-50 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3 flex-1 md:flex md:justify-between">
            <p class="text-sm text-blue-700">
              We need to verify your email before proceeding. Click the button below to send a verification code.
            </p>
          </div>
        </div>
      </div>
      
      <div class="flex justify-center">
        <button
          type="button"
          @click="onboardingStore.sendVerificationCode"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Send Verification Code
        </button>
      </div>
    </div>
    
    <!-- Code sent state -->
    <div v-if="onboardingStore.verificationState === 'codeSent'" class="space-y-6">
      <div class="bg-blue-50 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm text-blue-700">
              We've sent a verification code to <span class="font-medium">{{ onboardingStore.formData.personalDetails.email }}</span>. Please check your inbox and enter the code below.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <label for="verification-code" class="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
        <div class="flex space-x-2 justify-center max-w-sm mx-auto">
          <input
            v-for="(_, i) in 6"
            :key="i"
            type="text"
            maxlength="1"
            v-model="onboardingStore.verificationCode[i]"
            @input="handleVerificationInput($event, i)"
            @keydown.backspace="handleVerificationBackspace($event, i)"
            class="verification-input w-12 h-12 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none text-lg"
            :class="{'border-red-500': onboardingStore.verificationError}"
          >
        </div>
        <p class="text-center mt-2 text-sm text-gray-500">
          Didn't receive a code? 
          <button 
            type="button" 
            @click="onboardingStore.sendVerificationCode"
            class="text-primary-600 hover:text-primary-800 font-medium">
            Resend
          </button>
        </p>
        <p 
          v-if="onboardingStore.verificationError" 
          class="mt-2 text-sm text-red-600 text-center">
          {{ onboardingStore.verificationError }}
        </p>
      </div>
      
      <div class="flex justify-center mt-4">
        <button
          type="button"
          @click="onboardingStore.verifyCode"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Verify Code
        </button>
      </div>
    </div>
    
    <!-- Verified state with summary -->
    <div v-if="onboardingStore.verificationState === 'verified'" class="space-y-6">
      <!-- Success message -->
      <div class="bg-green-50 p-4 rounded-md mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">
              Email verification successful! Please review your information below.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Summary -->
      <div class="bg-gray-50 rounded-lg overflow-hidden shadow divide-y divide-gray-200">
        <!-- Personal details section -->
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium text-gray-900">Personal Information</h3>
        </div>
        <div class="px-4 py-5 sm:p-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Full Name</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ onboardingStore.formData.personalDetails.name }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ onboardingStore.formData.personalDetails.email }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Phone Number</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ onboardingStore.formData.personalDetails.phone }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Profile Image</dt>
              <dd class="mt-1 text-sm text-gray-900 flex items-center">
                <img 
                  v-if="onboardingStore.formData.personalDetails.profileImagePreview" 
                  :src="onboardingStore.formData.personalDetails.profileImagePreview" 
                  alt="Profile image" 
                  class="h-10 w-10 rounded-full object-cover mr-2"
                />
                <span v-if="onboardingStore.formData.personalDetails.profileImage">{{ onboardingStore.formData.personalDetails.profileImage.name }}</span>
              </dd>
            </div>
          </dl>
        </div>
        
        <!-- Business details section -->
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium text-gray-900">Business Information</h3>
        </div>
        <div class="px-4 py-5 sm:p-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Business Name</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ onboardingStore.formData.businessDetails.businessName }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Business Logo</dt>
              <dd class="mt-1 text-sm text-gray-900 flex items-center">
                <img 
                  v-if="onboardingStore.formData.businessDetails.businessLogoPreview" 
                  :src="onboardingStore.formData.businessDetails.businessLogoPreview" 
                  alt="Business logo" 
                  class="h-10 w-10 object-cover mr-2"
                />
                <span v-if="onboardingStore.formData.businessDetails.businessLogo">{{ onboardingStore.formData.businessDetails.businessLogo.name }}</span>
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Industry</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ onboardingStore.getIndustryLabel(onboardingStore.formData.businessDetails.industry) }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Company Size</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ onboardingStore.formData.businessDetails.companySize }}</dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">Business Document</dt>
              <dd class="mt-1 text-sm text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span v-if="onboardingStore.formData.businessDetails.businessDocument">{{ onboardingStore.formData.businessDetails.businessDocument.name }}</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      <!-- Submit button -->
      <div class="flex justify-between mt-6">
        <button
          type="button"
          @click="onboardingStore.previousStep"
          class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Back
        </button>
        <button
          type="button"
          @click="onboardingStore.submitForm"
          class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Complete Setup
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useOnboardingStore } from '../stores/onboarding';

export default defineComponent({
  name: 'VerificationForm',
  setup() {
    const onboardingStore = useOnboardingStore();
    
    const handleVerificationInput = (event: Event, index: number) => {
      const input = event.target as HTMLInputElement;
      const value = input.value;
      
      // Allow only digits
      if (!/^\d*$/.test(value)) {
        onboardingStore.verificationCode[index] = '';
        return;
      }
      
      // Move to next input if this one is filled
      if (value && index < 5) {
        // Find all verification inputs
        const inputs = document.querySelectorAll('.verification-input');
        if (inputs[index + 1]) {
          (inputs[index + 1] as HTMLInputElement).focus();
        }
      }
    };
    
    const handleVerificationBackspace = (event: KeyboardEvent, index: number) => {
      // If backspace is pressed on an empty input, focus the previous input
      if (event.key === 'Backspace' && !onboardingStore.verificationCode[index] && index > 0) {
        const inputs = document.querySelectorAll('.verification-input');
        if (inputs[index - 1]) {
          (inputs[index - 1] as HTMLInputElement).focus();
        }
      }
    };
    
    return {
      onboardingStore,
      handleVerificationInput,
      handleVerificationBackspace
    };
  }
});
</script>
