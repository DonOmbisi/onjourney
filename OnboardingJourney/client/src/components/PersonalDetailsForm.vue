<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Personal Details</h2>
    <p class="text-gray-600 mb-6">Tell us a bit about yourself to personalize your experience.</p>
    
    <form @submit.prevent="validateAndProceed">
      <div class="space-y-6">
        <!-- Personal details grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- Name -->
          <div class="col-span-2 sm:col-span-1">
            <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              v-model="onboardingStore.formData.personalDetails.name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              :class="{'border-red-500': onboardingStore.errors.personalDetails?.name}"
              placeholder="John Doe"
            >
            <p 
              v-if="onboardingStore.errors.personalDetails?.name" 
              class="mt-1 text-sm text-red-600">
              {{ onboardingStore.errors.personalDetails.name }}
            </p>
          </div>
          
          <!-- Email -->
          <div class="col-span-2 sm:col-span-1">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              v-model="onboardingStore.formData.personalDetails.email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              :class="{'border-red-500': onboardingStore.errors.personalDetails?.email}"
              placeholder="john@example.com"
            >
            <p 
              v-if="onboardingStore.errors.personalDetails?.email" 
              class="mt-1 text-sm text-red-600">
              {{ onboardingStore.errors.personalDetails.email }}
            </p>
          </div>
          
          <!-- Phone -->
          <div class="col-span-2 sm:col-span-1">
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phone"
              v-model="onboardingStore.formData.personalDetails.phone"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              :class="{'border-red-500': onboardingStore.errors.personalDetails?.phone}"
              placeholder="+1 (555) 123-4567"
            >
            <p 
              v-if="onboardingStore.errors.personalDetails?.phone" 
              class="mt-1 text-sm text-red-600">
              {{ onboardingStore.errors.personalDetails.phone }}
            </p>
          </div>
          
          <!-- Profile Image -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
            <div class="mt-1 flex items-center space-x-4">
              <div class="flex-shrink-0 h-20 w-20 rounded-full overflow-hidden bg-gray-100 border border-gray-300">
                <div v-if="!onboardingStore.formData.personalDetails.profileImagePreview" class="h-full w-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <img 
                  v-if="onboardingStore.formData.personalDetails.profileImagePreview" 
                  :src="onboardingStore.formData.personalDetails.profileImagePreview" 
                  alt="Profile preview" 
                  class="h-full w-full object-cover"
                >
              </div>
              <div class="flex-1">
                <label class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                  </svg>
                  Upload Image
                  <input 
                    type="file"
                    @change="handleProfileImageUpload" 
                    accept="image/jpeg,image/png"
                    class="sr-only"
                  >
                </label>
                <p class="mt-1 text-xs text-gray-500">JPG or PNG, max 2MB</p>
                <p 
                  v-if="onboardingStore.errors.personalDetails?.profileImage" 
                  class="mt-1 text-sm text-red-600">
                  {{ onboardingStore.errors.personalDetails.profileImage }}
                </p>
                <p 
                  v-if="onboardingStore.uploadErrorMessage" 
                  class="mt-1 text-sm text-red-600">
                  {{ onboardingStore.uploadErrorMessage }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Navigation buttons -->
        <div class="flex justify-end">
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
  name: 'PersonalDetailsForm',
  setup() {
    const onboardingStore = useOnboardingStore();
    
    const handleProfileImageUpload = (event: Event) => {
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
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        onboardingStore.uploadErrorMessage = 'File size exceeds 2MB limit';
        return;
      }
      
      onboardingStore.uploadErrorMessage = '';
      onboardingStore.formData.personalDetails.profileImage = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        onboardingStore.formData.personalDetails.profileImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    };
    
    const validateAndProceed = () => {
      onboardingStore.validateStep1();
    };
    
    return {
      onboardingStore,
      handleProfileImageUpload,
      validateAndProceed
    };
  }
});
</script>
