import React, { useState } from 'react';
import { X, Bug } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Mobile Debug Panel
 * Shows user object and debugging info directly on screen
 * Toggle by tapping the bug icon (bottom left)
 */
const MobileDebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 z-50 w-12 h-12 bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center"
        aria-label="Open debug panel"
      >
        <Bug className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 overflow-auto p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl mx-auto my-4">
        {/* Header */}
        <div className="bg-red-600 text-white p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Bug className="w-5 h-5" />
            <h2 className="font-bold">Debug Panel</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Loading State */}
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-semibold text-sm text-gray-700 mb-1">Auth Loading:</div>
            <div className={`text-lg font-bold ${loading ? 'text-yellow-600' : 'text-green-600'}`}>
              {loading ? 'TRUE (still loading)' : 'FALSE (loaded)'}
            </div>
          </div>

          {/* User Exists */}
          <div className="bg-gray-50 p-3 rounded">
            <div className="font-semibold text-sm text-gray-700 mb-1">User Object Exists:</div>
            <div className={`text-lg font-bold ${user ? 'text-green-600' : 'text-red-600'}`}>
              {user ? 'TRUE ✓' : 'FALSE ✗'}
            </div>
          </div>

          {/* User Details */}
          {user ? (
            <>
              <div className="bg-green-50 p-3 rounded">
                <div className="font-semibold text-sm text-gray-700 mb-2">User ID:</div>
                <div className="text-sm font-mono break-all">
                  {user.id || '❌ MISSING'}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded">
                <div className="font-semibold text-sm text-gray-700 mb-2">Email:</div>
                <div className="text-sm font-mono break-all">
                  {user.email || '❌ MISSING'}
                </div>
              </div>

              <div className="bg-purple-50 p-3 rounded">
                <div className="font-semibold text-sm text-gray-700 mb-2">Name / Full Name:</div>
                <div className="text-sm font-mono break-all">
                  {user.name || user.full_name || '❌ MISSING'}
                </div>
                {user.name && user.full_name && (
                  <div className="text-xs text-gray-500 mt-1">
                    (Has both name and full_name fields)
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 p-3 rounded">
                <div className="font-semibold text-sm text-gray-700 mb-2">Plan:</div>
                <div className="text-lg font-bold">
                  {user.plan || '❌ MISSING'}
                </div>
              </div>

              <div className="bg-pink-50 p-3 rounded">
                <div className="font-semibold text-sm text-gray-700 mb-2">Role:</div>
                <div className="text-sm font-mono">
                  {user.role || '❌ MISSING'}
                </div>
              </div>

              {/* Full User Object */}
              <div className="bg-gray-100 p-3 rounded">
                <div className="font-semibold text-sm text-gray-700 mb-2">Full User Object (JSON):</div>
                <pre className="text-xs font-mono bg-white p-2 rounded overflow-auto max-h-64">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </>
          ) : (
            <div className="bg-red-50 p-4 rounded text-center">
              <div className="text-red-700 font-semibold mb-2">⚠️ USER OBJECT IS NULL</div>
              <div className="text-sm text-red-600">
                User is not loaded. This means either:
                <ul className="mt-2 text-left list-disc list-inside">
                  <li>Not logged in</li>
                  <li>Session expired</li>
                  <li>Cookie not being sent</li>
                  <li>/api/auth/me failed</li>
                </ul>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded border-2 border-blue-200">
            <div className="font-semibold text-sm text-blue-900 mb-2">📋 What to check:</div>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li><strong>If user is NULL:</strong> Authentication failed - check login credentials</li>
              <li><strong>If name is MISSING:</strong> Backend not returning name field</li>
              <li><strong>If plan is MISSING:</strong> Backend not returning plan field (P&L won't work!)</li>
              <li><strong>If loading is TRUE:</strong> Auth still checking - wait a moment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDebugPanel;
