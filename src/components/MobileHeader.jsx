import React from 'react';

const MobileHeader = ({ 
  user, 
  signOut, 
  selectedTeam, 
  onMobileMenuToggle, 
  isMobileMenuOpen 
}) => {
  return (
    <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Menu Toggle */}
        <button
          onClick={onMobileMenuToggle}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="sr-only">Open menu</span>
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Center: Team Name or App Title */}
        <div className="flex-1 text-center">
          {selectedTeam ? (
            <div>
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {selectedTeam.name}
              </h1>
              {selectedTeam.ageGroup && (
                <p className="text-xs text-gray-500">{selectedTeam.ageGroup}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">🏀</span>
              <h1 className="text-lg font-bold text-gray-900">Coach Platform</h1>
            </div>
          )}
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center space-x-2">
          {/* User Avatar/Menu */}
          <div className="relative">
            <button className="flex items-center space-x-2 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.signInDetails?.loginId?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </button>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={signOut}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader; 