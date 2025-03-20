import { checkBackendStatus, testAuthentication } from '../setupTests';

/**
 * Utility script to test backend connection and authentication
 * Run this script to check if your frontend can connect to the backend API
 */
async function testAPIConnection() {
  console.log('Testing API connection...');
  
  // Check backend status
  const isBackendRunning = await checkBackendStatus();
  
  if (!isBackendRunning) {
    console.error('Backend is not running. Please start the backend server.');
    return;
  }
  
  // Test authentication with admin credentials
  console.log('Testing authentication with admin credentials...');
  const isAuthSuccessful = await testAuthentication('admin@example.com', 'password123');
  
  if (isAuthSuccessful) {
    console.log('API connection and authentication test PASSED.');
    console.log('Your frontend is correctly configured to communicate with the backend.');
  } else {
    console.log('Authentication test FAILED.');
    console.log('Please check your credentials or backend authentication service.');
  }
}

// Execute the test if this file is run directly
if (typeof window !== 'undefined' && window.location.pathname.includes('test-connection')) {
  testAPIConnection();
}

export default testAPIConnection; 