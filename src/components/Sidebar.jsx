import React from 'react';

const Sidebar = ({ 
  currentView, 
  onViewChange, 
  selectedTeam, 
  onTeamSelect, 
  onUpload, 
  isMobileMenuOpen, 
  onMobileMenuToggle,
  stats = {} 
}) => {
  const { totalPlayers = 0, totalGames = 0, totalMarkers = 0 } = stats;

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z" />
        </svg>
      ),
      badge: null,
      description: 'Team overview'
    },
    {
      id: 'analysis',
      name: 'Video Analysis',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      badge: totalMarkers > 0 ? totalMarkers : null,
      description: 'Game footage review'
    },
    {
      id: 'players',
      name: 'Players',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      badge: totalPlayers > 0 ? totalPlayers : null,
      description: 'Roster management'
    },
    {
      id: 'games',
      name: 'Games',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      badge: totalGames > 0 ? totalGames : null,
      description: 'Game schedule & history'
    }
  ];

  const quickActions = [
    {
      name: 'Upload Video',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      onClick: onUpload,
      color: 'bg-blue-500 hover:bg-blue-600',
      disabled: !selectedTeam
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onMobileMenuToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">🏀</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Coach Platform</h1>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Team Selector */}
        <div className="p-4 border-b border-gray-200">
          {selectedTeam ? (
            <button
              onClick={onTeamSelect}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
            >
              <div>
                <div className="font-medium text-gray-900 truncate">{selectedTeam.name}</div>
                <div className="text-sm text-gray-500 flex items-center space-x-2">
                  {selectedTeam.ageGroup && <span>{selectedTeam.ageGroup}</span>}
                  {selectedTeam.season && <span>• {selectedTeam.season}</span>}
                </div>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onTeamSelect}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div className="text-sm font-medium">Select Team</div>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Navigation
          </div>
          
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                // Close mobile menu after selection
                if (window.innerWidth < 1024) {
                  onMobileMenuToggle();
                }
              }}
              disabled={!selectedTeam && item.id !== 'dashboard'}
              className={`
                w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 text-left group
                ${currentView === item.id 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
                ${!selectedTeam && item.id !== 'dashboard' ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  ${currentView === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                `}>
                  {item.icon}
                </div>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </div>
              
              {item.badge && (
                <span className={`
                  inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full
                  ${currentView === item.id 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Quick Actions
          </div>
          
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`
                  w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left text-white
                  ${action.color}
                  ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {action.icon}
                <span className="font-medium">{action.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            Made with ❤️ for coaches
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 