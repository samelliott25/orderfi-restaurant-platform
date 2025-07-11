import React from 'react';

export default function TestMobile() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Mobile Navigation Test</h1>
      
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Test Page</h2>
          <p>This is a simple test page to verify mobile navigation works.</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Features to Test:</h3>
          <ul className="text-blue-700 mt-2 space-y-1">
            <li>• Mobile navigation bottom bar</li>
            <li>• ChatOps AI center button</li>
            <li>• Scrollable left/right navigation</li>
            <li>• Touch-friendly interfaces</li>
          </ul>
        </div>
      </div>
      
      {/* Simple Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}