<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div class="flex items-center">
          <div class="text-primary-600 font-semibold text-xl">SaaSPlatform</div>
        </div>
        <div>
          <button 
            v-if="onboardingStore.hasStoredData" 
            @click="onboardingStore.resetOnboarding" 
            class="text-sm text-gray-600 hover:text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset progress
          </button>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-grow py-8">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <StepIndicator :current-step="onboardingStore.currentStep" />

        <!-- Form steps container -->
        <div class="bg-white shadow rounded-lg overflow-hidden mt-8 relative">
          <!-- Loading overlay -->
          <div 
            v-if="onboardingStore.isLoading" 
            class="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-10">
            <div class="text-center">
              <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="mt-2 text-sm text-gray-700">{{ onboardingStore.loadingMessage || 'Loading...' }}</p>
            </div>
          </div>

          <!-- Step components -->
          <PersonalDetailsForm v-if="onboardingStore.currentStep === 1" />
          <BusinessDetailsForm v-if="onboardingStore.currentStep === 2" />
          <VerificationForm v-if="onboardingStore.currentStep === 3" />
          <CompletionScreen v-if="onboardingStore.currentStep === 4" />
        </div>
      </div>
    </main>
    
    <footer class="bg-white border-t border-gray-200 py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-sm text-gray-500 text-center">© {{ new Date().getFullYear() }} SaaSPlatform. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StepIndicator from './StepIndicator.vue';
import PersonalDetailsForm from './PersonalDetailsForm.vue';
import BusinessDetailsForm from './BusinessDetailsForm.vue';
import VerificationForm from './VerificationForm.vue';
import CompletionScreen from './CompletionScreen.vue';
import { useOnboardingStore } from '../stores/onboarding';

export default defineComponent({
  name: 'OnboardingFlow',
  components: {
    StepIndicator,
    PersonalDetailsForm,
    BusinessDetailsForm,
    VerificationForm,
    CompletionScreen
  },
  setup() {
    const onboardingStore = useOnboardingStore();
    
    // Check for stored data and load industry options when component mounts
    onboardingStore.checkForStoredData();
    onboardingStore.fetchIndustryOptions();
    
    return {
      onboardingStore
    };
  }
});
</script>
