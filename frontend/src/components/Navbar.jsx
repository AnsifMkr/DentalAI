// components/Navbar.jsx
import React from 'react';

export default function Navbar({ userRole, notifications, onLogout }) {
  const unreadCount = userRole === 'doctor'
    ? notifications.filter((n) => !n.read).length
    : 0;

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              🦷 DentalAI - {userRole === 'doctor' ? 'Doctor' : 'Patient'} Dashboard
            </h1>
            {unreadCount > 0 && (
              <span className="ml-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
