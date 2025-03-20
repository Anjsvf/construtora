import { apiRequest } from './services/api';

// Function to check if backend is running
export async function checkBackendStatus(): Promise<boolean> {
  try {
    await apiRequest('/health');
    console.log('Backend connection successful');
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
}

// Function to test authentication
export async function testAuthentication(email: string, password: string): Promise<boolean> {
  try {
    await apiRequest('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    console.log('Authentication successful');
    return true;
  } catch (error) {
    console.error('Authentication failed:', error);
    return false;
  }
} 