<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Business Details</h2>
    <p class="text-gray-600 mb-6">Tell us about your business to help us customize your dashboard.</p>
    
    <form @submit.prevent="validateAndProceed">
      <div class="space-y-6">
        <!-- Business details grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- Business Name -->
          <div class="col-span-2">
            <label for="businessName" class="block text-sm font-medium text-gray-700">Business Name</label>
            <input
              type="text"
              id="businessName"
              v-model="onboardingStore.formData.businessDetails.businessName"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              :class="{'border-red-500': onboardingStore.errors.businessDetails?.businessName}"
              placeholder="Acme Inc."
            >
            <p 
              v-if="onboardingStore.errors.businessDetails?.businessName" 
              class="mt-1 text-sm text-red-600">
              {{ onboardingStore.errors.businessDetails.businessName }}
            </p>
          </div>
          
          <!-- Business Logo -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Business Logo</label>
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0 h-16 w-16 rounded overflow-hidden bg-gray-100 border border-gray-300">
                <div v-if="!onboardingStore.formData.businessDetails.businessLogoPreview" class="h-full w-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <img 
                  v-if="onboardingStore.formData.businessDetails.businessLogoPreview" 
                  :src="onboardingStore.formData.businessDetails.businessLogoPreview" 
                  alt="Business logo preview" 
                  class="h-full w-full object-cover"
                >
              </div>
              <div class="flex-1">
                <label class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                  </svg>
                  Upload Logo
                  <input 
                    type="file"
                    @change="handleBusinessLogoUpload" 
                    accept="image/jpeg,image/png"
                    class="sr-only"
                  >
                </label>
                <p class="mt-1 text-xs text-gray-500">JPG or PNG recommended</p>
                <p 
                  v-if="onboardingStore.errors.businessDetails?.businessLogo" 
                  class="mt-1 text-sm text-red-600">
                  {{ onboardingStore.errors.businessDetails.businessLogo }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Industry Selection -->
          <div class="col-span-2 sm:col-span-1">
            <label for="industry" class="block text-sm font-medium text-gray-700">Industry</label>
            <div class="relative">
              <select
                id="industry"
                v-model="onboardingStore.formData.businessDetails.industry"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                :class="{'border-red-500': onboardingStore.errors.businessDetails?.industry}"
              >
                <option value="" disabled selected>Select an industry</option>
                <option v-for="option in onboardingStore.industryOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <p 
              v-if="onboardingStore.errors.businessDetails?.industry" 
              class="mt-1 text-sm text-red-600">
              {{ onboardingStore.errors.businessDetails.industry }}
            </p>
          </div>
          
          <!-- Company Size -->
          <div class="col-span-2 sm:col-span-1">
            <label for="companySize" class="block text-sm font-medium text-gray-700">Company Size</label>
            <div class="relative">
              <select
                id="companySize"
                v-model="onboardingStore.formData.businessDetails.companySize"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                :class="{'border-red-500': onboardingStore.errors.businessDetails?.companySize}"
              >
                <option value="" disabled selected>Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <p 
              v-if="onboardingStore.errors.businessDetails?.companySize" 
              class="mt-1 text-sm text-red-600">
              {{ onboardingStore.errors.businessDetails.companySize }}
            </p>
          </div>
          
          <!-- Business Document -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Business Document</label>
            <div class="mt-1 flex items-start space-x-4">
              <div class="flex-1">
                <div class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div class="space-y-1 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm text-gray-600 justify-center">
                      <label for="document-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                        <span>Upload a document</span>
                        <input 
                          id="document-upload" 
                          type="file" 
                          @change="handleBusinessDocumentUpload"
                          accept="application/pdf"
                          class="sr-only"
                        >
                      </label>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs text-gray-500">
                      PDF only, max 5MB
                    </p>
                    <p 
                      v-if="onboardingStore.errors.businessDetails?.businessDocument" 
                      class="mt-1 text-sm text-red-600">
                      {{ onboardingStore.errors.businessDetails.businessDocument }}
                    </p>
                  </div>
                </div>
                
                <!-- Document preview -->
                <div 
                  v-if="onboardingStore.formData.businessDetails.businessDocument"
                  class="mt-3 flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span class="text-gray-600">{{ onboardingStore.formData.businessDetails.businessDocument.name || 'business-document.pdf' }}</span>
                  <button 
                    type="button" 
                    @click="onboardingStore.removeBusinessDocument"
                    class="ml-2 text-primary-600 hover:text-primary-700 text-sm">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Navigation buttons -->
        <div class="flex justify-between">
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
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useOnboardingStore } from '../stores/onboarding';

export default defineComponent({
  name: 'BusinessDetailsForm',
  setup() {
    const onboardingStore = useOnboardingStore();
    
    const handleBusinessLogoUpload = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (!input.files || input.files.length === 0) {
        return;
      }
      
      const file = input.files[0];
      
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        onboardingStore.uploadErrorMessage = 'Please upload a JPG or PNG file';
        return;
      }
      
      onboardingStore.uploadErrorMessage = '';
      onboardingStore.formData.businessDetails.businessLogo = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        onboardingStore.formData.businessDetails.businessLogoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    };
    
    const handleBusinessDocumentUpload = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (!input.files || input.files.length === 0) {
        return;
      }
      
      const file = input.files[0];
      
      // Validate file type
      if (file.type !== 'application/pdf') {
        onboardingStore.uploadErrorMessage = 'Please upload a PDF file';
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        onboardingStore.uploadErrorMessage = 'File size exceeds 5MB limit';
        return;
      }
      
      onboardingStore.uploadErrorMessage = '';
      onboardingStore.formData.businessDetails.businessDocument = file;
    };
    
    const validateAndProceed = () => {
      onboardingStore.validateStep2();
    };
    
    return {
      onboardingStore,
      handleBusinessLogoUpload,
      handleBusinessDocumentUpload,
      validateAndProceed
    };
  }
});
</script>
