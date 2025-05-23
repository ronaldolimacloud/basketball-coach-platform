import React from 'react';

const EnhancedTeamDashboard = ({ 
  selectedTeam, 
  players, 
  games, 
  markers, 
  onSwitchTeam,
  onUploadClick,
  onManagePlayersClick,
  onViewAnalyticsClick 
}) => {
  const calculateTeamStats = () => {
    const totalGames = games.length;
    const completedGames = games.filter(game => game.uploadStatus === 'completed').length;
    const totalPlayers = players.length;
    const totalMarkers = markers.length;
    
    // Calculate win/loss record
    const gamesWithScores = games.filter(game => game.ourScore !== null && game.opponentScore !== null);
    const wins = gamesWithScores.filter(game => game.ourScore > game.opponentScore).length;
    const losses = gamesWithScores.filter(game => game.ourScore < game.opponentScore).length;
    
    // Calculate marker categories
    const positiveMarkers = markers.filter(m => m.type === 'positive').length;
    const improvementMarkers = markers.filter(m => m.type === 'improvement').length;
    
    return {
      totalGames,
      completedGames,
      totalPlayers,
      totalMarkers,
      wins,
      losses,
      positiveMarkers,
      improvementMarkers,
      winPercentage: gamesWithScores.length > 0 ? (wins / gamesWithScores.length * 100).toFixed(1) : 0
    };
  };

  const stats = calculateTeamStats();

  if (!selectedTeam) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 9a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No Team Selected</h3>
          <p className="text-gray-600 mb-6">Select a team or create your first team to get started with video analysis and player management.</p>
          <button
            onClick={onSwitchTeam}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Select Team
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Team Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg text-white overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl sm:text-3xl font-bold">{selectedTeam.name}</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  selectedTeam.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedTeam.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                {selectedTeam.ageGroup && (
                  <span className="flex items-center space-x-1">
                    <span>🏀</span>
                    <span>{selectedTeam.ageGroup}</span>
                  </span>
                )}
                {selectedTeam.season && (
                  <span className="flex items-center space-x-1">
                    <span>📅</span>
                    <span>{selectedTeam.season}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1">
                  <span>👥</span>
                  <span>{stats.totalPlayers} players</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>🎮</span>
                  <span>{stats.totalGames} games</span>
                </span>
              </div>
              
              {selectedTeam.description && (
                <p className="text-blue-100 mt-3 max-w-lg">{selectedTeam.description}</p>
              )}
            </div>
            
            <button
              onClick={onSwitchTeam}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all self-start"
            >
              Switch Team
            </button>
          </div>
        </div>
        
        {/* Quick Stats Bar */}
        <div className="bg-white bg-opacity-10 px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{stats.wins}-{stats.losses}</div>
              <div className="text-xs text-blue-100">Record</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.winPercentage}%</div>
              <div className="text-xs text-blue-100">Win Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.completedGames}</div>
              <div className="text-xs text-blue-100">Videos</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalMarkers}</div>
              <div className="text-xs text-blue-100">Markers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Games Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-2xl">🎮</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalGames}</p>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Games</p>
            <p className="text-xs text-gray-500">{stats.completedGames} with video analysis</p>
            {stats.totalGames > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Video Coverage</span>
                  <span>{Math.round((stats.completedGames / stats.totalGames) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${(stats.completedGames / stats.totalGames) * 100}%`}}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Win/Loss Record */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl">🏆</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{stats.wins}-{stats.losses}</p>
            <p className="text-sm font-medium text-gray-600 mb-1">Season Record</p>
            <p className="text-xs text-gray-500">{stats.winPercentage}% win rate</p>
            {(stats.wins + stats.losses) > 0 && (
              <div className="mt-3 flex space-x-2">
                <div className="flex-1">
                  <div className="text-xs text-green-600 mb-1">Wins: {stats.wins}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{width: `${(stats.wins / (stats.wins + stats.losses)) * 100}%`}}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-red-600 mb-1">Losses: {stats.losses}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                      style={{width: `${(stats.losses / (stats.wins + stats.losses)) * 100}%`}}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Players */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <span className="text-2xl">👥</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPlayers}</p>
            <p className="text-sm font-medium text-gray-600 mb-1">Active Players</p>
            <p className="text-xs text-gray-500">Team roster size</p>
            <button
              onClick={onManagePlayersClick}
              className="mt-3 w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors"
            >
              Manage Roster
            </button>
          </div>
        </div>

        {/* Analysis Markers */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalMarkers}</p>
            <p className="text-sm font-medium text-gray-600 mb-1">Analysis Markers</p>
            <p className="text-xs text-gray-500">Total feedback points</p>
            {stats.totalMarkers > 0 && (
              <div className="mt-3 flex justify-between">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{stats.positiveMarkers}</div>
                  <div className="text-xs text-gray-500">Positive</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">{stats.improvementMarkers}</div>
                  <div className="text-xs text-gray-500">Improvement</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions - Mobile Optimized */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold mb-6 text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={onUploadClick}
            className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-200 group border border-blue-200"
          >
            <div className="p-3 bg-blue-500 text-white rounded-xl mb-3 group-hover:bg-blue-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 mb-1">Upload Game</p>
              <p className="text-sm text-gray-600">Add new game video for analysis</p>
            </div>
          </button>

          <button
            onClick={onManagePlayersClick}
            className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-200 group border border-purple-200"
          >
            <div className="p-3 bg-purple-500 text-white rounded-xl mb-3 group-hover:bg-purple-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 mb-1">Manage Players</p>
              <p className="text-sm text-gray-600">Add or edit team roster</p>
            </div>
          </button>

          <button
            onClick={onViewAnalyticsClick}
            className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-200 group border border-green-200"
          >
            <div className="p-3 bg-green-500 text-white rounded-xl mb-3 group-hover:bg-green-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 mb-1">Video Analysis</p>
              <p className="text-sm text-gray-600">Review game footage & markers</p>
            </div>
          </button>

          <button className="flex flex-col items-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-xl transition-all duration-200 group border border-yellow-200">
            <div className="p-3 bg-yellow-500 text-white rounded-xl mb-3 group-hover:bg-yellow-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 mb-1">Export Report</p>
              <p className="text-sm text-gray-600">Generate team performance report</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity - Enhanced for Mobile */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          <span className="text-sm text-gray-500">{games.length} total games</span>
        </div>
        
        <div className="space-y-3">
          {games.slice(0, 5).map((game) => (
            <div key={game.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                game.uploadStatus === 'completed' ? 'bg-green-500' : 
                game.uploadStatus === 'uploading' ? 'bg-yellow-500' : 
                'bg-gray-400'
              }`}></div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-gray-900 truncate">vs {game.opponent}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(game.date).toLocaleDateString()} • {game.gameType}
                      {game.ourScore !== null && game.opponentScore !== null && (
                        <span className={`ml-2 font-medium ${
                          game.ourScore > game.opponentScore ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {game.ourScore}-{game.opponentScore}
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 sm:mt-0 ${
                    game.uploadStatus === 'completed' ? 'bg-green-100 text-green-800' :
                    game.uploadStatus === 'uploading' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {game.uploadStatus === 'completed' ? '✓ Ready' : 
                     game.uploadStatus === 'uploading' ? '⏳ Uploading' : '⏸ Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {games.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">No games uploaded yet for this team</p>
              <button
                onClick={onUploadClick}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Upload your first game →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedTeamDashboard; 