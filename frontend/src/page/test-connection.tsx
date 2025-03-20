import { useEffect, useState } from 'react';
import testAPIConnection from '../utils/testConnection';

export default function TestConnection() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Testing connection...');

  useEffect(() => {
    async function runTest() {
      try {
        await testAPIConnection();
        setStatus('success');
        setMessage('Connection test completed successfully!');
      } catch (error) {
        setStatus('error');
        setMessage('Connection test failed. Please check the console for details.');
      }
    }

    runTest();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">API Connection Test</h2>
          <p className="mt-2 text-gray-600">
            Testing connection to the backend API...
          </p>
        </div>

        <div className="mt-8">
          {status === 'loading' && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center text-green-600">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="mt-2">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center text-red-600">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <p className="mt-2">{message}</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Check the browser console for detailed test results.</p>
        </div>
      </div>
    </div>
  );
} 