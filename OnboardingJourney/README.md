# Multi-Step User Onboarding Flow

A modern, responsive multi-step user onboarding flow built with React, TypeScript, and Tailwind CSS. This application implements a user onboarding experience based on the Senior Frontend Technical Test requirements.

## Setup and Run Instructions

### Option 1: Using yarn directly
1. Install dependencies:
   ```
   yarn install
   ```

2. Start the development server:
   ```
   yarn run dev
   ```

### Option 2: Using the convenience script
1. Run the project with a single command:
   ```
   ./run-with-yarn.sh
   ```

3. Access the application at http://localhost:5000

## Development Process and Design Choices

### Overall Architecture
- Initially, the project requirements specified Vue 3, but due to the existing project configuration constraints, I pivoted to React with TypeScript while maintaining the required functionality.
- Used a component-based architecture to create modular, reusable form components.
- Implemented a step-based navigation system with persistent form data across steps.

### UI/UX Decisions
- Designed a clean, professional interface appropriate for a SaaS onboarding flow.
- Incorporated a progress indicator to provide users with visual feedback of their progress.
- Used consistent styling with Tailwind CSS and Shadcn UI components.
- Added responsive design considerations for all device sizes.
- Implemented smooth transitions between steps for improved user experience.

### Form Management
- Created separate form components for each step (personal details, business details, verification).
- Implemented client-side validation with appropriate error messages.
- Added support for file uploads (profile image, business logo, business documents).
- Used localStorage for form persistence between sessions.
- Implemented a summary view before final submission to allow users to review their information.

### Technical Challenges
- Handled form state management across multiple steps.
- Implemented file upload previews with base64 encoding.
- Created a custom verification code input system with keyboard navigation.
- Added responsive design for all form elements.
- Implemented API request/response simulation with timeout and error handling.

## API Mocking Implementation

The project uses a mock API implementation to simulate backend interactions:

1. **Service Layer**: All API calls are defined in `client/src/services/api.tsx` using async functions.

2. **Mock Delay Function**: Created a `mockDelay()` utility that simulates network latency and occasional failures:
   ```typescript
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
   ```

3. **Simulated Endpoints**:
   - `fetchIndustryOptions()`: Returns a list of predefined industry options.
   - `sendVerificationEmail()`: Simulates sending a verification code.
   - `verifyCode()`: Validates the user-entered verification code.
   - `submitOnboardingData()`: Handles the final form submission.

4. **Error Handling**: Implemented retry logic in the components when API requests fail.

5. **Local Session Storage**: Used for storing verification codes in the demo, simulating server-side storage:
   ```typescript
   sessionStorage.setItem('verificationCode', '123456');
   ```

## Running Unit Tests

### Option 1: Using yarn directly
To run the unit tests for the project:

```
yarn test
```

To run tests with coverage reporting:

```
yarn test:coverage
```

### Option 2: Using the convenience scripts
To run tests using the provided scripts:

```
./test.sh
```

To run tests with coverage reporting:

```
./test-coverage.sh
```

The test suite includes:

- **Component Tests**: Verifies that components render correctly and respond to user interactions.
- **Validation Tests**: Ensures form validation logic works as expected.
- **API Mock Tests**: Tests the mock API service functions.
- **Form State Tests**: Verifies the form state is correctly managed across steps.

Test coverage reports generate detailed information about code coverage across the application.

## Project Structure

```
project-root/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── services/       # API service layer
│   │   ├── stores/         # State management
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   └── index.html          # HTML template
├── server/                 # Backend server
├── shared/                 # Shared code between frontend and backend
└── tests/                  # Unit and integration tests
```