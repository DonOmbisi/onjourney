<template>
  <div class="mb-8">
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">Complete Your Account Setup</h1>
    
    <div class="flex items-center justify-between">
      <div class="flex items-center w-full">
        <!-- Step 1 -->
        <div class="relative flex items-center justify-center">
          <div 
            class="h-10 w-10 rounded-full border-2 flex items-center justify-center"
            :class="{ 'step-active': currentStep === 1, 'step-completed': currentStep > 1, 'step-inactive': currentStep < 1 }">
            <span v-if="currentStep > 1" class="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
            <span v-else>1</span>
          </div>
          <div class="absolute -bottom-6 w-max text-center text-xs font-medium" :class="currentStep >= 1 ? 'text-primary-600' : 'text-gray-500'">
            Personal Details
          </div>
        </div>
        
        <!-- Connector Line 1-2 -->
        <div class="flex-1 h-0.5 mx-2" :class="currentStep > 1 ? 'bg-primary-600' : 'bg-gray-300'"></div>
        
        <!-- Step 2 -->
        <div class="relative flex items-center justify-center">
          <div 
            class="h-10 w-10 rounded-full border-2 flex items-center justify-center"
            :class="{ 'step-active': currentStep === 2, 'step-completed': currentStep > 2, 'step-inactive': currentStep < 2 }">
            <span v-if="currentStep > 2" class="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
            <span v-else>2</span>
          </div>
          <div class="absolute -bottom-6 w-max text-center text-xs font-medium" :class="currentStep >= 2 ? 'text-primary-600' : 'text-gray-500'">
            Business Details
          </div>
        </div>
        
        <!-- Connector Line 2-3 -->
        <div class="flex-1 h-0.5 mx-2" :class="currentStep > 2 ? 'bg-primary-600' : 'bg-gray-300'"></div>
        
        <!-- Step 3 -->
        <div class="relative flex items-center justify-center">
          <div 
            class="h-10 w-10 rounded-full border-2 flex items-center justify-center"
            :class="{ 'step-active': currentStep === 3, 'step-completed': currentStep > 3, 'step-inactive': currentStep < 3 }">
            <span v-if="currentStep > 3" class="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
            <span v-else>3</span>
          </div>
          <div class="absolute -bottom-6 w-max text-center text-xs font-medium" :class="currentStep >= 3 ? 'text-primary-600' : 'text-gray-500'">
            Verification
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StepIndicator',
  props: {
    currentStep: {
      type: Number,
      required: true
    }
  }
});
</script>
